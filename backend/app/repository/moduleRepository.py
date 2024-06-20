from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List

from .. import schemas,models


def get_module(db: Session, module_id: int):
    return db.query(models.Module).filter(models.Module.id == module_id).first()

def get_module_by_name(db: Session, name: str):
    return db.query(models.Module).filter(models.Module.name == name).first()

def get_modules(db: Session, skip:int=0, limit:int=100):
    return db.query(models.Module).offset(skip).limit(limit).all()

def create_module(module: schemas.ModuleCreate, profile_ids: List[int], db: Session):
    db_module = models.Module(**module.model_dump())
    db.add(db_module)
    db.commit()
    db.refresh(db_module)
    
    # Adiciona os perfis ao módulo na tabela de junção profiles_modules
    for profile_id in profile_ids:
        profile = db.query(models.Profile).filter(models.Profile.id == profile_id).first()
        if profile:
            db_module.profiles.append(profile)
    
    db.commit()
    db.refresh(db_module)
    return db_module

def delete_module(db:Session, module: schemas.Module):
    db.delete(module)
    db.commit()
    return {"message": "Módulo deletado!"}