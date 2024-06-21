from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from .. import schemas,models


def get_transaction(db: Session, transaction_id: int):
    return db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()

def get_transaction_by_name(db: Session, name: str):
    return db.query(models.Transaction).filter(models.Transaction.name == name).first()

def get_transaction_by_TAG(db: Session, TAG: str):
    return db.query(models.Transaction).filter(models.Transaction.TAG == TAG).first()

def get_transactions(db: Session, skip:int=0, limit:int=100):
    return db.query(models.Transaction).offset(skip).limit(limit).all()

def create_transaction(db: Session, transaction:schemas.TransactionCreate):
    db_transaction = models.Transaction(name=transaction.name, description=transaction.description, TAG=transaction.TAG)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def delete_transaction(db:Session, transaction: schemas.Transaction):
    db.delete(transaction)
    db.commit()
    return {"message": "Transação deletada!"}