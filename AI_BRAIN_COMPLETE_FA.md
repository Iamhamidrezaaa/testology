# 🧠 مغز یادگیرنده Testology - راهنمای کامل

## 🎯 مقدمه

Testology حالا دارای یک **مغز یادگیرنده** است که قابلیت‌های زیر را ارائه می‌دهد:

- **یادگیری خودکار** از رفتار کاربران
- **پیشنهادات شخصی‌سازی‌شده** بر اساس تحلیل روان‌شناختی
- **تحلیل ترندها** و پیشنهاد بهبود پلتفرم
- **AI Supervisor** برای تصمیم‌گیری هوشمند

## 🚀 راه‌اندازی سریع

### 1. نصب و راه‌اندازی

```bash
# راه‌اندازی کامل سیستم AI
npm run setup-ai

# یا دستی:
cd ml
pip install -r requirements.txt
python setup.py
```

### 2. آموزش مدل

```bash
# آموزش مدل یادگیرنده
npm run train-model

# یا دستی:
cd ml && python core/train_model.py
```

### 3. تست سیستم

```bash
# تست کامل سیستم
npm run test-ai

# یا دستی:
cd ml && python test_system.py
```

## 🏗️ معماری سیستم

### لایه‌های مغز یادگیرنده

```
┌─────────────────────────────────────┐
│           Frontend (Next.js)        │
├─────────────────────────────────────┤
│         API Layer (REST)            │
├─────────────────────────────────────┤
│      Bridge Layer (Node ↔ Python)   │
├─────────────────────────────────────┤
│         ML Core (Python)            │
│  ┌─────────────┬─────────────────┐  │
│  │  Training   │   Prediction    │  │
│  │  Model      │   System        │  │
│  └─────────────┴─────────────────┘  │
│  ┌─────────────┬─────────────────┐  │
│  │ AI          │   Data          │  │
│  │ Supervisor  │   Processing    │  │
│  └─────────────┴─────────────────┘  │
└─────────────────────────────────────┘
```

## 🔧 کامپوننت‌های اصلی

### 1. مدل یادگیرنده (ML Core)

**فایل**: `ml/core/train_model.py`

```python
# آموزش مدل Random Forest
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    class_weight='balanced'
)
```

**ویژگی‌ها**:
- دسته‌بندی کاربران بر اساس تست‌ها
- پیش‌بینی نیازهای روان‌شناختی
- یادگیری از داده‌های جدید

### 2. سیستم پیش‌بینی

**فایل**: `ml/core/predict.py`

```python
# پیش‌بینی دسته‌بندی کاربر
category = model.predict(user_features)
suggestions = get_recommendations(category)
```

**خروجی**:
- دسته‌بندی روان‌شناختی
- پیشنهادات شخصی‌سازی‌شده
- سطح اطمینان پیش‌بینی

### 3. AI Supervisor

**فایل**: `ml/core/ai_supervisor.py`

```python
# تحلیل ترندها و ارائه پیشنهادات
insights = analyze_trends()
actions = suggest_platform_improvements()
```

**قابلیت‌ها**:
- تحلیل رفتار کاربران
- پیشنهاد بهبود پلتفرم
- مانیتورینگ سلامت سیستم

## 📊 API Endpoints

### پیش‌بینی شخصی‌سازی‌شده

```typescript
POST /api/ml/predict
{
  "score": 65,
  "gender": "female",
  "age": 25
}

// پاسخ:
{
  "predicted_category": "anxiety",
  "confidence": 0.85,
  "suggestions": [
    "تمرین تنفس عمیق 4-7-8",
    "مقاله: مدیریت اضطراب اجتماعی",
    "مدیتیشن 10 دقیقه‌ای"
  ]
}
```

### تحلیل AI Supervisor

```typescript
POST /api/admin/ai/analyze

// پاسخ:
{
  "trending_categories": [["anxiety", 45], ["depression", 32]],
  "platform_health_score": {
    "score": 0.82,
    "status": "عالی"
  },
  "recommended_actions": [
    "افزودن مقاله تخصصی درباره اضطراب اجتماعی",
    "ساخت تست کوتاه‌تر برای تشخیص اضطراب"
  ]
}
```

## 🎛️ داشبورد مدیریتی

### دسترسی: `/admin/ai-dashboard`

**ویژگی‌ها**:
- سلامت کلی پلتفرم
- دسته‌های پرتکرار
- تحلیل احساسات کاربران
- عملکرد محتوا
- اقدامات پیشنهادی AI

### کامپوننت‌های داشبورد:

```tsx
// سلامت پلتفرم
<PlatformHealthCard />

// تحلیل ترندها
<TrendingCategoriesCard />

// احساسات کاربران
<SentimentAnalysisCard />

// پیشنهادات AI
<AIRecommendationsCard />
```

## 🔄 فرآیند یادگیری

### 1. جمع‌آوری داده

```python
# از تست‌های کاربران
user_tests = pd.read_csv("ml/data/user_tests.csv")

# از تعاملات چت
chat_data = json.load("ml/data/chat_sentiments.json")
```

