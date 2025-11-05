#!/usr/bin/env python3
"""
سیستم ارزیابی مدل Testology
این اسکریپت مدل را ارزیابی می‌کند و گزارش تفصیلی ارائه می‌دهد
"""

import joblib
import pandas as pd
import numpy as np
import json
import os
from datetime import datetime
from sklearn.metrics import (
    accuracy_score, 
    confusion_matrix, 
    classification_report,
    precision_recall_fscore_support,
    roc_auc_score
)
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import cross_val_score

def load_model_and_data():
    """بارگذاری مدل و داده‌ها"""
    try:
        # بارگذاری مدل
        model = joblib.load("ml/core/model.pkl")
        le = joblib.load("ml/core/label_encoder.pkl")
        scaler = joblib.load("ml/core/scaler.pkl")
        
        # بارگذاری داده‌ها
        df = pd.read_csv("ml/data/user_tests.csv")
        
        return model, le, scaler, df
    except FileNotFoundError as e:
        print(f"❌ خطا در بارگذاری: {e}")
        return None, None, None, None

def preprocess_for_evaluation(df, le, scaler):
    """پیش‌پردازش داده‌ها برای ارزیابی"""
    # تمیز کردن داده‌ها
    df = df.dropna()
    df = df[df['score'].between(0, 100)]
    df = df[df['age'].between(18, 100)]
    
    # کدگذاری جنسیت
    df["gender_encoded"] = le.transform(df["gender"].astype(str))
    
    # نرمال‌سازی نمره
    df["score_scaled"] = scaler.transform(df[["score"]])
    
    # آماده‌سازی ویژگی‌ها و برچسب‌ها
    X = df[["score_scaled", "gender_encoded", "age"]]
    y = df["category"]
    
    return X, y, df

def calculate_advanced_metrics(y_true, y_pred, y_proba=None):
    """محاسبه متریک‌های پیشرفته"""
    # متریک‌های پایه
    accuracy = accuracy_score(y_true, y_pred)
    
    # گزارش تفصیلی
    report = classification_report(y_true, y_pred, output_dict=True)
    
    # ماتریس سردرگمی
    labels = np.unique(y_true)
    conf_matrix = confusion_matrix(y_true, y_pred, labels=labels)
    
    # F1-score برای هر کلاس
    precision, recall, f1, support = precision_recall_fscore_support(
        y_true, y_pred, labels=labels, average=None
    )
    
    # محاسبه AUC (اگر احتمال‌ها موجود باشد)
    auc_scores = {}
    if y_proba is not None:
        try:
            # برای کلاس‌های چندگانه
            if len(labels) > 2:
                auc_scores['macro'] = roc_auc_score(y_true, y_proba, multi_class='ovr', average='macro')
                auc_scores['weighted'] = roc_auc_score(y_true, y_proba, multi_class='ovr', average='weighted')
            else:
                auc_scores['binary'] = roc_auc_score(y_true, y_proba[:, 1])
        except Exception as e:
            print(f"⚠️ خطا در محاسبه AUC: {e}")
    
    return {
        'accuracy': accuracy,
        'confusion_matrix': conf_matrix.tolist(),
        'labels': labels.tolist(),
        'report': report,
        'precision': precision.tolist(),
        'recall': recall.tolist(),
        'f1_scores': f1.tolist(),
        'support': support.tolist(),
        'auc_scores': auc_scores
    }

def analyze_model_performance(metrics):
    """تحلیل عملکرد مدل و ارائه پیشنهادات"""
    suggestions = []
    
    # تحلیل دقت کلی
    accuracy = metrics['accuracy']
    if accuracy < 0.7:
        suggestions.append("دقت مدل پایین است. پیشنهاد: افزایش داده‌های آموزشی")
    elif accuracy < 0.8:
        suggestions.append("دقت مدل متوسط است. پیشنهاد: تنظیم پارامترهای مدل")
    else:
        suggestions.append("دقت مدل عالی است. مدل عملکرد خوبی دارد")
    
    # تحلیل F1-score برای هر کلاس
    f1_scores = metrics['f1_scores']
    labels = metrics['labels']
    
    for i, (label, f1) in enumerate(zip(labels, f1_scores)):
        if f1 < 0.6:
            suggestions.append(f"دقت مدل در دسته '{label}' پایین است. پیشنهاد: افزودن داده‌های بیشتر برای این دسته")
        elif f1 < 0.8:
            suggestions.append(f"دقت مدل در دسته '{label}' متوسط است. پیشنهاد: بررسی ویژگی‌های مربوط به این دسته")
    
    # تحلیل ماتریس سردرگمی
    conf_matrix = np.array(metrics['confusion_matrix'])
    total_samples = np.sum(conf_matrix)
    
    # محاسبه درصد خطا
    error_rate = 1 - accuracy
    suggestions.append(f"نرخ خطای کلی: {error_rate:.2%}")
    
    # شناسایی کلاس‌های مشکل‌دار
    for i, label in enumerate(labels):
        class_errors = np.sum(conf_matrix[i]) - conf_matrix[i, i]
        class_total = np.sum(conf_matrix[i])
        if class_total > 0:
            class_error_rate = class_errors / class_total
            if class_error_rate > 0.3:
                suggestions.append(f"دسته '{label}' خطای بالایی دارد ({class_error_rate:.1%})")
    
    return suggestions

