#from app.schemas.module.config import Module
from app.schemas.method.base import MethodBase
from typing import List
#from app.schemas.profile.config import Profile
#from app.schemas.transaction.config import Transaction
#from app.schemas.method.config import Method
from app.schemas.profile.base import ProfileBase
#from app.schemas.user.config import User
from app.schemas.module.base import ModuleBase
from app.schemas.transaction.base import TransactionBase
from app.schemas.user.base import UserBase

class Method(MethodBase):
    modules: List["Module"] = []

    class Config:
        orm_mode = True
        
class Module(ModuleBase):
    profiles: List["Profile"] = []
    transactions: List["Transaction"] = []
    methods: List[Method] = []

    class Config:
        orm_mode = True

class Profile(ProfileBase):
    users: List["User"] = []
    modules: List[Module] = []

    class Config:
        orm_mode = True
        

class Transaction(TransactionBase):
    modules: List[Module] = []

    class Config:
        orm_mode = True
        

class User(UserBase):

    class Config:
        orm_mode = True