from pydantic import BaseModel
from typing import List, Optional
from app.schemasTest import Module

class ProfileCreate(BaseModel):
    name: str
    description: Optional[str] = None
    modules: List[int] = []