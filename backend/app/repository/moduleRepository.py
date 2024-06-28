from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.schemas.module import create, config
from .. import models



def get_module(db: Session, module_id: int):
    return db.query(models.Module).filter(models.Module.id == module_id).first()

def get_module_by_name(db: Session, name: str):
    return db.query(models.Module).filter(models.Module.name == name).first()

def get_module_by_TAG(db: Session, TAG: str):
    return db.query(models.Module).filter(models.Module.TAG == TAG).first()

def get_modules(db: Session, skip:int=0, limit:int=100):
    return db.query(models.Module).offset(skip).limit(limit).all()

def create_module(module: create.ModuleCreate, db: Session):
    db_module = models.Module(name=module.name, description=module.description, TAG=module.TAG)
    db.add(db_module)
    db.commit()
    db.refresh(db_module)
    return db_module

def delete_module(db:Session, module: config.Module):
    db.delete(module)
    db.commit()
    return {"message": "Módulo deletado!"}

def add_transaction_to_module(db: Session, module_id: int, transaction_id: int):
    module = db.query(models.Module).filter(models.Module.id == module_id).first()
    transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    module.transactions.append(transaction)
    db.commit()
    return module

def add_method_to_module(db: Session, module_id: int, method_id: int):
    module = db.query(models.Module).filter(models.Module.id == module_id).first()
    method = db.query(models.Method).filter(models.Method.id == method_id).first()
    module.methods.append(method)
    db.commit()
    return module