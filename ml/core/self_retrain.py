#!/usr/bin/env python3
"""
سیستم آموزش خودکار مدل Testology
این اسکریپت به صورت خودکار مدل را با داده‌های جدید بازآموزی می‌کند
"""

import pandas as pd
import joblib
import json
import os
import sys
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder, MinMaxScaler

# اضافه کردن مسیر utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

MODEL_PATH = "ml/core/model.pkl"
LOG_PATH = "ml/data/retrain_log.json"
BACKUP_PATH = "ml/core/model_backup.pkl"

def load_existing_data():
    """بارگذاری داده‌های موجود از دیتابیس"""
    try:
        # خواندن داده‌های تست‌ها
        if os.path.exists("ml/data/user_tests.csv"):
            df = pd.read_csv("ml/data/user_tests.csv")
        else:
            # اگر فایل وجود نداشت، داده‌های نمونه بساز
            return create_sample_data()
        
        # خواندن داده‌های چت و تعاملات
        chat_data = []
        if os.path.exists("ml/data/chat_sentiments.json"):
            with open("ml/data/chat_sentiments.json", 'r', encoding='utf-8') as f:
                chat_data = json.load(f)
        
        return df, chat_data
    except Exception as e:
        print(f"خطا در بارگذاری داده‌ها: {e}")
        return create_sample_data()

def create_sample_data():
    """ایجاد داده‌های نمونه برای تست"""
    import numpy as np
    
    np.random.seed(42)
    n_samples = 500
    
    # داده‌های نمونه
    data = {
        'score': np.random.normal(50, 15, n_samples),
        'gender': np.random.choice(['male', 'female', 'other'], n_samples),
        'age': np.random.randint(18, 65, n_samples),
        'category': np.random.choice(['anxiety', 'depression', 'focus', 'confidence', 'stress'], n_samples)
    }
    
    df = pd.DataFrame(data)
    df.to_csv("ml/data/user_tests.csv", index=False)
    
    return df, []

def preprocess_data_for_retrain(df):
    """پیش‌پردازش داده‌ها برای بازآموزی"""
    # تمیز کردن داده‌ها
    df = df.dropna()
    df = df[df['score'].between(0, 100)]  # نمرات معتبر
    df = df[df['age'].between(18, 100)]   # سن معتبر
    
    # کدگذاری متغیرهای کیفی
    le = LabelEncoder()
    df["gender_encoded"] = le.fit_transform(df["gender"].astype(str))
    
    # نرمال‌سازی نمرات
    scaler = MinMaxScaler()
    df["score_scaled"] = scaler.fit_transform(df[["score"]])
    
    # انتخاب ویژگی‌ها
    features = df[["score_scaled", "gender_encoded", "age"]]
    labels = df["category"]
    
    return features, labels, le, scaler

def backup_existing_model():
    """پشتیبان‌گیری از مدل موجود"""
    if os.path.exists(MODEL_PATH):
        import shutil
        shutil.copy2(MODEL_PATH, BACKUP_PATH)
        return True
    return False

def retrain_model():
    """آموزش مجدد مدل با داده‌های جدید"""
    try:
        print("🔄 شروع فرآیند آموزش مجدد...")
        
        # بارگذاری داده‌ها
        df, chat_data = load_existing_data()
        print(f"📊 بارگذاری {len(df)} نمونه داده")
        
        # پیش‌پردازش
        X, y, le, scaler = preprocess_data_for_retrain(df)
        print(f"✅ پیش‌پردازش کامل: {X.shape[0]} نمونه، {X.shape[1]} ویژگی")
        
        # تقسیم داده‌ها
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # پشتیبان‌گیری از مدل قبلی
        backup_success = backup_existing_model()
        
        # آموزش مدل جدید
        print("🧠 آموزش مدل جدید...")
        model = RandomForestClassifier(
            n_estimators=250,
            max_depth=12,
            random_state=42,
            class_weight='balanced',
            n_jobs=-1
        )
        
        model.fit(X_train, y_train)
        
        # ارزیابی مدل
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        # ذخیره مدل و preprocessors
        os.makedirs("ml/core", exist_ok=True)
        joblib.dump(model, MODEL_PATH)
        joblib.dump(le, "ml/core/label_encoder.pkl")
        joblib.dump(scaler, "ml/core/scaler.pkl")
        
        # گزارش تفصیلی
        report = classification_report(y_test, y_pred, output_dict=True)
        
        # ثبت در لاگ
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "samples": len(X),
            "training_samples": len(X_train),
            "test_samples": len(X_test),
            "accuracy": round(accuracy, 4),
            "model_params": {
                "n_estimators": 250,
                "max_depth": 12,
                "features": list(X.columns)
            },
            "backup_created": backup_success,
            "categories": list(y.unique()),
            "classification_report": report
        }
        
        # ذخیره لاگ
        if os.path.exists(LOG_PATH):
            with open(LOG_PATH, 'r', encoding='utf-8') as f:
                history = json.load(f)
        else:
            history = []
        
        history.append(log_entry)
        
        # نگه داشتن فقط 50 ورودی آخر
        if len(history) > 50:
            history = history[-50:]
        
        with open(LOG_PATH, 'w', encoding='utf-8') as f:
            json.dump(history, f, ensure_ascii=False, indent=2)
        
        # نتیجه نهایی
        result = {
            "status": "success",
            "message": "مدل با موفقیت بازآموزی شد",
            "accuracy": round(accuracy, 4),
            "samples": len(X),
            "training_samples": len(X_train),
            "test_samples": len(X_test),
            "backup_created": backup_success,
            "categories": list(y.unique()),
            "timestamp": datetime.now().isoformat()
        }
        
        print("✅ آموزش مجدد با موفقیت انجام شد")
        print(f"📈 دقت مدل: {accuracy:.4f}")
        print(f"📊 تعداد نمونه‌ها: {len(X)}")
        
        return result
        
    except Exception as e:
        error_result = {
            "status": "error",
            "message": f"خطا در آموزش مجدد: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }
        print(f"❌ خطا در آموزش مجدد: {e}")
        return error_result

def main():
    """تابع اصلی"""
    print("🚀 شروع سیستم آموزش خودکار Testology")
    print("=" * 50)
    
    result = retrain_model()
    
    # خروجی JSON برای API
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()













