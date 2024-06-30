from pydantic import BaseModel
from typing import Optional, List

class UpdateProfile(BaseModel):
    name: Optional[str]
    description: Optional[str]
    modules: Optional[List[int]]

    class Config:
        orm_mode = True