from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.schemas.transaction import create, config
from app.schemasTest import Transaction
from .. import models
from fastapi import HTTPException


def get_transaction(db: Session, transaction_id: int):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transação não encontrada!")
    return db_transaction

def get_transaction_by_name(db: Session, name: str):
    return db.query(models.Transaction).filter(models.Transaction.name == name).first()

def get_transaction_by_TAG(db: Session, TAG: str):
    return db.query(models.Transaction).filter(models.Transaction.TAG == TAG).first()

def get_transactions(db: Session, skip:int=0, limit:int=100):
    return db.query(models.Transaction).offset(skip).limit(limit).all()

def create_transaction(db: Session, transaction:create.TransactionCreate):
    db_transaction = models.Transaction(name=transaction.name, description=transaction.description, TAG=transaction.TAG)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def delete_transaction(db:Session, transaction: Transaction):
    db.query(models.modules_transactions).filter(models.modules_transactions.c.transaction_id == models.Transaction.id).delete()
    db.delete(transaction)
    db.commit()
    return {"message": "Transação deletada!"}