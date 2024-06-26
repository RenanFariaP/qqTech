from pydantic import BaseModel
from typing import List, Optional

# User models
class UserBase(BaseModel):
    id: int
    username: str
    email: str
    registration: str
    password: str
    profile_id: Optional[int] = None
    
class UserCreate(BaseModel):
    username: str
    email: str
    registration: str
    password: str
    profile_id: Optional[int] = None

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    registration: Optional[str] = None
    password: Optional[str] = None
    profile_id: Optional[int] = None
   
class LoginRequest(BaseModel):
    email: str
    password: str
    
class Token(BaseModel):
    access_token: str
    token_type: str

class User(UserBase):

    class Config:
        orm_mode = True

# Profile models
class ProfileBase(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

class ProfileCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class Profile(ProfileBase):
    users: List[User] = []
    modules: List["Module"] = []

    class Config:
        orm_mode = True

# Module models
class ModuleBase(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    TAG: str

class ModuleCreate(BaseModel):
    name: str
    description: Optional[str] = None
    TAG: str

class ModuleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    TAG: Optional[str] = None

class Module(ModuleBase):
    profiles: List[Profile] = []
    transactions: List["Transaction"] = []
    methods: List["Method"] = []

    class Config:
        orm_mode = True

# Transaction models
class TransactionBase(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    TAG: str

class TransactionCreate(BaseModel):
    name: str
    description: Optional[str] = None
    TAG: str

class TransactionUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    TAG: Optional[str] = None

class Transaction(TransactionBase):
    modules: List[Module] = []

    class Config:
        orm_mode = True

# Method models
class MethodBase(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    TAG: str

class MethodCreate(BaseModel):
    name: str
    description: Optional[str] = None
    TAG: str

class MethodUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    TAG: Optional[str] = None

class Method(MethodBase):
    modules: List[Module] = []

    class Config:
        orm_mode = True
        
class UserWithRelation(UserBase):
    id: int
    profile: ProfileBase
