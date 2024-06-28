from pydantic import BaseModel
from typing import Optional

class ModuleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    TAG: Optional[str] = None