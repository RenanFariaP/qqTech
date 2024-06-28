from pydantic import BaseModel
from typing import Optional

class MethodUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    TAG: Optional[str] = None