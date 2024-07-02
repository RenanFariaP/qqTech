from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.schemas.transaction import create, config, update
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

def update_transaction(db: Session, transaction_data: update.UpdateTransaction, transaction: models.Transaction):
    db_transaction_name = get_transaction_by_name(db, transaction_data.name);
    db_transaction_TAG = get_transaction_by_TAG(db, transaction_data.TAG)
    if db_transaction_name:
        if db_transaction_name.id != transaction.id:
            raise HTTPException(status_code=409, detail="O nome já está associado a outra transação!")
    if db_transaction_TAG:
        if db_transaction_TAG.id != transaction.id:
            raise HTTPException(status_code=409, detail="A TAG já está associada a outra transação!")
    if transaction_data.name is not None:
        transaction.name = transaction_data.name
    if transaction_data.description is not None:
        transaction.description = transaction_data.description
    if transaction_data.TAG is not None:
        transaction.TAG = transaction_data.TAG
    db.commit()
    db.refresh(transaction)
    return transaction

def delete_transaction(db:Session, transaction: Transaction):
    db.query(models.modules_transactions).filter(models.modules_transactions.c.transaction_id == models.Transaction.id).delete()
    db.delete(transaction)
    db.commit()
    return {"message": "Transação deletada!"}