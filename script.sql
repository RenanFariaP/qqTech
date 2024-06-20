-- Tabela profiles
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(255)
);

-- Tabela users com relacionamento 1:n com profiles
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    registration VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_id INT REFERENCES profiles(id) -- Chave estrangeira
);

-- Tabela modules
CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(255),
    TAG VARCHAR(5) UNIQUE NOT NULL
);

-- Tabela transactions
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(255),
    TAG VARCHAR(5) UNIQUE NOT NULL
);

-- Tabela methods
CREATE TABLE methods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(255),
    TAG VARCHAR(5) UNIQUE NOT NULL
);

-- Tabela de junção profiles_modules para relacionamento n:m entre profiles e modules
CREATE TABLE profiles_modules (
    profile_id INT REFERENCES profiles(id),
    module_id INT REFERENCES modules(id),
    PRIMARY KEY (profile_id, module_id)
);

-- Tabela de junção modules_transactions para relacionamento n:m entre modules e transactions
CREATE TABLE modules_transactions (
    module_id INT REFERENCES modules(id),
    transaction_id INT REFERENCES transactions(id),
    PRIMARY KEY (module_id, transaction_id)
);

-- Tabela de junção modules_methods para relacionamento n:m entre modules e methods
CREATE TABLE modules_methods (
    module_id INT REFERENCES modules(id),
    method_id INT REFERENCES methods(id),
    PRIMARY KEY (module_id, method_id)
);

-------------------------------------
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
    description: str = None
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
    description: str = None
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
    description: str = None
    TAG: str
    module_id: int

class MethodCreate(MethodBase):
    pass

class Method(MethodBase):
    id: int
    module: Module

    class Config:
        orm_mode = True