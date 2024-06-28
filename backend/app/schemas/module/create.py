from pydantic import BaseModel
from typing import List, Optional

class ModuleCreate(BaseModel):
    name: str
    description: Optional[str] = None
    TAG: str
    methods: List[int] = []
    transactions: List[int] = []