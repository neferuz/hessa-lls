from fastapi import APIRouter, Depends, HTTPException, Body, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, update
from typing import List, Optional
from ...core.database import get_db
from ...models.sachet import Sachet
from ...schemas.sachet import SachetCreate, SachetUpdate, SachetRead

router = APIRouter(prefix="/sachets", tags=["Sachets"])

@router.post("", response_model=SachetRead)
async def create_sachet(sachet: SachetCreate, db: AsyncSession = Depends(get_db)):
    db_sachet = Sachet(**sachet.model_dump())
    db.add(db_sachet)
    await db.commit()
    await db.refresh(db_sachet)
    return db_sachet

@router.get("", response_model=List[SachetRead])
async def read_sachets(active_only: bool = False, db: AsyncSession = Depends(get_db)):
    stmt = select(Sachet)
    if active_only:
        stmt = stmt.where(Sachet.is_active == True)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{sachet_id}", response_model=SachetRead)
async def read_sachet(sachet_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(Sachet).where(Sachet.id == sachet_id)
    result = await db.execute(stmt)
    sachet = result.scalar_one_or_none()
    if not sachet:
        raise HTTPException(status_code=404, detail="Sachet not found")
    return sachet

@router.patch("/{sachet_id}", response_model=SachetRead)
async def update_sachet(sachet_id: int, sachet_update: SachetUpdate, db: AsyncSession = Depends(get_db)):
    stmt = select(Sachet).where(Sachet.id == sachet_id)
    result = await db.execute(stmt)
    db_sachet = result.scalar_one_or_none()
    
    if not db_sachet:
        raise HTTPException(status_code=404, detail="Sachet not found")
        
    update_data = sachet_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_sachet, key, value)
        
    await db.commit()
    await db.refresh(db_sachet)
    return db_sachet

@router.delete("/{sachet_id}")
async def delete_sachet(sachet_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(Sachet).where(Sachet.id == sachet_id)
    result = await db.execute(stmt)
    sachet = result.scalar_one_or_none()
    
    if not sachet:
        raise HTTPException(status_code=404, detail="Sachet not found")
        
    await db.delete(sachet)
    await db.commit()
    return {"message": "Sachet deleted successfully"}
