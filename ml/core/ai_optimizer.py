#!/usr/bin/env python3
"""
سیستم بهینه‌سازی خودکار مدل Testology
این اسکریپت مدل را به صورت خودکار بهینه‌سازی می‌کند
"""

import json
import os
import sys
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV, RandomizedSearchCV
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder, MinMaxScaler

# اضافه کردن مسیر utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

LOG_PATH = "ml/data/optimization_log.json"
MODEL_PATH = "ml/core/model.pkl"
BACKUP_PATH = "ml/core/model_backup_optimized.pkl"

def load_data_and_preprocess():
    """بارگذاری و پیش‌پردازش داده‌ها"""
    try:
        # بارگذاری داده‌ها
        df = pd.read_csv("ml/data/user_tests.csv")
        df = df.dropna()
        df = df[df['score'].between(0, 100)]
        df = df[df['age'].between(18, 100)]
        
        # کدگذاری جنسیت
        le = LabelEncoder()
        df["gender_encoded"] = le.fit_transform(df["gender"].astype(str))
        
        # نرمال‌سازی نمره
        scaler = MinMaxScaler()
        df["score_scaled"] = scaler.fit_transform(df[["score"]])
        
        # آماده‌سازی ویژگی‌ها و برچسب‌ها
        X = df[["score_scaled", "gender_encoded", "age"]]
        y = df["category"]
        
        return X, y, le, scaler
    except Exception as e:
        print(f"❌ خطا در بارگذاری داده‌ها: {e}")
        return None, None, None, None

def create_parameter_grid():
    """ایجاد شبکه پارامترهای بهینه‌سازی"""
    return {
        "n_estimators": [100, 150, 200, 250, 300],
        "max_depth": [6, 8, 10, 12, 15, None],
        "min_samples_split": [2, 4, 6, 8, 10],
        "min_samples_leaf": [1, 2, 4, 6],
        "max_features": ["sqrt", "log2", None],
        "bootstrap": [True, False],
        "class_weight": ["balanced", "balanced_subsample", None]
    }

def optimize_with_grid_search(X, y):
    """بهینه‌سازی با GridSearchCV"""
    print("🔍 شروع بهینه‌سازی با GridSearchCV...")
    
    # تقسیم داده‌ها
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )
    
    # ایجاد مدل پایه
    model = RandomForestClassifier(random_state=42, n_jobs=-1)
    
    # شبکه پارامترها
    param_grid = create_parameter_grid()
    
    # GridSearchCV
    grid_search = GridSearchCV(
        estimator=model,
        param_grid=param_grid,
        cv=3,
        n_jobs=-1,
        verbose=1,
        scoring='accuracy'
    )
    
    # اجرای بهینه‌سازی
    grid_search.fit(X_train, y_train)
    
    # ارزیابی مدل بهینه
    best_model = grid_search.best_estimator_
    y_pred = best_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    return best_model, grid_search.best_params_, accuracy, grid_search.best_score_

def optimize_with_random_search(X, y):
    """بهینه‌سازی با RandomizedSearchCV"""
    print("🔍 شروع بهینه‌سازی با RandomizedSearchCV...")
    
    # تقسیم داده‌ها
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )
    
    # ایجاد مدل پایه
    model = RandomForestClassifier(random_state=42, n_jobs=-1)
    
    # شبکه پارامترها
    param_dist = create_parameter_grid()
    
    # RandomizedSearchCV
    random_search = RandomizedSearchCV(
        estimator=model,
        param_distributions=param_dist,
        n_iter=50,
        cv=3,
        n_jobs=-1,
        verbose=1,
        scoring='accuracy',
        random_state=42
    )
    
    # اجرای بهینه‌سازی
    random_search.fit(X_train, y_train)
    
    # ارزیابی مدل بهینه
    best_model = random_search.best_estimator_
    y_pred = best_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    return best_model, random_search.best_params_, accuracy, random_search.best_score_

def backup_existing_model():
    """پشتیبان‌گیری از مدل موجود"""
    if os.path.exists(MODEL_PATH):
        import shutil
        shutil.copy2(MODEL_PATH, BACKUP_PATH)
        return True
    return False

