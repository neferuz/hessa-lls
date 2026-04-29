from fastapi import APIRouter, Header, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import base64
import time
from typing import Optional

from ...core.database import get_db
from ...core.config import settings
from ...models.payme import PaymeTransaction
from ...models.user import User
from ...schemas.payme import PaymeRequest, PaymeResponse, PaymeError

router = APIRouter(prefix="/payment/payme", tags=["payme"])

# From config or defaults
PAYME_LOGIN = getattr(settings, "PAYME_LOGIN", "Paycom")
PAYME_PASSWORD = getattr(settings, "PAYME_PASSWORD", "test")

class PaymeException(Exception):
    def __init__(self, code: int, message: dict, data: Optional[str] = None):
        self.error = PaymeError(code=code, message=message, data=data)

def check_auth(authorization: str):
    if not authorization or not authorization.startswith("Basic "):
        raise PaymeException(-32504, {"ru": "Неверная авторизация", "uz": "Avtorizatsiya xato", "en": "Unauthorized"})

    token = authorization.split(" ")[1]
    try:
        decoded = base64.b64decode(token).decode("utf-8")
        login, password = decoded.split(":", 1)
        if login != PAYME_LOGIN or password != PAYME_PASSWORD:
            raise PaymeException(-32504, {"ru": "Неверный логин или пароль", "uz": "Login yoki parol xato", "en": "Invalid login or password"})
    except Exception:
        raise PaymeException(-32504, {"ru": "Неверная авторизация", "uz": "Avtorizatsiya xato", "en": "Unauthorized"})

def current_time_ms() -> int:
    return int(time.time() * 1000)

@router.post("/", response_model=PaymeResponse)
async def payme_endpoint(
    request: PaymeRequest,
    req: Request,
    db: AsyncSession = Depends(get_db)
):
    try:
        check_auth(req.headers.get("Authorization"))

        method = request.method
        if method == "CheckPerformTransaction":
            return await check_perform_transaction(request, db)
        elif method == "CreateTransaction":
            return await create_transaction(request, db)
        elif method == "PerformTransaction":
            return await perform_transaction(request, db)
        elif method == "CancelTransaction":
            return await cancel_transaction(request, db)
        elif method == "CheckTransaction":
            return await check_transaction(request, db)
        elif method == "GetStatement":
            return await get_statement(request, db)
        else:
            raise PaymeException(-32601, {"ru": "Метод не найден", "uz": "Metod topilmadi", "en": "Method not found"})

    except PaymeException as e:
        return PaymeResponse(error=e.error, id=request.id)
    except Exception as e:
        return PaymeResponse(error=PaymeError(code=-32400, message={"ru": str(e), "uz": str(e), "en": str(e)}), id=request.id)

async def check_perform_transaction(req: PaymeRequest, db: AsyncSession):
    params = req.params
    if not params.account or not params.account.user_id:
        raise PaymeException(-31050, {"ru": "Аккаунт не указан"}, "user_id")

    try:
        user_id = int(params.account.user_id)
    except ValueError:
        raise PaymeException(-31050, {"ru": "Пользователь не найден"}, "user_id")
        
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise PaymeException(-31050, {"ru": "Пользователь не найден"}, "user_id")

    amount = params.amount
    if not amount or amount <= 0:
        raise PaymeException(-31001, {"ru": "Неверная сумма"})

    return PaymeResponse(
        id=req.id,
        result={
            "allow": True,
            "detail": {
                "receipt_type": 0,
                "items": [
                    {
                        "title": "Оплата подписки Hessa", # Hardcoded title for now based on doc spec
                        "price": amount,
                        "count": 1,
                        "code": "10404001001000000", # Need actual IKPU code for valid fiscalization
                        "vat_percent": 0,
                        "package_code": "1040400"
                    }
                ]
            }
        }
    )

async def create_transaction(req: PaymeRequest, db: AsyncSession):
    params = req.params
    payme_id = params.id
    
    if not params.account or not params.account.user_id:
        raise PaymeException(-31050, {"ru": "Аккаунт не указан"}, "user_id")
        
    try:
        user_id = int(params.account.user_id)
    except:
        raise PaymeException(-31050, {"ru": "Аккаунт не найден"}, "user_id")
        
    res = await db.execute(select(PaymeTransaction).where(PaymeTransaction.payme_id == payme_id))
    transaction = res.scalar_one_or_none()

    if transaction:
        if transaction.state != 1:
            raise PaymeException(-31008, {"ru": "Транзакция уже проведена или отменена"})
        # Already exists and active, return existing values
        return PaymeResponse(
            id=req.id,
            result={
                "create_time": transaction.create_time,
                "transaction": str(transaction.id),
                "state": transaction.state
            }
        )

    await check_perform_transaction(req, db)
    
    if current_time_ms() - params.time > 12 * 3600 * 1000:
        raise PaymeException(-31008, {"ru": "Время оплаты истекло"})

    new_tx = PaymeTransaction(
        payme_id=payme_id,
        user_id=user_id,
        amount=params.amount,
        state=1,
        create_time=params.time,
        perform_time=0,
        cancel_time=0
    )
    db.add(new_tx)
    await db.commit()
    await db.refresh(new_tx)

    return PaymeResponse(
        id=req.id,
        result={
            "create_time": new_tx.create_time,
            "transaction": str(new_tx.id),
            "state": new_tx.state
        }
    )


