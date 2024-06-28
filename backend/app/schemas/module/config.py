from typing import List
# from app.schemas.profile.config import Profile
# from app.schemas.transaction.config import Transaction
# from app.schemas.method.config import Method
from app.schemas.module.base import ModuleBase

class Module(ModuleBase):
    profiles: List[int] = []
    transactions: List[int] = []
    methods: List[int] = []

    class Config:
        orm_mode = True