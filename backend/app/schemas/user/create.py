from pydantic import BaseModel
from typing import Optional
    
class UserCreate(BaseModel):
    username: str
    email: str
    registration: str
    password: str
    profile_id: Optional[int] = None