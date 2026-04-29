import httpx
import logging
from ..core.config import settings

logger = logging.getLogger(__name__)

ESKIZ_EMAIL = getattr(settings, "ESKIZ_EMAIL", "")
ESKIZ_PASSWORD = getattr(settings, "ESKIZ_PASSWORD", "")
ESKIZ_TOKEN = getattr(settings, "ESKIZ_TOKEN", "")

class EskizService:
    def __init__(self):
        self.token = ESKIZ_TOKEN

    async def _fetch_token(self) -> str:
        if not ESKIZ_EMAIL or not ESKIZ_PASSWORD:
            return ""
        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(
                    "https://notify.eskiz.uz/api/auth/login",
                    data={"email": ESKIZ_EMAIL, "password": ESKIZ_PASSWORD}
                )
                if res.status_code == 200:
                    return res.json().get("data", {}).get("token", "")
        except Exception as e:
            logger.error(f"Eskiz login error: {e}")
        return ""

    async def send_sms(self, phone: str, text: str):
        if not ESKIZ_EMAIL:
            print(f"[DEV] SMS to {phone}: {text}")
            return
            
        token = self.token
        if not token:
            token = await self._fetch_token()
            if not token:
                print(f"[DEV] Failed to get Eskiz token. SMS to {phone}: {text}")
                return
                
        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(
                    "https://notify.eskiz.uz/api/message/sms/send",
                    headers={"Authorization": f"Bearer {token}"},
                    data={
                        "mobile_phone": phone,
                        "message": text,
                        "from": "4546"
                    }
                )
                print(f"Eskiz SMS response: {res.status_code} {res.text}")
        except Exception as e:
            logger.error(f"Failed to send SMS to {phone}: {e}")
