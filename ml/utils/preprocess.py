import pandas as pd
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
import json

def preprocess_data():
    """پیش‌پردازش داده‌های تست‌ها و چت‌ها"""
    try:
        # خواندن داده‌های تست‌ها
        df = pd.read_csv("ml/data/user_tests.csv")
        df.fillna("", inplace=True)

        # کدگذاری متغیرهای کیفی
        le = LabelEncoder()
        df["gender_encoded"] = le.fit_transform(df["gender"].astype(str))

        # نرمال‌سازی نمرات
        scaler = MinMaxScaler()
        df["score_scaled"] = scaler.fit_transform(df[["score"]])

        # انتخاب ویژگی‌های اصلی
        features = df[["score_scaled", "gender_encoded", "age"]]
        labels = df["category"]

        return features, labels, le, scaler
    except FileNotFoundError:
        # اگر فایل داده وجود نداشت، داده‌های نمونه بساز
        return create_sample_data()

def create_sample_data():
    """ایجاد داده‌های نمونه برای تست"""
    import numpy as np
    
    np.random.seed(42)
    n_samples = 1000
    
    # داده‌های نمونه
    data = {
        'score': np.random.normal(50, 15, n_samples),
        'gender': np.random.choice(['male', 'female', 'other'], n_samples),
        'age': np.random.randint(18, 65, n_samples),
        'category': np.random.choice(['anxiety', 'depression', 'focus', 'confidence', 'stress'], n_samples)
    }
    
    df = pd.DataFrame(data)
    df.to_csv("ml/data/user_tests.csv", index=False)
    
    # کدگذاری
    le = LabelEncoder()
    df["gender_encoded"] = le.fit_transform(df["gender"])
    
    scaler = MinMaxScaler()
    df["score_scaled"] = scaler.fit_transform(df[["score"]])
    
    features = df[["score_scaled", "gender_encoded", "age"]]
    labels = df["category"]
    
    return features, labels, le, scaler

if __name__ == "__main__":
    X, y, le, scaler = preprocess_data()
    print(f"✅ Data ready: {X.shape[0]} samples, {X.shape[1]} features")
    print(f"Categories: {y.unique()}")













