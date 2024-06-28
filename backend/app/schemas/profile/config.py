from app.schemas.profile.base import ProfileBase
# from app.schemas.user.config import User
# from app.schemas.module.config import Module
from typing import List

class Profile(ProfileBase):
    users: List[int] = []
    modules: List[int] = []

    class Config:
        orm_mode = True