async def perform_transaction(req: PaymeRequest, db: AsyncSession):
    params = req.params
    payme_id = params.id
    
    res = await db.execute(select(PaymeTransaction).where(PaymeTransaction.payme_id == payme_id))
    transaction = res.scalar_one_or_none()

    if not transaction:
        raise PaymeException(-31003, {"ru": "Транзакция не найдена"})

    if transaction.state == 1:
        if current_time_ms() - transaction.create_time > 12 * 3600 * 1000:
            # cancel via timeout instead of perform? Need to mark it cancelled.
            transaction.state = -1
            transaction.cancel_time = current_time_ms()
            transaction.reason = 4
            await db.commit()
            raise PaymeException(-31008, {"ru": "Время оплаты истекло (timeout)"})
            
        transaction.state = 2
        transaction.perform_time = current_time_ms()
        # TODO: Activate subscription logic for `transaction.user_id` should go here
        await db.commit()
        await db.refresh(transaction)
        
        return PaymeResponse(
            id=req.id,
            result={
                "transaction": str(transaction.id),
                "perform_time": transaction.perform_time,
                "state": transaction.state
            }
        )
    elif transaction.state == 2:
        return PaymeResponse(
            id=req.id,
            result={
                "transaction": str(transaction.id),
                "perform_time": transaction.perform_time,
                "state": transaction.state
            }
        )
    else:
        raise PaymeException(-31008, {"ru": "Не верное состояние транзакции"})

async def cancel_transaction(req: PaymeRequest, db: AsyncSession):
    params = req.params
    payme_id = params.id
    reason = params.reason
    
    res = await db.execute(select(PaymeTransaction).where(PaymeTransaction.payme_id == payme_id))
    transaction = res.scalar_one_or_none()

    if not transaction:
        raise PaymeException(-31003, {"ru": "Транзакция не найдена"})

    if transaction.state == 1:
        transaction.state = -1
        transaction.cancel_time = current_time_ms()
        transaction.reason = reason
        await db.commit()
    elif transaction.state == 2:
        transaction.state = -2
        transaction.cancel_time = current_time_ms()
        transaction.reason = reason
        await db.commit()
        # TODO: Reverse the subscription logic here

    return PaymeResponse(
        id=req.id,
        result={
            "transaction": str(transaction.id),
            "cancel_time": transaction.cancel_time,
            "state": transaction.state
        }
    )

async def check_transaction(req: PaymeRequest, db: AsyncSession):
    params = req.params
    payme_id = params.id
    
    res = await db.execute(select(PaymeTransaction).where(PaymeTransaction.payme_id == payme_id))
    transaction = res.scalar_one_or_none()

    if not transaction:
        raise PaymeException(-31003, {"ru": "Транзакция не найдена"})

    return PaymeResponse(
        id=req.id,
        result={
            "create_time": transaction.create_time,
            "perform_time": transaction.perform_time,
            "cancel_time": transaction.cancel_time,
            "transaction": str(transaction.id),
            "state": transaction.state,
            "reason": transaction.reason
        }
    )

async def get_statement(req: PaymeRequest, db: AsyncSession):
    params = req.params
    from_time = params.from_time
    to_time = params.to
    
    # Query transactions bridging this period depending on create_time/perform_time bounds or similar
    # Generally Payme queries by create_time, though sometimes perform_time
    res = await db.execute(
        select(PaymeTransaction).where(
            PaymeTransaction.create_time >= from_time,
            PaymeTransaction.create_time <= to_time
        )
    )
    transactions = res.scalars().all()
    
    tx_list = []
    for tx in transactions:
        tx_list.append({
            "id": tx.payme_id,
            "time": tx.create_time,
            "amount": tx.amount,
            "account": {"user_id": str(tx.user_id)},
            "create_time": tx.create_time,
            "perform_time": tx.perform_time,
            "cancel_time": tx.cancel_time,
            "transaction": str(tx.id),
            "state": tx.state,
            "reason": tx.reason
        })
        
    return PaymeResponse(
        id=req.id,
        result={
            "transactions": tx_list
        }
    )
