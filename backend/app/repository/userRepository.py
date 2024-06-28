from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from .. import models
from passlib.context import CryptContext
from app.schemas.user import create, config
from app.schemasTest import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_name(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_registration(db: Session, registration: str):
    return db.query(models.User).filter(models.User.registration == registration).first()

def get_users(db: Session, skip:int=0, limit:int=100):
    result = db.query(models.User).join(models.User.profile).offset(skip).limit(limit).all()
    return db.query(models.User).join(models.User.profile).offset(skip).limit(limit).all()

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_user(db: Session, user:create.UserCreate):
    db_user = models.User(username=user.username, email=user.email, registration=user.registration, password=user.password, profile_id=user.profile_id)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, db_user: models.User):
    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError as e:
        db.rollback()
        print(e)
        raise ValueError("A unique constraint was violated")
    except Exception as e:
        print(e)
        raise e
    
def delete_user(db:Session, user: User):
    db.delete(user)
    db.commit()
    return {"message": "Usuário deletado!"}