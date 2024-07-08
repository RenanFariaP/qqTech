from sqlalchemy.orm import Session
from app.schemas.module import create, config
from app.schemasBase import Module
from .. import models
from app.schemas.module.update import UpdateModule
from fastapi import HTTPException

def get_module(db: Session, module_id: int):
    db_module = db.query(models.Module).filter(models.Module.id == module_id).first()
    if db_module is None:
        raise HTTPException(status_code=404, detail="Módulo não encontrado!")
    return db_module

def get_module_by_name(db: Session, name: str):
    db_module = db.query(models.Module).filter(models.Module.name == name).first()
    return db_module

def get_module_by_TAG(db: Session, TAG: str):
    db_module = db.query(models.Module).filter(models.Module.TAG == TAG).first()
    return db_module

def get_modules(db: Session, skip:int=0, limit:int=100):
    return db.query(models.Module).offset(skip).limit(limit).all()

def create_module_with_methods_and_transactions(module: create.ModuleCreate, db: Session):
    db_module = models.Module(name=module.name, description=module.description, TAG=module.TAG)
    db.add(db_module)
    db.commit()
    db.refresh(db_module)
    for method_id in module.methods:
        method = db.query(models.Method).filter(models.Method.id == method_id).first()
        if method:
            db_module.methods.append(method)
    db.commit()
    db.refresh(db_module)
    for transaction_id in module.transactions:
        transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
        if transaction:
            db_module.transactions.append(transaction)
    db.commit()
    db.refresh(db_module)
    return db_module

def delete_module(db:Session, module: Module):
    db.query(models.profiles_modules).filter(models.profiles_modules.c.module_id == models.Module.id).delete()
    db.query(models.modules_transactions).filter(models.modules_transactions.c.module_id == models.Module.id).delete()
    db.query(models.modules_methods).filter(models.modules_methods.c.module_id == models.Module.id).delete()
    db.delete(module)
    db.commit()
    return {"message": "Módulo deletado!"}

def update_module(db: Session, module_data: UpdateModule, module: models.Module):
    db_module_name = get_module_by_name(db, module_data.name);
    db_module_TAG = get_module_by_TAG(db, module_data.TAG)
    if db_module_name:
        if db_module_name.id != module.id:
            raise HTTPException(status_code=409, detail="O nome já está associado a outro módulo!")
    if db_module_TAG:
        if db_module_TAG.id != module.id:
            raise HTTPException(status_code=409, detail="A TAG já está associada a outro módulo!")
    if module_data.name is not None:
        module.name = module_data.name
    if module_data.description is not None:
        module.description = module_data.description
    if module_data.TAG is not None:
        module.TAG = module_data.TAG
    if module_data.methods is not None:
        methods = db.query(models.Method).filter(models.Method.id.in_(module_data.methods)).all()
        if len(methods) != len(module_data.methods):
            raise HTTPException(status_code=404, detail="Uma ou mais funções não foram encontradas!")
        module.methods = methods
    if module_data.transactions is not None:
        transactions = db.query(models.Transaction).filter(models.Transaction.id.in_(module_data.transactions)).all()
        if len(transactions) != len(module_data.transactions):
            raise HTTPException(status_code=404, detail="Uma ou mais transações não foram encontradas!")
        module.transactions = transactions
    db.commit()
    db.refresh(module)
    return module