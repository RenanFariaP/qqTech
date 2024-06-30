from pydantic import BaseModel
from typing import Optional

class UpdateUser(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    registration: Optional[str] = None
    password: Optional[str] = None
    profile_id: Optional[int] = None
    