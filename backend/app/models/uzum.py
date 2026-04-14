from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, BigInteger, DateTime, ForeignKey
from sqlalchemy.sql import func
from typing import Optional
from datetime import datetime
from ..core.database import Base

class UzumTransaction(Base):
    __tablename__ = "uzum_transactions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    uzum_transaction_id: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    amount: Mapped[int] = mapped_column(BigInteger) # in tiyins
    status: Mapped[str] = mapped_column(String(20)) # CREATED / CONFIRMED / FAILED / REVERSED

    create_time: Mapped[int] = mapped_column(BigInteger)
    confirm_time: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    reverse_time: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
