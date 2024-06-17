from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from . import models,schemas

#Profile
def get_profile(db: Session, profile_id: int):
    return db.query(models.Profile).filter(models.Profile.id == profile_id).first()

def get_profile_by_name(db: Session, name: str):
    return db.query(models.Profile).filter(models.Profile.name == name).first()

def get_profiles(db: Session, skip:int=0, limit:int=100):
    return db.query(models.Profile).offset(skip).limit(limit).all()

def create_profile(db: Session, profile:schemas.ProfileCreate):
    db_profile = models.Profile(name=profile.name, description=profile.description)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


#User
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_filter(db: Session, **filters):
    query = db.query(models.User)
    for field, value in filters.items():
        if hasattr(models.User, field):
            query = query.filter(getattr(models.User, field) == value)
    return query.all()

def get_user_by_name(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_users(db: Session, skip:int=0, limit:int=100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user:schemas.UserCreate):
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
#Module


#Method


#Transaction