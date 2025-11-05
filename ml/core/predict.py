import joblib
import json
import sys
import numpy as np

def load_model():
    """بارگذاری مدل و preprocessors"""
    try:
        model = joblib.load("ml/core/model.pkl")
        le = joblib.load("ml/core/label_encoder.pkl")
        scaler = joblib.load("ml/core/scaler.pkl")
        return model, le, scaler
    except FileNotFoundError:
        print(json.dumps({
            "status": "error",
            "message": "مدل هنوز آموزش ندیده. ابتدا train_model.py را اجرا کنید."
        }))
        sys.exit(1)

def predict_user_category(user_data):
    """پیش‌بینی دسته‌بندی کاربر"""
    model, le, scaler = load_model()
    
    # آماده‌سازی داده‌های کاربر
    score = float(user_data.get("score", 50))
    gender = user_data.get("gender", "male")
    age = int(user_data.get("age", 25))
    
    # کدگذاری جنسیت
    try:
        gender_encoded = le.transform([gender])[0]
    except ValueError:
        # اگر جنسیت جدید بود، از کد پیش‌فرض استفاده کن
        gender_encoded = 0
    
    # نرمال‌سازی نمره
    score_scaled = scaler.transform([[score]])[0][0]
    
    # پیش‌بینی
    X = np.array([[score_scaled, gender_encoded, age]])
    category = model.predict(X)[0]
    
    # احتمال‌ها
    probabilities = model.predict_proba(X)[0]
    classes = model.classes_
    prob_dict = {classes[i]: float(prob) for i, prob in enumerate(probabilities)}
    
    return category, prob_dict

def get_recommendations(category):
    """دریافت پیشنهادات بر اساس دسته‌بندی"""
    recommendations = {
        "anxiety": [
            "تمرین تنفس عمیق 4-7-8",
            "مقاله: مدیریت اضطراب اجتماعی",
            "مدیتیشن 10 دقیقه‌ای",
            "نوشتن افکار منفی و جایگزینی با مثبت"
        ],
        "depression": [
            "نوشتن 3 چیز مثبت هر روز",
            "مقاله: راه‌های خروج از افسردگی",
            "پیاده‌روی 30 دقیقه‌ای",
            "گفتگو با دوست یا خانواده"
        ],
        "focus": [
            "تمرین تمرکز 25 دقیقه‌ای (پومودورو)",
            "قطع نوتیفیکیشن‌های موبایل",
            "مقاله: تکنیک‌های تمرکز",
            "مراقبه ذهن آگاهی"
        ],
        "confidence": [
            "تست عزت نفس روزانه",
            "تمرین گفتگو با آینه",
            "مقاله: راه‌های افزایش اعتماد به نفس",
            "ثبت موفقیت‌های کوچک"
        ],
        "stress": [
            "تمرین ریلکسیشن عضلانی",
            "مقاله: مدیریت استرس کاری",
            "موسیقی آرام‌بخش",
            "تمرین یوگا یا تای‌چی"
        ]
    }
    
    return recommendations.get(category, [
        "استراحت و نوشیدن آب کافی",
        "گفتگو با یک دوست",
        "پیاده‌روی کوتاه در طبیعت"
    ])

def main():
    """تابع اصلی پیش‌بینی"""
    try:
        # دریافت داده‌های کاربر
        user_data = json.loads(sys.argv[1])
        
        # پیش‌بینی دسته‌بندی
        category, probabilities = predict_user_category(user_data)
        
        # دریافت پیشنهادات
        suggestions = get_recommendations(category)
        
        # نتیجه نهایی
        result = {
            "status": "success",
            "predicted_category": category,
            "confidence": probabilities.get(category, 0.0),
            "all_probabilities": probabilities,
            "suggestions": suggestions[:3],  # 3 پیشنهاد برتر
            "personalized_message": f"بر اساس تحلیل شما، دسته‌بندی '{category}' با اطمینان {probabilities.get(category, 0.0):.2f} پیشنهاد می‌شود."
        }
        
        print(json.dumps(result, ensure_ascii=False))
        
    except Exception as e:
        error_result = {
            "status": "error",
            "message": f"خطا در پیش‌بینی: {str(e)}"
        }
        print(json.dumps(error_result, ensure_ascii=False))

if __name__ == "__main__":
    main()













