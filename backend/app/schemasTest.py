from pydantic import BaseModel, validator
from app.schemas.method.base import MethodBase
from typing import List, Optional
from app.schemas.profile.base import ProfileBase
from app.schemas.module.base import ModuleBase
from app.schemas.transaction.base import TransactionBase
from app.schemas.user.base import UserBase
from datetime import datetime

class Method(MethodBase):
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True
        
class Module(ModuleBase):
    created_at: datetime
    updated_at: datetime
    profiles: List["Profile"] = []
    transactions: List["Transaction"] = []
    methods: List[Method] = []

    class Config:
        orm_mode = True
        
class ModuleProfileResponse(ModuleBase):
    transactions: List["Transaction"] = []
    methods: List[Method] = []
    
    class Config:
        orm_mode = True

class Profile(ProfileBase):
    created_at: datetime
    updated_at: datetime
    users: List["UserProfileResponse"] = []
    modules: List[ModuleProfileResponse] = []

    class Config:
        orm_mode = True
        
class ProfileUserResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    modules: List[ModuleProfileResponse] = []
    
    class Config:
        orm_mode = True
        

class Transaction(TransactionBase):
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        

class User(BaseModel):
    id: int
    username: str
    email: str
    registration: str
    password: str
    created_at: datetime
    updated_at: datetime
    profile: ProfileUserResponse

    class Config:
        orm_mode = True
        
class UserProfileResponse(BaseModel):
    id: int
    username: str
    email: str
    registration: str
    password: str
    
    class Config:
        orm_mode = True