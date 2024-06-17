from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session


from . import crud,models, schemas
from .controlers import profileController, userController
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

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
@app.post("/dashboard/profile/",response_model=schemas.Profile)
async def post_profile(profile:schemas.ProfileCreate, db:Session=Depends(get_db)):
    db_profile = profileController.get_profile_by_name(db, name=profile.name)
    if db_profile:
        raise HTTPException(status_code=400, detail="Perfil já cadastrado!")
    return profileController.create_profile(db=db,profile=profile)

@app.get("/dashboard/profile/", response_model=list[schemas.Profile])
async def get_profiles(skip:int=0, limit:int=0, db:Session=Depends(get_db)):
    profiles = profileController.get_profiles(db,skip=skip,limit=limit)
    return profiles


#User
@app.post("/dashboard/user/",response_model=schemas.User)
async def post_user(user:schemas.UserCreate, db:Session=Depends(get_db)):
    db_user = userController.get_user_by_name(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Usuário já cadastrado!")
    return userController.create_user(db=db,user=user)

@app.get("/dashboard/user/", response_model=list[schemas.User])
async def get_users(skip:int=0, limit:int=0, db:Session=Depends(get_db)):
    users = userController.get_users(db,skip=skip,limit=limit)
    return users

@app.put("/dashboard/user/{user_id}", response_model=schemas.UserUpdate)
async def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    try:
        db_user = userController.get_user(db, user_id)
        if db_user is None:
            raise HTTPException(status_code=404, detail="User not found")
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


