from pydantic import BaseModel
from typing import Optional, Dict

class UzumParams(BaseModel):
    amount: Optional[int] = None
    userId: Optional[str] = None
    transactionId: Optional[str] = None
    transactionTime: Optional[int] = None

class UzumRequest(BaseModel):
    serviceId: int
    timestamp: int
    params: UzumParams

class UzumResponse(BaseModel):
    serviceId: int
    timestamp: int
    status: str
    transactionId: Optional[str] = None
    transactionTime: Optional[int] = None
    errorCode: Optional[str] = None
    errorMessage: Optional[str] = None
    data: Optional[Dict] = None
