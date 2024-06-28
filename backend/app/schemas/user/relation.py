from app.schemas.user.base import UserBase
from app.schemas.profile.base import ProfileBase
from typing import Optional

class UserWithRelation(UserBase):
    profile: Optional[ProfileBase]    
    class Config:
        #orm_mode = True
        from_attributes = True