from pydantic import BaseModel, EmailStr

class PasswordResetRequest(BaseModel):
    email: str

class PasswordResetVerify(BaseModel):
    email: str
    token: str
    new_password: str