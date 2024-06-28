from pydantic import BaseModel
from typing import Optional

class TransactionCreate(BaseModel):
    name: str
    description: Optional[str] = None
    TAG: str