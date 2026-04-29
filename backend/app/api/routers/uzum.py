from fastapi import APIRouter, Header, Request, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import base64
import time
from typing import Optional

from ...core.database import get_db
from ...core.config import settings
from ...models.uzum import UzumTransaction
from ...models.user import User
from ...schemas.uzum import UzumRequest, UzumResponse

router = APIRouter(prefix="/payment/uzum", tags=["uzum"])

UZUM_USERNAME = getattr(settings, "UZUM_USERNAME", "uzum")
UZUM_PASSWORD = getattr(settings, "UZUM_PASSWORD", "test")
UZUM_SERVICE_ID = int(getattr(settings, "UZUM_SERVICE_ID", "12345"))

def check_auth(authorization: str):
    if not authorization or not authorization.startswith("Basic "):
        raise UzumException("AUTH_ERROR", "Unauthorized")

    token = authorization.split(" ")[1]
    try:
        decoded = base64.b64decode(token).decode("utf-8")
        login, password = decoded.split(":", 1)
        if login != UZUM_USERNAME or password != UZUM_PASSWORD:
            raise UzumException("AUTH_ERROR", "Invalid login or password")
    except Exception:
        raise UzumException("AUTH_ERROR", "Unauthorized")

class UzumException(Exception):
    def __init__(self, error_code: str, error_message: str):
        self.error_code = error_code
        self.error_message = error_message

def current_time_ms() -> int:
    return int(time.time() * 1000)

@router.post("/check", response_model=UzumResponse)
async def check_transaction(req: UzumRequest, request: Request, db: AsyncSession = Depends(get_db)):
    try:
        check_auth(request.headers.get("Authorization"))
        if req.serviceId != UZUM_SERVICE_ID:
            raise UzumException("INVALID_SERVICE", "Invalid serviceId")

        params = req.params
        if not params.userId:
            raise UzumException("USER_NOT_FOUND", "userId is required")
            
        try:
            user_id_int = int(params.userId)
        except ValueError:
            raise UzumException("USER_NOT_FOUND", "Invalid userId")

        result = await db.execute(select(User).where(User.id == user_id_int))
        user = result.scalar_one_or_none()
        if not user:
            raise UzumException("USER_NOT_FOUND", "Пользователь не найден")

        amount = params.amount
        if not amount or amount <= 0:
            raise UzumException("INVALID_AMOUNT", "Неверная сумма платежа")

        return UzumResponse(
            serviceId=UZUM_SERVICE_ID,
            timestamp=current_time_ms(),
            status="OK",
            data={
                "userId": str(user.id),
                "name": user.username or "User",
                "amount": amount
            }
        )
    except UzumException as e:
        return UzumResponse(
            serviceId=req.serviceId,
            timestamp=current_time_ms(),
            status="FAILED",
            errorCode=e.error_code,
            errorMessage=e.error_message
        )
    except Exception as e:
        return UzumResponse(
            serviceId=req.serviceId,
            timestamp=current_time_ms(),
            status="FAILED",
            errorCode="INTERNAL_ERROR",
            errorMessage=str(e)
        )

@router.post("/create", response_model=UzumResponse)
async def create_transaction_uzum(req: UzumRequest, request: Request, db: AsyncSession = Depends(get_db)):
    try:
        check_auth(request.headers.get("Authorization"))
        if req.serviceId != UZUM_SERVICE_ID:
            raise UzumException("INVALID_SERVICE", "Invalid serviceId")

        params = req.params
        if not params.userId or not params.transactionId or not params.amount:
            raise UzumException("INVALID_PARAMS", "Missing create parameters")

        try:
            user_id_int = int(params.userId)
        except ValueError:
            raise UzumException("USER_NOT_FOUND", "Invalid userId")

        res = await db.execute(select(UzumTransaction).where(UzumTransaction.uzum_transaction_id == params.transactionId))
        transaction = res.scalar_one_or_none()

        if transaction:
            return UzumResponse(
                serviceId=UZUM_SERVICE_ID,
                timestamp=current_time_ms(),
                status="OK",
                transactionId=str(transaction.id),
                transactionTime=transaction.create_time
            )

        new_tx = UzumTransaction(
            uzum_transaction_id=params.transactionId,
            user_id=user_id_int,
            amount=params.amount,
            status="CREATED",
            create_time=current_time_ms(),
            confirm_time=None,
            reverse_time=None
        )
        db.add(new_tx)
        await db.commit()
        await db.refresh(new_tx)

        return UzumResponse(
            serviceId=UZUM_SERVICE_ID,
            timestamp=current_time_ms(),
            status="OK",
            transactionId=str(new_tx.id),
            transactionTime=new_tx.create_time
        )
    except UzumException as e:
        return UzumResponse(serviceId=req.serviceId, timestamp=current_time_ms(), status="FAILED", errorCode=e.error_code, errorMessage=e.error_message)

