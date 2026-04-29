import asyncio
import sys
import os

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), "backend")))

from app.core.database import SessionLocal
from app.models.sachet import Sachet
from sqlalchemy import select

async def run():
    async with SessionLocal() as db:
        res = await db.execute(select(Sachet))
        sachets = res.scalars().all()
        for s in sachets:
            print(f"ID: {s.id} | Name: {s.name} | Image: {s.image_url}")

if __name__ == "__main__":
    asyncio.run(run())
