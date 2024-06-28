from pydantic import BaseModel
from typing import Optional

class ModuleBase(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    TAG: str
