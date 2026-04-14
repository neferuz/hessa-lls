import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from ..repositories.user_repository import UserRepository
from ..repositories.login_code_repository import LoginCodeRepository
from ..schemas.auth import RequestCodePayload, VerifyCodePayload, AuthUserResponse
from ..models.user import User
from .eskiz_service import EskizService

def _generate_4_digit_code() -> str:
    import random
    return f"{random.randint(0, 9999):04d}"

def _normalize_phone(phone: str) -> str:
    # Remove any non-digits
    clean = "".join(filter(str.isdigit, phone))
    # If it's a 9-digit local number, prepend Uzbekistan country code 998
    if len(clean) == 9:
        clean = "998" + clean
    return clean

class AuthService:
    """
    Сервис для телефона + 4‑значный код с отправкой SMS через Eskiz.uz.
    """
    def __init__(self, db: AsyncSession):
        self.users = UserRepository(db)
        self.codes = LoginCodeRepository(db)
        self.eskiz = EskizService()

    async def request_code(self, payload: RequestCodePayload) -> dict:
        phone = _normalize_phone(payload.phone)
        context = payload.context or "login"
        email_placeholder = f"{phone}@hessa.local"

        existing_user = await self.users.get_by_phone(phone)
        if not existing_user:
            user = User(
                username=phone,
                email=email_placeholder,
                phone=phone,
                hashed_password="",
            )
            await self.users.create(user)

        code = _generate_4_digit_code()
        await self.codes.create_code(email=phone, code=code, context=context)

        text = f"Hessa.uz — ваш код подтверждения: {code}"
        asyncio.create_task(self.eskiz.send_sms(phone, text))

        return {"phone": phone, "code": code} # Return purely code for DEV ease

    async def verify_code(self, payload: VerifyCodePayload) -> AuthUserResponse:
        phone = _normalize_phone(payload.phone)
        code = payload.code
        context = payload.context or "login"

        login_code = await self.codes.get_valid_code(email=phone, code=code, context=context)
        
        # Allow 0000 for DEV convenience
        if not login_code and code != "0000":
            raise HTTPException(status_code=400, detail="Неверный или просроченный код")
        
        if login_code:
            await self.codes.mark_used(login_code)

        user = await self.users.get_by_phone(phone)
        if not user:
            # Check referral code if provided
            invited_by_id = None
            if payload.referral_code:
                inviter = await self.users.get_by_referral_code(payload.referral_code)
                if inviter:
                    invited_by_id = inviter.id

            import uuid
            new_referral_code = uuid.uuid4().hex[:8].upper()
            
            user = User(
                username=phone,
                email=f"{phone}@hessa.local",
                phone=phone,
                hashed_password="",
                full_name=payload.full_name,
                invited_by_id=invited_by_id,
                referral_code=new_referral_code
            )
            created_user = await self.users.create(user)
            return AuthUserResponse.from_orm(created_user)
        else:
            if payload.full_name and user.full_name != payload.full_name:
                updated_user = await self.users.update(user.id, {"full_name": payload.full_name})
                if updated_user:
                    return AuthUserResponse.from_orm(updated_user)
            
            return AuthUserResponse.from_orm(user)

