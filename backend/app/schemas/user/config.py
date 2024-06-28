from app.schemas.user.base import UserBase

class User(UserBase):

    class Config:
        orm_mode = True