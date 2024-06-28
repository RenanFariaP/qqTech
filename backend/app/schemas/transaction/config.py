from typing import List
# from app.schemas.module.config import Module
from app.schemas.transaction.base import TransactionBase

class Transaction(TransactionBase):
    modules: List[int] = []

    class Config:
        orm_mode = True