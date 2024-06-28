from pydantic import BaseModel
from typing import Optional

class MethodCreate(BaseModel):
    name: str
    description: Optional[str] = None
    TAG: str