@router.post("/confirm", response_model=UzumResponse)
async def confirm_transaction(req: UzumRequest, request: Request, db: AsyncSession = Depends(get_db)):
    try:
        check_auth(request.headers.get("Authorization"))
        params = req.params
        res = await db.execute(select(UzumTransaction).where(UzumTransaction.uzum_transaction_id == params.transactionId))
        transaction = res.scalar_one_or_none()

        if not transaction:
            raise UzumException("TRANSACTION_NOT_FOUND", "Transaction not found")

        if transaction.status == "CONFIRMED":
            return UzumResponse(
                serviceId=UZUM_SERVICE_ID,
                timestamp=current_time_ms(),
                status="CONFIRMED",
                transactionId=str(transaction.id),
                transactionTime=transaction.confirm_time or transaction.create_time
            )
        elif transaction.status == "CREATED":
            # Check 30 minutes timeout
            if current_time_ms() - transaction.create_time > 30 * 60 * 1000:
                transaction.status = "FAILED"
                await db.commit()
                # Remove booking logic here
                return UzumResponse(serviceId=UZUM_SERVICE_ID, timestamp=current_time_ms(), status="FAILED", errorCode="TIMEOUT", errorMessage="Transaction timeout")
                
            transaction.status = "CONFIRMED"
            transaction.confirm_time = current_time_ms()
            await db.commit()
            await db.refresh(transaction)
            
            # TODO: Activate subscription
            return UzumResponse(
                serviceId=UZUM_SERVICE_ID,
                timestamp=current_time_ms(),
                status="CONFIRMED",
                transactionId=str(transaction.id),
                transactionTime=transaction.confirm_time
            )
        else:
            # Return current status
            return UzumResponse(serviceId=UZUM_SERVICE_ID, timestamp=current_time_ms(), status=transaction.status, transactionId=str(transaction.id), transactionTime=transaction.create_time)
    except UzumException as e:
        return UzumResponse(serviceId=req.serviceId, timestamp=current_time_ms(), status="FAILED", errorCode=e.error_code, errorMessage=e.error_message)

@router.post("/reverse", response_model=UzumResponse)
async def reverse_transaction(req: UzumRequest, request: Request, db: AsyncSession = Depends(get_db)):
    try:
        check_auth(request.headers.get("Authorization"))
        params = req.params
        res = await db.execute(select(UzumTransaction).where(UzumTransaction.uzum_transaction_id == params.transactionId))
        transaction = res.scalar_one_or_none()

        if not transaction:
            raise UzumException("TRANSACTION_NOT_FOUND", "Transaction not found")

        if transaction.status == "REVERSED":
            return UzumResponse(serviceId=UZUM_SERVICE_ID, timestamp=current_time_ms(), status="REVERSED", transactionId=str(transaction.id), transactionTime=transaction.reverse_time)

        if transaction.status in ["CREATED", "CONFIRMED"]:
            transaction.status = "REVERSED"
            transaction.reverse_time = current_time_ms()
            await db.commit()
            # TODO: Deactivate subscription if needed
            return UzumResponse(serviceId=UZUM_SERVICE_ID, timestamp=current_time_ms(), status="REVERSED", transactionId=str(transaction.id), transactionTime=transaction.reverse_time)
        
        return UzumResponse(serviceId=UZUM_SERVICE_ID, timestamp=current_time_ms(), status=transaction.status, transactionId=str(transaction.id), transactionTime=transaction.create_time)

    except UzumException as e:
        return UzumResponse(serviceId=req.serviceId, timestamp=current_time_ms(), status="FAILED", errorCode=e.error_code, errorMessage=e.error_message)

@router.post("/status", response_model=UzumResponse)
async def status_transaction(req: UzumRequest, request: Request, db: AsyncSession = Depends(get_db)):
    try:
        check_auth(request.headers.get("Authorization"))
        params = req.params
        res = await db.execute(select(UzumTransaction).where(UzumTransaction.uzum_transaction_id == params.transactionId))
        transaction = res.scalar_one_or_none()

        if not transaction:
            raise UzumException("TRANSACTION_NOT_FOUND", "Transaction not found")

        # check timeout for CREATED
        if transaction.status == "CREATED":
            if current_time_ms() - transaction.create_time > 30 * 60 * 1000:
                transaction.status = "FAILED"
                await db.commit()

        # If it's failed, return FAILED instead of CREATED infinitely (Based on Uzum notes)
        if transaction.status == "FAILED":
             return UzumResponse(serviceId=UZUM_SERVICE_ID, timestamp=current_time_ms(), status="FAILED", errorCode="TIMEOUT", errorMessage="Timeout")

        t_time = transaction.confirm_time or transaction.create_time
        if transaction.status == "REVERSED":
            t_time = transaction.reverse_time or transaction.create_time
            
        return UzumResponse(serviceId=UZUM_SERVICE_ID, timestamp=current_time_ms(), status=transaction.status, transactionId=str(transaction.id), transactionTime=t_time)

    except UzumException as e:
        return UzumResponse(serviceId=req.serviceId, timestamp=current_time_ms(), status="FAILED", errorCode=e.error_code, errorMessage=e.error_message)
