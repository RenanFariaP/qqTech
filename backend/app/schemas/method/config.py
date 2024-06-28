# from app.schemas.module.config import Module
from app.schemas.method.base import MethodBase
from typing import List

class Method(MethodBase):
    modules: List[int] = []

    class Config:
        orm_mode = True