from pydantic import BaseModel
from typing import Optional

class ModuleCreate(BaseModel):
    name: str
    description: Optional[str] = None
    TAG: str