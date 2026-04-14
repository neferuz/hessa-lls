from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, Dict, Any, Union

class AccountField(BaseModel):
    user_id: Optional[str] = None

class PaymeMethodParams(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    amount: Optional[int] = None
    account: Optional[AccountField] = None
    id: Optional[str] = None
    time: Optional[int] = None
    reason: Optional[int] = None
    from_time: Optional[int] = Field(alias="from", default=None)
    to: Optional[int] = None
    
class PaymeRequest(BaseModel):
    method: str
    params: PaymeMethodParams
    id: int

class PaymeError(BaseModel):
    code: int
    message: dict
    data: Optional[str] = None

class PaymeResponse(BaseModel):
    result: Optional[dict] = None
    error: Optional[PaymeError] = None
    id: int
