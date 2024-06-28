from pydantic import BaseModel
from typing import List, Optional

class ProfileCreate(BaseModel):
    name: str
    description: Optional[str] = None
    modules: List[int]