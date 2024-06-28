from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    id: int
    username: str
    email: str
    registration: str
    password: str
    profile_id: Optional[int] = None