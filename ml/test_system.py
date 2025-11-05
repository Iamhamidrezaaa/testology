#!/usr/bin/env python3
"""
تست کامل سیستم مغز یادگیرنده Testology
"""

import json
import sys
import os
from pathlib import Path

# اضافه کردن مسیرهای مورد نیاز
sys.path.append(str(Path(__file__).parent))

def test_preprocessing():
    """تست پیش‌پردازش داده‌ها"""
    print("🧪 تست پیش‌پردازش...")
    try:
        from utils.preprocess import preprocess_data
        X, y, le, scaler = preprocess_data()
        print(f"✅ پیش‌پردازش موفق: {X.shape[0]} نمونه، {X.shape[1]} ویژگی")
        print(f"   دسته‌بندی‌ها: {y.unique()}")
        return True
    except Exception as e:
        print(f"❌ خطا در پیش‌پردازش: {e}")
        return False

def test_training():
    """تست آموزش مدل"""
    print("🧪 تست آموزش مدل...")
    try:
        from core.train_model import train_model
        train_model()
        print("✅ آموزش مدل موفق")
        return True
    except Exception as e:
        print(f"❌ خطا در آموزش مدل: {e}")
        return False

def test_prediction():
    """تست پیش‌بینی"""
    print("🧪 تست پیش‌بینی...")
    try:
        from core.predict import main as predict_main
        
        # داده‌های تست
        test_user = {
            "score": 65,
            "gender": "female", 
            "age": 25
        }
        
        # شبیه‌سازی آرگومان‌های خط فرمان
        sys.argv = ["predict.py", json.dumps(test_user)]
        predict_main()
        print("✅ پیش‌بینی موفق")
        return True
    except Exception as e:
        print(f"❌ خطا در پیش‌بینی: {e}")
        return False

def test_ai_supervisor():
    """تست AI Supervisor"""
    print("🧪 تست AI Supervisor...")
    try:
        from core.ai_supervisor import analyze_trends
        analyze_trends()
        print("✅ AI Supervisor موفق")
        return True
    except Exception as e:
        print(f"❌ خطا در AI Supervisor: {e}")
        return False

def test_bridge():
    """تست پل ارتباطی"""
    print("🧪 تست پل ارتباطی...")
    try:
        # بررسی وجود فایل‌های bridge
        bridge_file = Path("bridge/run_python.ts")
        if bridge_file.exists():
            print("✅ فایل پل ارتباطی موجود است")
            return True
        else:
            print("❌ فایل پل ارتباطی یافت نشد")
            return False
    except Exception as e:
        print(f"❌ خطا در تست پل ارتباطی: {e}")
        return False

def run_all_tests():
    """اجرای تمام تست‌ها"""
    print("🚀 شروع تست کامل سیستم مغز یادگیرنده")
    print("=" * 60)
    
    tests = [
        ("پیش‌پردازش داده‌ها", test_preprocessing),
        ("آموزش مدل", test_training),
        ("پیش‌بینی", test_prediction),
        ("AI Supervisor", test_ai_supervisor),
        ("پل ارتباطی", test_bridge)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}:")
        try:
            success = test_func()
            results.append((test_name, success))
        except Exception as e:
            print(f"❌ خطای غیرمنتظره در {test_name}: {e}")
            results.append((test_name, False))
    
    # خلاصه نتایج
    print("\n" + "=" * 60)
    print("📊 خلاصه نتایج تست:")
    
    passed = 0
    for test_name, success in results:
        status = "✅ موفق" if success else "❌ ناموفق"
        print(f"   {test_name}: {status}")
        if success:
            passed += 1
    
    print(f"\n🎯 نتیجه کلی: {passed}/{len(results)} تست موفق")
    
    if passed == len(results):
        print("🎉 تمام تست‌ها موفق! سیستم آماده است.")
        return True
    else:
        print("⚠️ برخی تست‌ها ناموفق بودند. لطفاً خطاها را بررسی کنید.")
        return False

if __name__ == "__main__":
    # تغییر مسیر به فولدر ml
    os.chdir(Path(__file__).parent)
    run_all_tests()













