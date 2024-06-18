from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from .. import schemas,models


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

def delete_profile(db:Session, profile: schemas.Profile):
    db.delete(profile)
    db.commit()
    return {"message": "Perfil deletado, verifique os usuários dependentes!"}