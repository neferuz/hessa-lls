from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict
from datetime import datetime

class SachetBase(BaseModel):
    name: str
    slug: str
    description_short: Optional[str] = None
    description_long: Optional[str] = None
    benefits: Optional[List[str]] = []
    usage: Optional[str] = None
    dosage: Optional[str] = None
    weight_g: float = 0.0
    cost_price: float = 0.0
    customs_percent: float = 0.0
    tax_percent: float = 0.0
    sale_price: float = 0.0
    image_url: Optional[str] = None
    icon_url: Optional[str] = None
    composition: Optional[Dict] = None
    is_active: bool = True

class SachetCreate(SachetBase):
    pass

class SachetUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description_short: Optional[str] = None
    description_long: Optional[str] = None
    benefits: Optional[List[str]] = None
    usage: Optional[str] = None
    dosage: Optional[str] = None
    weight_g: Optional[float] = None
    cost_price: Optional[float] = None
    customs_percent: Optional[float] = None
    tax_percent: Optional[float] = None
    sale_price: Optional[float] = None
    image_url: Optional[str] = None
    icon_url: Optional[str] = None
    composition: Optional[Dict] = None
    is_active: Optional[bool] = None

class SachetRead(SachetBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
