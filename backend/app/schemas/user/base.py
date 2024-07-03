from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    id: int
    username: str
    email: str
    registration: str
    password: str
    reset_token: Optional[str] = None
    token_expiration: Optional[datetime] = None
    profile_id: Optional[int] = None
    
    class Config:
        orm_mode = True
        from_attributes = True