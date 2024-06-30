from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
from typing import List

from . import models
from app.schemas.user.loginsch import LoginRequest
from app.schemas.profile.create import ProfileCreate
from app.schemas.profile.update import UpdateProfile
from app.schemasTest import Profile
from app.schemas.module.create import ModuleCreate
from app.schemas.module.update import UpdateModule
from app.schemasTest import Module
from app.schemas.method.create import MethodCreate
from app.schemasTest import Method
from app.schemas.transaction.create import TransactionCreate
from app.schemasTest import Transaction
from app.schemas.user.create import UserCreate
from app.schemas.user.update import UpdateUser
from app.schemasTest import User
from app.schemas.user.relation import UserWithRelation


from .repository import profileRepository, userRepository, moduleRepository, transactionRepository, methodRepository, loginRepository
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ACCESS_TOKEN_EXPIRE_MINUTES = 30

def get_db():
    db = SessionLocal()
    try : 
        yield db
    finally:
        db.close()
        
        
#Login authentication
@app.post('/login')
async def login(request: LoginRequest, db:Session=Depends(get_db)):
    db_user = userRepository.get_user_by_email(db, email=request.email)
    verify_password = loginRepository.verify_password(request.password, db_user.password )
    if db_user and verify_password:
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = loginRepository.create_access_token(data={"username": db_user.username, "registration": db_user.registration, "email": db_user.email}, expires_delta=access_token_expires)
        return {"access_token": access_token, "email": db_user.email, "username":db_user.username}
    raise HTTPException(status_code=400, detail="Email ou senha inválido!")


#Profile
#Create a profile
@app.post("/dashboard/profile/",response_model=Profile)
async def post_profile(profile:ProfileCreate, db:Session=Depends(get_db)):
    db_profile = profileRepository.get_profile_by_name(db, name=profile.name)
    if db_profile:
        raise HTTPException(status_code=400, detail="Perfil já cadastrado!")
    return profileRepository.create_profile_with_modules(db=db,profile=profile)

#Get all profiles
@app.get("/dashboard/profile/", response_model=List[Profile])
async def get_profiles(skip:int=0, limit:int=100, db:Session=Depends(get_db)):
    profiles = profileRepository.get_profiles(db, skip=skip, limit=limit)
    return profiles

#Get profile by ID
@app.get("/dashboard/profile/{profile_id}", response_model=Profile)
async def get_profile_by_id(profile_id: int, db:Session=Depends(get_db)):
    db_profile = profileRepository.get_profile(db, profile_id=profile_id)
    return db_profile

#Delete a profile by id
@app.delete("/dashboard/profile/{profile_id}", response_model = dict)
async def delete_profile(profile_id: int, db: Session = Depends(get_db)):
    db_profile = profileRepository.get_profile(db, profile_id)
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Perfil não encontrado!")
    return profileRepository.delete_profile(db=db, profile=db_profile)

#Update a profile by id
@app.put('/dashboard/profile/{profile_id}', response_model=Profile)
async def update_profile(profile_id: int, profile_data: UpdateProfile, db: Session = Depends(get_db)):
    db_profile = profileRepository.get_profile(db, profile_id)
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Perfil não encontrado!")
    return profileRepository.update_profile(db, profile_data, db_profile)
    
    
#User

#Create an user
@app.post("/dashboard/user/",response_model=User)
async def post_user(user:UserCreate, db:Session=Depends(get_db)):
    db_user_email = userRepository.get_user_by_email(db, email=user.email)
    if db_user_email:
        raise HTTPException(status_code=400, detail="O email já está vinculado a outro usuário!")
    db_user_registration = userRepository.get_user_by_registration(db, registration=user.registration)
    if db_user_registration:
        raise HTTPException(status_code=400, detail="A matrícula já está vinculada a outro usuário!")
    hashed_password = userRepository.get_password_hash(user.password)
    db_user = UserCreate(
        username = user.username,
        email = user.email,
        registration = user.registration,
        password = hashed_password,
        profile_id = user.profile_id
    )
    return userRepository.create_user(db=db,user=db_user)

#Get all users
@app.get("/dashboard/user/", response_model=List[UserWithRelation])
async def get_users(skip:int=0, limit:int=100, db:Session=Depends(get_db)):
    users = userRepository.get_users(db, skip=skip, limit=limit)
    return users

#Get user by ID
@app.get("/dashboard/user/{user_id}", response_model=User)
async def get_user_by_id(user_id: int, db:Session=Depends(get_db)):
    db_user = userRepository.get_user(db, user_id=user_id)
    return db_user

#Update an user by id
@app.put('/dashboard/user/{user_id}', response_model=User)
async def update_user(user_id: int, user_data: UpdateUser, db: Session = Depends(get_db)):
    db_user = userRepository.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Perfil não encontrado!")
    return userRepository.update_user(db, user_data, db_user)

#Delete an user by ID
@app.delete("/dashboard/user/{user_id}", response_model = dict)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = userRepository.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado!")
    return userRepository.delete_user(db=db, user=db_user)


