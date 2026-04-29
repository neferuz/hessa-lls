from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, BigInteger, DateTime, ForeignKey
from sqlalchemy.sql import func
from typing import Optional
from datetime import datetime
from ..core.database import Base

class PaymeTransaction(Base):
    __tablename__ = "payme_transactions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    payme_id: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    amount: Mapped[int] = mapped_column(BigInteger) # in tiyins
    state: Mapped[int] = mapped_column(Integer) # 1: created, 2: completed, -1: cancelled, -2: refunded
    reason: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    create_time: Mapped[int] = mapped_column(BigInteger)
    perform_time: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True, default=0)
    cancel_time: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True, default=0)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
