from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Float, Boolean, JSON, ForeignKey, DateTime
from datetime import datetime
from typing import Optional, List, Dict
from sqlalchemy.sql import func
from ..core.database import Base

class Sachet(Base):
    __tablename__ = "sachets"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    
    # Information
    description_short: Mapped[Optional[str]] = mapped_column(String(500))
    description_long: Mapped[Optional[str]] = mapped_column(Text)
    benefits: Mapped[Optional[List[str]]] = mapped_column(JSON, default=[]) # List of benefits
    usage: Mapped[Optional[str]] = mapped_column(Text)
    
    # Metrics
    dosage: Mapped[Optional[str]] = mapped_column(String(100)) # e.g. "500mg"
    weight_g: Mapped[float] = mapped_column(Float, default=0.0) # weight in grams
    
    # Economics
    cost_price: Mapped[float] = mapped_column(Float, default=0.0)
    customs_percent: Mapped[float] = mapped_column(Float, default=0.0)
    tax_percent: Mapped[float] = mapped_column(Float, default=0.0)
    sale_price: Mapped[float] = mapped_column(Float, default=0.0)
    
    # Media
    image_url: Mapped[Optional[str]] = mapped_column(String(500))
    icon_url: Mapped[Optional[str]] = mapped_column(String(500))
    
    # Metadata
    composition: Mapped[Optional[Dict]] = mapped_column(JSON, nullable=True) # Full structured data
    is_active: Mapped[bool] = mapped_column(default=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
