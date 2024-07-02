from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.schemas.method import create, config, update
from app.schemasTest import Method
from .. import models
from fastapi import HTTPException


def get_method(db: Session, method_id: int):
    db_method = db.query(models.Method).filter(models.Method.id == method_id).first()
    if db_method is None:
        raise HTTPException(status_code=404, detail="Função não encontrada!")
    return db_method

def get_method_by_name(db: Session, name: str):
    return db.query(models.Method).filter(models.Method.name == name).first()

def get_method_by_TAG(db: Session, TAG: str):
    return db.query(models.Method).filter(models.Method.TAG == TAG).first()

def get_methods(db: Session, skip:int=0, limit:int=100):
    return db.query(models.Method).offset(skip).limit(limit).all()

def create_method(db: Session, method:create.MethodCreate):
    db_method = models.Method(name=method.name, description=method.description, TAG=method.TAG)
    db.add(db_method)
    db.commit()
    db.refresh(db_method)
    return db_method

def update_method(db: Session, method_data: update.UpdateMethod, method: models.Method):
    db_method_name = get_method_by_name(db, method_data.name);
    db_method_TAG = get_method_by_TAG(db, method_data.TAG)
    if db_method_name:
        if db_method_name.id != method.id:
            raise HTTPException(status_code=409, detail="O nome já está associado a outra função!")
    if db_method_TAG:
        if db_method_TAG.id != method.id:
            raise HTTPException(status_code=409, detail="A TAG já está associada a outra função!")
    if method_data.name is not None:
        method.name = method_data.name
    if method_data.description is not None:
        method.description = method_data.description
    if method_data.TAG is not None:
        method.TAG = method_data.TAG
    db.commit()
    db.refresh(method)
    return method

def delete_method(db:Session, method: Method):
    db.query(models.modules_methods).filter(models.modules_methods.c.method_id == models.Method.id).delete()
    db.delete(method)
    db.commit()
    return {"message": "Função deletada!"}