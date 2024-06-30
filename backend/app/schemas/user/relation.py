from app.schemas.user.base import UserBase
from app.schemasTest import ProfileUserResponse
from typing import Optional
from pydantic import BaseModel

class UserWithRelation(BaseModel):
    id: int
    username: str
    email: str
    registration: str
    password: str
    
    profile: Optional[ProfileUserResponse]    
    class Config:
        orm_mode = True
        from_attributes = True