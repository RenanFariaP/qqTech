from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from .. import schemas,models


def get_method(db: Session, method_id: int):
    return db.query(models.Method).filter(models.Method.id == method_id).first()

def get_method_by_name(db: Session, name: str):
    return db.query(models.Method).filter(models.Method.name == name).first()

def get_methods(db: Session, skip:int=0, limit:int=100):
    return db.query(models.Method).offset(skip).limit(limit).all()

def create_method(db: Session, method:schemas.MethodCreate):
    db_method = models.Method(name=method.name, description=method.description, TAG=method.TAG)
    db.add(db_method)
    db.commit()
    db.refresh(db_method)
    return db_method

def delete_method(db:Session, method: schemas.Method):
    db.delete(method)
    db.commit()
    return {"message": "Função deletada!"}