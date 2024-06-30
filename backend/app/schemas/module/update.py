from pydantic import BaseModel
from typing import Optional, List

class UpdateModule(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    TAG: Optional[str] = None
    methods: Optional[List[int]]
    transactions: Optional[List[int]]
    
    class Config:
        orm_mode = True
