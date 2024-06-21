from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware


from . import crud,models, schemas
from .repository import profileRepository, userRepository, moduleRepository, transactionRepository, methodRepository
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

def get_db():
    db = SessionLocal()
    try : 
        yield db
    finally:
        db.close()

@app.get("/")
async def get_home():
    return "API no ar"


#Profile
#Create a profile
@app.post("/dashboard/profile/",response_model=schemas.Profile)
async def post_profile(profile:schemas.ProfileCreate, db:Session=Depends(get_db)):
    db_profile = profileRepository.get_profile_by_name(db, name=profile.name)
    if db_profile:
        raise HTTPException(status_code=400, detail="Perfil já cadastrado!")
    return profileRepository.create_profile(db=db,profile=profile)

#Get all profiles
@app.get("/dashboard/profile/", response_model=list[schemas.Profile])
async def get_profiles(skip:int=0, limit:int=100, db:Session=Depends(get_db)):
    profiles = profileRepository.get_profiles(db,skip=skip,limit=limit)
    return profiles

#Get profile by ID
@app.get("/dashboard/profile/{profile_id}", response_model=schemas.Profile)
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


#User
#Create an user
@app.post("/dashboard/user/",response_model=schemas.User)
async def post_user(user:schemas.UserCreate, db:Session=Depends(get_db)):
    db_user_email = userRepository.get_user_by_email(db, email=user.email)
    if db_user_email:
        raise HTTPException(status_code=400, detail="O email já está vinculado a outro usuário!")
    db_user_registration = userRepository.get_user_by_registration(db, registration=user.registration)
    if db_user_registration:
        raise HTTPException(status_code=400, detail="A matrícula já está vinculada a outro usuário!")
    return userRepository.create_user(db=db,user=user)

#Get all users
@app.get("/dashboard/user/", response_model=list[schemas.UserWithRelation])
async def get_users(skip:int=0, limit:int=100, db:Session=Depends(get_db)):
    users = userRepository.get_users(db,skip=skip,limit=limit)
    return users

#Get user by ID
@app.get("/dashboard/user/{user_id}", response_model=schemas.User)
async def get_user_by_id(user_id: int, db:Session=Depends(get_db)):
    db_user = userRepository.get_user(db, user_id=user_id)
    return db_user

#Modify an user
@app.put("/dashboard/user/{user_id}", response_model=schemas.UserUpdate)
async def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    try:
        db_user = userRepository.get_user(db, user_id)
        if db_user is None:
            raise HTTPException(status_code=404, detail="Usuário não encontrado!")
        db_user.username = user.username
        db_user.email = user.email
        db_user.registration = user.registration
        db_user.password = user.password
        db_user.profile_id = user.profile_dict
        return crud.update_user(db, db_user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")

#Delete an user by ID
@app.delete("/dashboard/user/{user_id}", response_model = dict)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = userRepository.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado!")
    return userRepository.delete_user(db=db, user=db_user)

#Module
@app.post("/dashboard/module/",response_model=schemas.Module)
async def post_module(module:schemas.ModuleCreate, db:Session=Depends(get_db)):
    db_module = moduleRepository.get_module_by_name(db, name=module.name)
    if db_module:
        raise HTTPException(status_code=400, detail="Módulo já cadastrado!")
    return moduleRepository.create_module(db=db,module=module)

@app.get("/dashboard/module/", response_model=list[schemas.Module])
async def get_modules(skip:int=0, limit:int=100, db:Session=Depends(get_db)):
    modules = moduleRepository.get_modules(db,skip=skip,limit=limit)
    return modules

@app.get("/dashboard/module/{module_id}", response_model=schemas.Module)
async def get_module_by_id(module_id: int, db:Session=Depends(get_db)):
    db_module = moduleRepository.get_module(db, module_id=module_id)
    return db_module

@app.delete("/dashboard/module/{module_id}", response_model = dict)
async def delete_module(module_id: int, db: Session = Depends(get_db)):
    db_module = moduleRepository.get_module(db, module_id)
    if db_module is None:
        raise HTTPException(status_code=404, detail="Módulo não encontrado!")
    return moduleRepository.delete_module(db=db, module=db_module)

#Transaction
#Create a transaction
@app.post("/dashboard/transaction/",response_model=schemas.Transaction)
async def post_transaction(transaction:schemas.TransactionCreate, db:Session=Depends(get_db)):
    db_transaction_name = transactionRepository.get_transaction_by_name(db, name=transaction.name)
    if db_transaction_name:
        raise HTTPException(status_code=400, detail="Já existe uma transação com esse nome!")
    db_transaction_TAG = transactionRepository.get_transaction_by_TAG(db, TAG=transaction.TAG)
    if db_transaction_TAG:
        raise HTTPException(status_code=400, detail="Já existe uma transação com essa TAG!")
    return transactionRepository.create_transaction(db=db,transaction=transaction)

@app.get("/dashboard/transaction/", response_model=list[schemas.Transaction])
async def get_transactions(skip:int=0, limit:int=100, db:Session=Depends(get_db)):
    transactions = transactionRepository.get_transactions(db,skip=skip,limit=limit)
    return transactions

@app.get("/dashboard/transaction/{transaction_id}", response_model=schemas.Transaction)
async def get_transaction_by_id(transaction_id: int, db:Session=Depends(get_db)):
    db_transaction = transactionRepository.get_transaction(db, transaction_id=transaction_id)
    return db_transaction

@app.delete("/dashboard/transaction/{transaction_id}", response_model = dict)
async def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = transactionRepository.get_transaction(db, transaction_id)
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transação não encontrada!")
    return transactionRepository.delete_transaction(db=db, transaction=db_transaction)

#Method
@app.post("/dashboard/method/",response_model=schemas.Method)
async def post_method(method:schemas.MethodCreate, db:Session=Depends(get_db)):
    db_method = methodRepository.get_method_by_name(db, name=method.name)
    if db_method:
        raise HTTPException(status_code=400, detail="Transação já cadastrada!")
    return methodRepository.create_method(db=db,method=method)

@app.get("/dashboard/method/", response_model=list[schemas.Method])
async def get_methods(skip:int=0, limit:int=100, db:Session=Depends(get_db)):
    methods = methodRepository.get_methods(db,skip=skip,limit=limit)
    return methods

@app.get("/dashboard/method/{method_id}", response_model=schemas.Method)
async def get_method_by_id(method_id: int, db:Session=Depends(get_db)):
    db_method = methodRepository.get_method(db, method_id=method_id)
    return db_method

@app.delete("/dashboard/method/{method_id}", response_model = dict)
async def delete_method(method_id: int, db: Session = Depends(get_db)):
    db_method = methodRepository.get_method(db, method_id)
    if db_method is None:
        raise HTTPException(status_code=404, detail="Transação não encontrada!")
    return methodRepository.delete_method(db=db, method=db_method)