def save_optimization_log(best_params, accuracy, cv_score, method):
    """ذخیره لاگ بهینه‌سازی"""
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "method": method,
        "best_params": best_params,
        "accuracy": round(accuracy, 4),
        "cv_score": round(cv_score, 4),
        "improvement": "N/A"  # در اولین اجرا
    }
    
    # خواندن تاریخچه موجود
    if os.path.exists(LOG_PATH):
        with open(LOG_PATH, 'r', encoding='utf-8') as f:
            history = json.load(f)
    else:
        history = []
    
    # محاسبه بهبود نسبت به اجرای قبلی
    if history:
        last_accuracy = history[-1].get('accuracy', 0)
        improvement = accuracy - last_accuracy
        log_entry["improvement"] = round(improvement, 4)
    
    # اضافه کردن ورودی جدید
    history.append(log_entry)
    
    # نگه داشتن فقط 50 ورودی آخر
    if len(history) > 50:
        history = history[-50:]
    
    # ذخیره لاگ
    os.makedirs("ml/data", exist_ok=True)
    with open(LOG_PATH, 'w', encoding='utf-8') as f:
        json.dump(history, f, ensure_ascii=False, indent=2)

def optimize_model():
    """تابع اصلی بهینه‌سازی مدل"""
    try:
        print("⚙️ شروع بهینه‌سازی خودکار مدل Testology")
        print("=" * 50)
        
        # بارگذاری داده‌ها
        X, y, le, scaler = load_data_and_preprocess()
        if X is None:
            return {"status": "error", "message": "خطا در بارگذاری داده‌ها"}
        
        print(f"📊 بارگذاری {len(X)} نمونه داده")
        
        # پشتیبان‌گیری از مدل موجود
        backup_created = backup_existing_model()
        
        # انتخاب روش بهینه‌سازی بر اساس حجم داده
        if len(X) < 1000:
            print("📈 حجم داده کم - استفاده از GridSearchCV")
            best_model, best_params, accuracy, cv_score = optimize_with_grid_search(X, y)
            method = "GridSearchCV"
        else:
            print("📈 حجم داده زیاد - استفاده از RandomizedSearchCV")
            best_model, best_params, accuracy, cv_score = optimize_with_random_search(X, y)
            method = "RandomizedSearchCV"
        
        # ذخیره مدل بهینه
        os.makedirs("ml/core", exist_ok=True)
        joblib.dump(best_model, MODEL_PATH)
        joblib.dump(le, "ml/core/label_encoder.pkl")
        joblib.dump(scaler, "ml/core/scaler.pkl")
        
        # ذخیره لاگ
        save_optimization_log(best_params, accuracy, cv_score, method)
        
        # گزارش تفصیلی
        report = classification_report(y, best_model.predict(X), output_dict=True)
        
        result = {
            "status": "success",
            "message": "مدل با موفقیت بهینه‌سازی شد",
            "method": method,
            "best_params": best_params,
            "accuracy": round(accuracy, 4),
            "cv_score": round(cv_score, 4),
            "backup_created": backup_created,
            "timestamp": datetime.now().isoformat(),
            "model_info": {
                "n_estimators": best_params.get('n_estimators'),
                "max_depth": best_params.get('max_depth'),
                "min_samples_split": best_params.get('min_samples_split'),
                "min_samples_leaf": best_params.get('min_samples_leaf'),
                "max_features": best_params.get('max_features'),
                "bootstrap": best_params.get('bootstrap'),
                "class_weight": best_params.get('class_weight')
            },
            "classification_report": report
        }
        
        print("✅ بهینه‌سازی با موفقیت انجام شد")
        print(f"📈 دقت: {accuracy:.4f}")
        print(f"🎯 پارامترهای بهینه: {best_params}")
        print(f"💾 پشتیبان ایجاد شد: {backup_created}")
        
        return result
        
    except Exception as e:
        error_result = {
            "status": "error",
            "message": f"خطا در بهینه‌سازی: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }
        print(f"❌ خطا در بهینه‌سازی: {e}")
        return error_result

def main():
    """تابع اصلی"""
    print("🧠 سیستم بهینه‌سازی خودکار Testology")
    print("=" * 40)
    
    result = optimize_model()
    
    # خروجی JSON برای API
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()