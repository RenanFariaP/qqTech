from sqlalchemy.orm import Session
from .. import models
from passlib.context import CryptContext
from app.schemas.user import create, config, update
from app.schemasTest import User
from app.repository import loginRepository
from fastapi import HTTPException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado!")
    return db_user

def get_user_by_name(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_registration(db: Session, registration: str):
    return db.query(models.User).filter(models.User.registration == registration).first()

def get_users(db: Session, skip:int=0, limit:int=100):
    return db.query(models.User).offset(skip).limit(limit).all()

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_user(db: Session, user:create.UserCreate):
    db_user = models.User(username=user.username, email=user.email, registration=user.registration, password=user.password, profile_id=user.profile_id)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_data: update.UpdateUser, user: models.User):
    db_user_email = db.query(models.User).filter(models.User.email == user_data.email).first()
    db_user_registration = get_user_by_registration(db, registration=user_data.registration)
    if db_user_email:
        if db_user_email.id != user.id:
            raise HTTPException(status_code=409, detail="O email já está associado a outro usuário!")
    if db_user_registration:
        if db_user_registration.id != user.id:
            raise HTTPException(status_code=409, detail="A matrícula já está associada a outro usuário!")
    if user_data.username is not None:
        user.username = user_data.username
    if user_data.email is not None:
        user.email = user_data.email
    if user_data.registration is not None:
        user.registration = user_data.registration
    if user_data.password is not None:
        verify_password = loginRepository.verify_password(user_data.password, user.password)
        if not verify_password:
            hashed_password = get_password_hash(user_data.password)
            user.password = hashed_password
    if user_data.profile_id is not None:
        user.profile_id = user_data.profile_id
    db.commit()
    db.refresh(user)
    return user
    
def delete_user(db:Session, user: User):
    db.delete(user)
    db.commit()
    return {"message": "Usuário deletado!"}