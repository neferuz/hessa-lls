import asyncio
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

async def test():
    token = os.getenv("ESKIZ_TOKEN")
    phone = "998940001122" # random phone to just check API response
    text = "Это тест от Eskiz"
    
    print(f"Token: {token[:10]}...")
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://notify.eskiz.uz/api/message/sms/send",
            headers={"Authorization": f"Bearer {token}"},
            data={
                "mobile_phone": phone,
                "message": text,
                "from": "4546",
                "callback_url": ""
            }
        )
        print("Status:", res.status_code)
        print("Response:", res.text)

if __name__ == "__main__":
    asyncio.run(test())
