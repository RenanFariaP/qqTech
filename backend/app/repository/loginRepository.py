from passlib.context import CryptContext
from fastapi import HTTPException
from jose import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from app.schemas.user.loginsch import LoginRequest
from app.repository import userRepository

load_dotenv()
import os
SECRET_KEY = SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.time() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# def verify_token(db: Session, access_token):
#     try:
#         data = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
#     except JWTError:
#         raise HTTPException(status_code=401, detail="Token de acesso inválido!")
#     db_user = userRepository.get_user_by_email(db, email=data['sub'])
#     if db_user is None:
#         raise HTTPException(status_code=401, detail="Token de acesso inválido!")

# def user_login(db: Session, loginRequest: LoginRequest ):
#     db_user = userRepository.get_user_by_email(db, email=loginRequest.email)
#     check_password = verify_password(loginRequest.password, db_user.password )
#     if db_user and check_password:
#         access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#         access_token = create_access_token(data={"username": db_user.username, "registration": db_user.registration, "email": db_user.email}, expires_delta=access_token_expires)
#         return {"access_token": access_token, "email": db_user.email, "username":db_user.username}
#     raise HTTPException(status_code=400, detail="Email e/ou senha inválido!")