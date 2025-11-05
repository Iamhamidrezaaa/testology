from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import logging
from datetime import timedelta
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from openai import OpenAI
import traceback

from database import get_db, engine
from models import Base, User, TestResult
from auth import (
    generate_otp, store_otp, verify_otp,
    create_access_token, get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# ایجاد جداول دیتابیس
Base.metadata.create_all(bind=engine)

# تنظیمات لاگینگ
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# تنظیم API Key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    logger.error("❌ API Key یافت نشد!")
    raise ValueError("API Key الزامی است")

logger.info(f"🎯 API Key موجود: {'بله' if OPENAI_API_KEY else 'خیر'}")
logger.info(f"🎯 طول API Key: {len(OPENAI_API_KEY) if OPENAI_API_KEY else 0}")
logger.info(f"🎯 پیشوند API Key: {OPENAI_API_KEY[:10]}...")

client = OpenAI(api_key=OPENAI_API_KEY)
logger.info("OpenAI client initialized successfully")

app = FastAPI()

# تنظیمات CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# مدل‌های Pydantic
class PhoneNumber(BaseModel):
    phone: str

class OTPVerify(BaseModel):
    phone: str
    otp: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TestResultCreate(BaseModel):
    test_type: str
    mbti_type: str
    analysis: str

class TestResultResponse(BaseModel):
    id: str
    test_type: str
    mbti_type: str
    analysis: str
    created_at: str

# API‌های احراز هویت
@app.post("/auth/send-otp")
async def send_otp(phone_data: PhoneNumber):
    """ارسال کد OTP به شماره موبایل"""
    otp = generate_otp()
    store_otp(phone_data.phone, otp)
    
    # در محیط واقعی، اینجا کد را از طریق سرویس پیامک ارسال می‌کنیم
    logger.info(f"OTP for {phone_data.phone}: {otp}")
    
    return {"message": "کد تایید ارسال شد"}

@app.post("/auth/verify-otp", response_model=Token)
async def verify_otp_endpoint(otp_data: OTPVerify, db: Session = Depends(get_db)):
    """تایید کد OTP و صدور توکن"""
    if not verify_otp(otp_data.phone, otp_data.otp):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="کد تایید نامعتبر است"
        )
    
    # بررسی وجود کاربر
    user = db.query(User).filter(User.phone == otp_data.phone).first()
    if not user:
        # ایجاد کاربر جدید
        user = User(phone=otp_data.phone)
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # ایجاد توکن
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# API‌های تست
@app.post("/analyze")
async def analyze_mbti(mbti_data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """تحلیل تیپ شخصیتی MBTI"""
    try:
        mbti_type = mbti_data.get("mbti_type")
        if not mbti_type:
            raise HTTPException(status_code=400, detail="تیپ شخصیتی الزامی است")

        logger.info(f"درخواست تحلیل برای تیپ شخصیتی: {mbti_type}")

        # ارسال درخواست به OpenAI
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "شما یک متخصص تحلیل شخصیت MBTI هستید. تحلیل‌های شما باید دقیق، علمی و به زبان فارسی باشد."},
                {"role": "user", "content": f"""لطفاً یک تحلیل دقیق و جامع از تیپ شخصیتی {mbti_type} ارائه دهید. تحلیل باید شامل موارد زیر باشد:

1. نقاط قوت: ویژگی‌های مثبت و توانمندی‌های این تیپ شخصیتی
2. نقاط ضعف: محدودیت‌ها و چالش‌های احتمالی
3. ویژگی‌های کلی: خصوصیات اصلی و سبک زندگی
4. مشاغل مناسب: حرفه‌هایی که با این تیپ شخصیتی سازگار هستند
5. روابط: نحوه تعامل با دیگران و ویژگی‌های روابط
6. سبک یادگیری: روش‌های موثر یادگیری
7. راه‌های رشد و توسعه: پیشنهاداتی برای بهبود و توسعه شخصی

لطفاً تحلیل را به صورت ساختاریافته و با جزئیات کافی ارائه دهید."""}
            ],
            temperature=0.7,
            max_tokens=2000
        )

        analysis = response.choices[0].message.content
        logger.info(f"تحلیل با موفقیت تولید شد. طول متن: {len(analysis)} کاراکتر")

        # ذخیره نتیجه در دیتابیس
        test_result = TestResult(
            user_id=current_user.id,
            test_type="MBTI",
            mbti_type=mbti_type,
            analysis=analysis
        )
        db.add(test_result)
        db.commit()
        db.refresh(test_result)

        return {"analysis": analysis}

    except Exception as e:
        logger.error(f"خطا در تحلیل شخصیت: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail="متأسفانه در تحلیل شخصیت شما مشکلی پیش آمده است. لطفاً دوباره تلاش کنید."
        )

# API‌های داشبورد
@app.get("/dashboard/test-results", response_model=List[TestResultResponse])
async def get_test_results(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """دریافت لیست نتایج تست‌های کاربر"""
    results = db.query(TestResult).filter(TestResult.user_id == current_user.id).all()
    return results 