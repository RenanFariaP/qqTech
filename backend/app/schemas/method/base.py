from pydantic import BaseModel
from typing import Optional

class MethodBase(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    TAG: str