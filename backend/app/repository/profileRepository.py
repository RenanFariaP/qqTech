from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.schemas.profile import create, config
from app.schemasBase import Profile
from app.schemas.profile.update import UpdateProfile
from .. import models
from fastapi import HTTPException

def get_profile(db: Session, profile_id: int):
    db_profile = db.query(models.Profile).filter(models.Profile.id == profile_id).first()
    if db_profile is None:
        raise HTTPException(status_code=404, detail="Perfil não encontrado!")
    return db_profile

def get_profile_by_name(db: Session, name: str):
    return db.query(models.Profile).filter(models.Profile.name == name).first()

def get_profiles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Profile).offset(skip).limit(limit).all()


def create_profile_with_modules(db: Session, profile: create.ProfileCreate):
    db_profile = models.Profile(name=profile.name, description=profile.description)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    for module_id in profile.modules:
        module = db.query(models.Module).filter(models.Module.id == module_id).first()
        if module:
            db_profile.modules.append(module)
    db.commit()
    db.refresh(db_profile)
    return db_profile


def delete_profile(db:Session, profile: Profile):
    db.query(models.profiles_modules).filter(models.profiles_modules.c.profile_id == models.Profile.id)
    db.delete(profile)
    db.commit()
    return {"message": "Perfil deletado, verifique os usuários dependentes!"}

def update_profile(db: Session, profile_data: UpdateProfile, profile: models.Profile):
    db_profile_name = get_profile_by_name(db, profile_data.name);
    if db_profile_name:
        if db_profile_name.id != profile.id:
            raise HTTPException(status_code=409, detail="O nome já está associado a outro perfil!")
    if profile_data.name is not None:
        profile.name = profile_data.name
    if profile_data.description is not None:
        profile.description = profile_data.description
    if profile_data.modules is not None:
        modules = db.query(models.Module).filter(models.Module.id.in_(profile_data.modules)).all()
        if len(modules) != len(profile_data.modules):
            raise HTTPException(status_code=404, detail="Um ou mais módulos não foram encontrados!")
        profile.modules = modules
    db.commit()
    db.refresh(profile)
    return profile
