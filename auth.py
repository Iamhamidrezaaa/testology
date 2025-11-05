from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import random
import string
from database import get_db, redis_client
from models import User

# تنظیمات JWT
SECRET_KEY = "your-secret-key-here"  # در محیط واقعی از متغیر محیطی استفاده کنید
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def generate_otp() -> str:
    """تولید کد OTP 5 رقمی"""
    return ''.join(random.choices(string.digits, k=5))

def store_otp(phone: str, otp: str):
    """ذخیره کد OTP در Redis با زمان انقضای 5 دقیقه"""
    redis_client.setex(f"otp:{phone}", 300, otp)  # 300 ثانیه = 5 دقیقه

def verify_otp(phone: str, otp: str) -> bool:
    """بررسی صحت کد OTP"""
    stored_otp = redis_client.get(f"otp:{phone}")
    if not stored_otp:
        return False
    return stored_otp.decode() == otp

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """ایجاد توکن JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """دریافت کاربر فعلی از توکن JWT"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user 