from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import json
import sys
import os

# اضافه کردن مسیر utils به path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from utils.preprocess import preprocess_data

def train_model():
    """آموزش مدل یادگیرنده اصلی"""
    try:
        # آماده‌سازی داده‌ها
        X, y, le, scaler = preprocess_data()
        
        # تقسیم داده‌ها
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        # آموزش مدل
        model = RandomForestClassifier(
            n_estimators=200, 
            max_depth=10, 
            random_state=42,
            class_weight='balanced'
        )
        model.fit(X_train, y_train)

        # ارزیابی مدل
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        # ذخیره مدل و preprocessors
        os.makedirs("ml/core", exist_ok=True)
        joblib.dump(model, "ml/core/model.pkl")
        joblib.dump(le, "ml/core/label_encoder.pkl")
        joblib.dump(scaler, "ml/core/scaler.pkl")
        
        # گزارش عملکرد
        report = classification_report(y_test, y_pred, output_dict=True)
        
        result = {
            "status": "success",
            "accuracy": float(accuracy),
            "model_info": {
                "n_estimators": 200,
                "max_depth": 10,
                "features": list(X.columns)
            },
            "classification_report": report
        }
        
        print(json.dumps(result, ensure_ascii=False))
        
    except Exception as e:
        error_result = {
            "status": "error",
            "message": str(e)
        }
        print(json.dumps(error_result, ensure_ascii=False))

if __name__ == "__main__":
    train_model()













