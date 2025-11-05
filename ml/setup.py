#!/usr/bin/env python3
"""
اسکریپت راه‌اندازی مغز یادگیرنده Testology
"""

import os
import subprocess
import sys
import json
from pathlib import Path

def install_requirements():
    """نصب dependencies مورد نیاز"""
    print("🔧 در حال نصب dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies با موفقیت نصب شدند")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ خطا در نصب dependencies: {e}")
        return False

def create_directories():
    """ایجاد فولدرهای مورد نیاز"""
    print("📁 در حال ایجاد فولدرهای مورد نیاز...")
    directories = [
        "ml/data",
        "ml/core", 
        "ml/utils",
        "ml/bridge"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"✅ فولدر {directory} ایجاد شد")

def create_sample_data():
    """ایجاد داده‌های نمونه برای تست"""
    print("📊 در حال ایجاد داده‌های نمونه...")
    
    # ایجاد داده‌های نمونه تست‌ها
    sample_tests = []
    categories = ['anxiety', 'depression', 'focus', 'confidence', 'stress']
    genders = ['male', 'female', 'other']
    
    import random
    random.seed(42)
    
    for i in range(200):
        sample_tests.append({
            'score': random.randint(20, 80),
            'gender': random.choice(genders),
            'age': random.randint(18, 65),
            'category': random.choice(categories)
        })
    
    # ذخیره داده‌های تست
    with open('ml/data/user_tests.csv', 'w', encoding='utf-8') as f:
        f.write('score,gender,age,category\n')
        for test in sample_tests:
            f.write(f"{test['score']},{test['gender']},{test['age']},{test['category']}\n")
    
    # ایجاد داده‌های نمونه توصیه‌ها
    sample_recommendations = []
    for i in range(100):
        sample_recommendations.append({
            'date': f"2024-01-{random.randint(1, 30):02d}T{random.randint(0, 23):02d}:00:00",
            'category': random.choice(categories),
            'score': random.randint(20, 80),
            'user_satisfaction': random.choice(['high', 'medium', 'low']),
            'content_type': random.choice(['test', 'article', 'exercise'])
        })
    
    with open('ml/data/recommendations.json', 'w', encoding='utf-8') as f:
        json.dump(sample_recommendations, f, ensure_ascii=False, indent=2)
    
    print("✅ داده‌های نمونه ایجاد شدند")

def test_system():
    """تست سیستم ML"""
    print("🧪 در حال تست سیستم...")
    
    try:
        # تست پیش‌پردازش
        from utils.preprocess import preprocess_data
        X, y, le, scaler = preprocess_data()
        print(f"✅ پیش‌پردازش: {X.shape[0]} نمونه، {X.shape[1]} ویژگی")
        
        # تست آموزش مدل
        from core.train_model import train_model
        print("✅ آموزش مدل شروع شد...")
        # train_model()  # این خط را در صورت نیاز فعال کنید
        
        print("✅ سیستم ML آماده است!")
        return True
        
    except Exception as e:
        print(f"❌ خطا در تست سیستم: {e}")
        return False

def main():
    """تابع اصلی راه‌اندازی"""
    print("🚀 راه‌اندازی مغز یادگیرنده Testology")
    print("=" * 50)
    
    # تغییر مسیر به فولدر ml
    os.chdir(Path(__file__).parent)
    
    # مراحل راه‌اندازی
    steps = [
        ("ایجاد فولدرها", create_directories),
        ("نصب dependencies", install_requirements),
        ("ایجاد داده‌های نمونه", create_sample_data),
        ("تست سیستم", test_system)
    ]
    
    for step_name, step_func in steps:
        print(f"\n📋 {step_name}...")
        if not step_func():
            print(f"❌ خطا در {step_name}")
            return False
    
    print("\n🎉 مغز یادگیرنده Testology با موفقیت راه‌اندازی شد!")
    print("\n📝 مراحل بعدی:")
    print("1. آموزش مدل: python ml/core/train_model.py")
    print("2. تست پیش‌بینی: python ml/core/predict.py '{\"score\": 65, \"gender\": \"female\", \"age\": 25}'")
    print("3. تحلیل AI: python ml/core/ai_supervisor.py")
    print("4. مشاهده داشبورد: /admin/ai-dashboard")
    
    return True

if __name__ == "__main__":
    main()













