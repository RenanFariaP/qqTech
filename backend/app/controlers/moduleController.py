from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from .. import schemas,models


def get_module(db: Session, module_id: int):
    return db.query(models.Module).filter(models.Module.id == module_id).first()

def get_module_by_name(db: Session, name: str):
    return db.query(models.Module).filter(models.Module.name == name).first()

def get_modules(db: Session, skip:int=0, limit:int=100):
    return db.query(models.Module).offset(skip).limit(limit).all()

def create_module(db: Session, module:schemas.ModuleCreate):
    db_module = models.Module(name=module.name, description=module.description)
    db.add(db_module)
    db.commit()
    db.refresh(db_module)
    return db_module