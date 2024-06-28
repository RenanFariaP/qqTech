from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.schemas.profile import create, config
from app.schemasTest import Profile
from .. import models
from fastapi import HTTPException


def get_profile(db: Session, profile_id: int):
    return db.query(models.Profile).filter(models.Profile.id == profile_id).first()

def get_profile_by_name(db: Session, name: str):
    return db.query(models.Profile).filter(models.Profile.name == name).first()

def get_profiles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Profile).offset(skip).limit(limit).all()

# def create_profile(db: Session, profile:create.ProfileCreate, module_id: int):
#     module = db.query(models.Module).filter(models.Module.id == module_id).first()
#     db_profile = models.Profile(name=profile.name, description=profile.description)
#     db.add(db_profile)
#     db.commit()
#     db.refresh(db_profile)
#     return db_profile

def create_profile_with_modules(db: Session, profile: create.ProfileCreate):
    db_profile = models.Profile(name=profile.name, description=profile.description)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    for module_id in profile.modules:
        module = db.query(models.Module).filter(models.Module.id == module_id).first()
        if module:
            db_profile.modules.append(module_id)
    db.commit()
    db.refresh(db_profile)
    return db_profile


def delete_profile(db:Session, profile: Profile):
    db.delete(profile)
    db.commit()
    return {"message": "Perfil deletado, verifique os usuários dependentes!"}

def add_module_to_profile(db: Session, profile_id: int, module_id: int):
    profile = db.query(models.Profile).filter(models.Profile.id == profile_id).first()
    module = db.query(models.Module).filter(models.Module.id == module_id).first()
    profile.modules.append(module)
    db.commit()
    return profile