### 2. پیش‌پردازش

```python
# کدگذاری متغیرهای کیفی
le = LabelEncoder()
df["gender_encoded"] = le.fit_transform(df["gender"])

# نرمال‌سازی نمرات
scaler = MinMaxScaler()
df["score_scaled"] = scaler.fit_transform(df[["score"]])
```

### 3. آموزش مدل

```python
# تقسیم داده‌ها
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# آموزش
model.fit(X_train, y_train)

# ارزیابی
accuracy = accuracy_score(y_test, y_pred)
```

### 4. بهکارگیری

```python
# پیش‌بینی زنده
prediction = model.predict(user_features)
recommendations = get_personalized_suggestions(prediction)
```

## 📈 مانیتورینگ و تحلیل

### متریک‌های کلیدی

1. **دقت مدل**: درصد پیش‌بینی‌های صحیح
2. **رضایت کاربران**: نرخ رضایت از پیشنهادات
3. **سلامت پلتفرم**: نمره کلی عملکرد
4. **ترندها**: دسته‌های پرتکرار

### گزارش‌های خودکار

```python
# گزارش هفتگی
weekly_report = {
    "accuracy": model_accuracy,
    "user_satisfaction": satisfaction_rate,
    "trending_categories": top_categories,
    "recommended_actions": ai_suggestions
}
```

## 🛠️ توسعه و سفارشی‌سازی

### اضافه کردن ویژگی جدید

1. **ویرایش پیش‌پردازش**:
```python
# در utils/preprocess.py
def add_new_feature(df):
    df["new_feature"] = calculate_new_feature(df)
    return df
```

2. **بروزرسانی مدل**:
```python
# در core/train_model.py
features = df[["score_scaled", "gender_encoded", "age", "new_feature"]]
```

3. **تست تغییرات**:
```bash
python test_system.py
```

### اضافه کردن دسته جدید

1. **بروزرسانی پیشنهادات**:
```python
# در core/predict.py
recommendations = {
    "new_category": [
        "پیشنهاد 1",
        "پیشنهاد 2"
    ]
}
```

2. **آموزش مجدد**:
```bash
npm run train-model
```

## 🔒 امنیت و حریم خصوصی

### محافظت از داده‌ها

- **رمزگذاری**: داده‌های حساس رمزگذاری می‌شوند
- **دسترسی محدود**: فقط API های مجاز دسترسی دارند
- **لاگ‌گیری**: تمام فعالیت‌ها ثبت می‌شوند

### حریم خصوصی

- **ناشناس‌سازی**: داده‌های کاربران ناشناس پردازش می‌شوند
- **ذخیره محلی**: مدل‌ها روی سرور محلی ذخیره می‌شوند
- **عدم اشتراک**: داده‌ها با سرورهای خارجی اشتراک نمی‌شوند

## 🚨 عیب‌یابی

### خطاهای رایج

1. **ModuleNotFoundError**:
```bash
pip install -r requirements.txt
```

2. **FileNotFoundError**:
```bash
python setup.py
```

3. **Model not trained**:
```bash
npm run train-model
```

### بررسی سلامت سیستم

```bash
# تست کامل
npm run test-ai

# تست جداگانه
cd ml
python core/train_model.py
python core/predict.py '{"score": 65, "gender": "female", "age": 25}'
python core/ai_supervisor.py
```

## 📊 مثال‌های کاربردی

### 1. پیشنهاد محتوای شخصی‌سازی‌شده

```typescript
// در کامپوننت React
const userData = {
  score: 65,
  gender: "female",
  age: 25
};

const response = await fetch('/api/ml/predict', {
  method: 'POST',
  body: JSON.stringify(userData)
});

const { suggestions } = await response.json();
// نمایش پیشنهادات به کاربر
```

### 2. تحلیل ترندها برای ادمین

```typescript
// در داشبورد ادمین
const analyzeTrends = async () => {
  const response = await fetch('/api/admin/ai/analyze', {
    method: 'POST'
  });
  
  const insights = await response.json();
  // نمایش تحلیل‌ها در داشبورد
};
```

### 3. آموزش مدل خودکار

```bash
# کرون جاب برای آموزش هفتگی
0 2 * * 0 cd /path/to/testology && npm run train-model
```

## 🎯 نتیجه‌گیری

Testology حالا دارای یک **مغز یادگیرنده** کامل است که:

✅ **یاد می‌گیرد** از رفتار کاربران  
✅ **پیشنهاد می‌دهد** محتوای شخصی‌سازی‌شده  
✅ **تحلیل می‌کند** ترندها و نیازها  
✅ **بهبود می‌یابد** به صورت خودکار  
✅ **تصمیم می‌گیرد** برای رشد پلتفرم  

این سیستم Testology را از یک پلتفرم ساده به یک **موجود یادگیرنده‌ی دیجیتال** تبدیل کرده است! 🚀

---

**نکته مهم**: این سیستم به صورت مداوم یاد می‌گیرد و بهبود می‌یابد. توصیه می‌شود مدل را ماهی یکبار بازآموزی کنید تا بهترین عملکرد را داشته باشد.













