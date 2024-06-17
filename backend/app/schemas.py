from pydantic import BaseModel
from typing import Optional

class ProfileBase(BaseModel):
    name: str
    description: str = None

class ProfileCreate(ProfileBase):
    pass

class Profile(ProfileBase):
    id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    email: str
    registration: str
    password: str
    profile_id: int

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    profile: Profile

    class Config:
        orm_mode = True
        
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    registration: Optional[str] = None
    password: Optional[str] = None
    profile_id: Optional[int] = None

class ModuleBase(BaseModel):
    name: str
    description: Optional[str] = None
    TAG: str
    profile_id: int

class ModuleCreate(ModuleBase):
    pass

class Module(ModuleBase):
    id: int
    profile: Profile

    class Config:
        orm_mode = True

class TransactionBase(BaseModel):
    name: str
    description: Optional[str] = None
    TAG: str
    module_id: int

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    module: Module

    class Config:
        orm_mode = True

class MethodBase(BaseModel):
    name: str
    description: Optional[str] = None
    TAG: str
    module_id: int

class MethodCreate(MethodBase):
    pass

class Method(MethodBase):
    id: int
    module: Module

    class Config:
        orm_mode = True