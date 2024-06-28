from app.schemas.user.base import UserBase
from app.schemas.profile.base import ProfileBase

class UserWithRelation(UserBase):
    id: int
    profile: ProfileBase