def generate_heatmap_data(conf_matrix, labels):
    """تولید داده‌های Heatmap"""
    heatmap_data = []
    
    for i, true_label in enumerate(labels):
        for j, pred_label in enumerate(labels):
            heatmap_data.append({
                'true_label': true_label,
                'predicted_label': pred_label,
                'value': int(conf_matrix[i, j]),
                'percentage': round((conf_matrix[i, j] / np.sum(conf_matrix[i])) * 100, 1) if np.sum(conf_matrix[i]) > 0 else 0
            })
    
    return heatmap_data

def evaluate_model():
    """تابع اصلی ارزیابی مدل"""
    try:
        print("🔍 شروع ارزیابی مدل...")
        
        # بارگذاری مدل و داده‌ها
        model, le, scaler, df = load_model_and_data()
        if model is None:
            return {"status": "error", "message": "مدل یا داده‌ها یافت نشد"}
        
        print(f"📊 بارگذاری {len(df)} نمونه داده")
        
        # پیش‌پردازش
        X, y, df_processed = preprocess_for_evaluation(df, le, scaler)
        print(f"✅ پیش‌پردازش کامل: {X.shape[0]} نمونه")
        
        # پیش‌بینی
        y_pred = model.predict(X)
        y_proba = model.predict_proba(X) if hasattr(model, 'predict_proba') else None
        
        # محاسبه متریک‌ها
        metrics = calculate_advanced_metrics(y, y_pred, y_proba)
        
        # تحلیل عملکرد
        suggestions = analyze_model_performance(metrics)
        
        # تولید داده‌های Heatmap
        heatmap_data = generate_heatmap_data(
            np.array(metrics['confusion_matrix']), 
            metrics['labels']
        )
        
        # Cross-validation
        try:
            cv_scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
            metrics['cross_validation'] = {
                'mean': float(np.mean(cv_scores)),
                'std': float(np.std(cv_scores)),
                'scores': cv_scores.tolist()
            }
        except Exception as e:
            print(f"⚠️ خطا در Cross-validation: {e}")
            metrics['cross_validation'] = None
        
        # نتیجه نهایی
        evaluation_result = {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "metrics": metrics,
            "suggestions": suggestions,
            "heatmap_data": heatmap_data,
            "model_info": {
                "n_features": X.shape[1],
                "n_samples": X.shape[0],
                "n_classes": len(metrics['labels']),
                "model_type": type(model).__name__
            }
        }
        
        # ذخیره گزارش
        os.makedirs("ml/data", exist_ok=True)
        with open("ml/data/eval_report.json", 'w', encoding='utf-8') as f:
            json.dump(evaluation_result, f, ensure_ascii=False, indent=2)
        
        print("✅ ارزیابی مدل با موفقیت انجام شد")
        print(f"📈 دقت: {metrics['accuracy']:.3f}")
        print(f"📊 تعداد کلاس‌ها: {len(metrics['labels'])}")
        print(f"💡 پیشنهادات: {len(suggestions)} مورد")
        
        return evaluation_result
        
    except Exception as e:
        error_result = {
            "status": "error",
            "message": f"خطا در ارزیابی مدل: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }
        print(f"❌ خطا در ارزیابی: {e}")
        return error_result

def main():
    """تابع اصلی"""
    print("🧠 سیستم ارزیابی مدل Testology")
    print("=" * 40)
    
    result = evaluate_model()
    
    # خروجی JSON برای API
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()













