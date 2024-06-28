from pydantic import BaseModel
from typing import Optional

class TransactionBase(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    TAG: str