#Module
#Create a module
@app.post("/dashboard/module/",response_model=Module)
async def post_module(module:ModuleCreate, db:Session=Depends(get_db)):
    db_module_name = moduleRepository.get_module_by_name(db, name=module.name)
    if db_module_name:
        raise HTTPException(status_code=400, detail="Já existe um módulo com esse nome!")
    db_module_TAG = moduleRepository.get_module_by_TAG(db, TAG=module.TAG)
    if db_module_TAG:
        raise HTTPException(status_code=400, detail="Já existe um módulo com essa TAG!")
    return moduleRepository.create_module_with_methods_and_transactions(db=db,module=module)

#Get all modules
@app.get("/dashboard/module/", response_model=list[Module])
async def get_modules(skip:int=0, limit:int=100, db:Session=Depends(get_db)):
    modules = moduleRepository.get_modules(db,skip=skip,limit=limit)
    return modules

#Get a module by id
@app.get("/dashboard/module/{module_id}", response_model=Module)
async def get_module_by_id(module_id: int, db:Session=Depends(get_db)):
    db_module = moduleRepository.get_module(db, module_id=module_id)
    return db_module

#Delete a module by id
@app.delete("/dashboard/module/{module_id}", response_model = dict)
async def delete_module(module_id: int, db: Session = Depends(get_db)):
    db_module = moduleRepository.get_module(db, module_id)
    if db_module is None:
        raise HTTPException(status_code=404, detail="Módulo não encontrado!")
    return moduleRepository.delete_module(db=db, module=db_module)

#Update a module by id
@app.put('/dashboard/module/{module_id}', response_model=Module)
async def update_module(module_id: int, module_data: UpdateModule, db: Session = Depends(get_db)):
    db_module = moduleRepository.get_module(db, module_id)
    if db_module is None:
        raise HTTPException(status_code=404, detail="Módulo não encontrado!")
    return moduleRepository.update_module(db, module_data, db_module)

#Transaction
#Create a transaction
@app.post("/dashboard/transaction/",response_model=Transaction)
async def post_transaction(transaction:TransactionCreate, db:Session=Depends(get_db)):
    db_transaction_name = transactionRepository.get_transaction_by_name(db, name=transaction.name)
    if db_transaction_name:
        raise HTTPException(status_code=400, detail="Já existe uma transação com esse nome!")
    db_transaction_TAG = transactionRepository.get_transaction_by_TAG(db, TAG=transaction.TAG)
    if db_transaction_TAG:
        raise HTTPException(status_code=400, detail="Já existe uma transação com essa TAG!")
    return transactionRepository.create_transaction(db=db,transaction=transaction)

#Get all transactions
@app.get("/dashboard/transaction/", response_model=list[Transaction])
async def get_transactions(skip:int=0, limit:int=100, db:Session=Depends(get_db)):
    transactions = transactionRepository.get_transactions(db,skip=skip,limit=limit)
    return transactions

#Get a transaction by id
@app.get("/dashboard/transaction/{transaction_id}", response_model=Transaction)
async def get_transaction_by_id(transaction_id: int, db:Session=Depends(get_db)):
    db_transaction = transactionRepository.get_transaction(db, transaction_id=transaction_id)
    return db_transaction

#Delete a transaction by id
@app.delete("/dashboard/transaction/{transaction_id}", response_model = dict)
async def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = transactionRepository.get_transaction(db, transaction_id)
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transação não encontrada!")
    return transactionRepository.delete_transaction(db=db, transaction=db_transaction)

#Method
#Create a method
@app.post("/dashboard/method/", response_model=Method)
async def post_method(method:MethodCreate, db:Session=Depends(get_db)):
    db_method_name = methodRepository.get_method_by_name(db, name=method.name)
    if db_method_name:
        raise HTTPException(status_code=400, detail="Já existe uma função com esse nome!")
    db_method_TAG = methodRepository.get_method_by_TAG(db, TAG=method.TAG)
    if db_method_TAG:
        raise HTTPException(status_code=400, detail="Já existe uma função com essa TAG!")
    return methodRepository.create_method(db=db,method=method)

#Get all methods
@app.get("/dashboard/method/", response_model=list[Method])
async def get_methods(skip:int=0, limit:int=100, db:Session=Depends(get_db)):
    methods = methodRepository.get_methods(db,skip=skip,limit=limit)
    return methods

#Get a method by id
@app.get("/dashboard/method/{method_id}", response_model=Method)
async def get_method_by_id(method_id: int, db:Session=Depends(get_db)):
    db_method = methodRepository.get_method(db, method_id=method_id)
    return db_method

#Delete a method by id
@app.delete("/dashboard/method/{method_id}", response_model = dict)
async def delete_method(method_id: int, db: Session = Depends(get_db)):
    db_method = methodRepository.get_method(db, method_id)
    if db_method is None:
        raise HTTPException(status_code=404, detail="Transação não encontrada!")
    return methodRepository.delete_method(db=db, method=db_method)