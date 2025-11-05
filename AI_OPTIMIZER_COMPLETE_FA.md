# ⚙️ AI Optimizer - راهنمای کامل

## 🎯 مقدمه

Testology حالا دارای یک **سیستم بهینه‌سازی خودکار** است که قابلیت‌های زیر را ارائه می‌دهد:

- **⚙️ بهینه‌سازی خودکار**: پیدا کردن بهترین پارامترهای مدل
- **🧠 یادگیری خودتصحیح**: مدل خودش یاد می‌گیره چطور بهتر یاد بگیره
- **📈 بهبود دقت**: افزایش مداوم دقت مدل
- **🔧 تنظیم پارامترها**: بهینه‌سازی n_estimators، max_depth و سایر پارامترها
- **📊 گزارش‌گیری**: ثبت کامل تغییرات و بهبودها

## ✨ ویژگی‌های کلیدی

- **🔧 بهینه‌سازی خودکار**: GridSearchCV و RandomizedSearchCV
- **📈 افزایش دقت**: بهبود مداوم عملکرد مدل
- **🧠 یادگیری خودتصحیح**: مدل خودش خودش رو بهبود می‌ده
- **💾 لاگ کامل**: ثبت تمام تغییرات و بهبودها
- **📊 نمایش در داشبورد**: مشاهده تاریخچه و نتایج
- **🔄 اجرای زمان‌بندی‌شده**: بهینه‌سازی خودکار

## 🏗️ معماری سیستم

```
┌─────────────────────────────────────┐
│        AI Optimizer System          │
├─────────────────────────────────────┤
│  ┌─────────────┬─────────────────┐  │
│  │   Parameter │   Model         │  │
│  │   Search    │   Training      │  │
│  └─────────────┴─────────────────┘  │
│  ┌─────────────┬─────────────────┐  │
│  │   Accuracy  │   Logging       │  │
│  │   Evaluation│   & History     │  │
│  └─────────────┴─────────────────┘  │
│  ┌─────────────┬─────────────────┐  │
│  │   Auto     │   Dashboard      │  │
│  │   Schedule │   Integration     │  │
│  └─────────────┴─────────────────┘  │
└─────────────────────────────────────┘
```

## 🚀 راه‌اندازی سریع

### 1. نصب و راه‌اندازی

```bash
# راه‌اندازی کامل سیستم
bash setup-ai-brain.sh

# تست بهینه‌سازی
cd ml && python core/ai_optimizer.py
```

### 2. اجرای بهینه‌سازی

```bash
# بهینه‌سازی دستی
npm run optimize

# یا دستی:
cd ml && python core/ai_optimizer.py
```

### 3. تنظیم Cron Job

```bash
# هر ماه بهینه‌سازی خودکار
0 2 1 * * cd /path/to/testology && npm run auto-optimize
```

## 🔧 کامپوننت‌های اصلی

### 1. اسکریپت AI Optimizer

**فایل**: `ml/core/ai_optimizer.py`

```python
def optimize_model():
    # بارگذاری داده‌ها
    X, y, le, scaler = load_data_and_preprocess()
    
    # انتخاب روش بهینه‌سازی
    if len(X) < 1000:
        best_model, best_params, accuracy, cv_score = optimize_with_grid_search(X, y)
    else:
        best_model, best_params, accuracy, cv_score = optimize_with_random_search(X, y)
    
    # ذخیره مدل بهینه
    joblib.dump(best_model, MODEL_PATH)
    
    # ثبت لاگ
    save_optimization_log(best_params, accuracy, cv_score, method)
```

**ویژگی‌ها**:
- بهینه‌سازی با GridSearchCV و RandomizedSearchCV
- انتخاب خودکار روش بر اساس حجم داده
- پشتیبان‌گیری از مدل قبلی
- ثبت کامل لاگ تغییرات

### 2. API بهینه‌سازی

**فایل**: `app/api/ml/optimize/route.ts`

```typescript
export async function POST() {
  const output = await runPython('ml/core/ai_optimizer.py');
  const result = JSON.parse(output);
  
  if (result.status === 'success') {
    // ارسال اطلاع‌رسانی
    await notifyOptimization(result);
    return NextResponse.json({ success: true, data: result });
  }
}
```

**قابلیت‌ها**:
- اجرای بهینه‌سازی از طریق API
- ارسال اطلاع‌رسانی خودکار
- بازگشت نتایج تفصیلی

### 3. کامپوننت OptimizationHistory

**فایل**: `app/admin/ai-dashboard/components/OptimizationHistory.tsx`

```tsx
export default function OptimizationHistory() {
  const [logs, setLogs] = useState<OptimizationLog[]>([]);
  
  const runOptimization = async () => {
    const response = await fetch("/api/ml/optimize", {
      method: "POST"
    });
    // بارگذاری مجدد تاریخچه
  };
  
  return (
    <div>
      {/* آمار کلی */}
      <StatsCards />
      
      {/* جدول تاریخچه */}
      <OptimizationTable />
      
      {/* نمودار پیشرفت */}
      <ProgressChart />
    </div>
  );
}
```

**ویژگی‌ها**:
- نمایش تاریخچه کامل بهینه‌سازی‌ها
- دکمه بهینه‌سازی دستی
- آمار کلی و نمودارها
- نمایش پارامترهای بهینه

### 4. اسکریپت خودکار

**فایل**: `scripts/auto_optimize.js`

```javascript
async function optimizeWithRetry() {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await makeRequest('/api/ml/optimize', {
        method: 'POST'
      });
      
      if (response.success) {
        console.log('✅ بهینه‌سازی موفق!');
        return true;
      }
    } catch (error) {
      // Retry logic
    }
  }
}
```

**ویژگی‌ها**:
- اجرای خودکار بهینه‌سازی
- سیستم retry برای اطمینان
- لاگ‌گیری کامل فرآیند

## 📊 پارامترهای بهینه‌سازی

### پارامترهای Random Forest

```python
param_grid = {
    "n_estimators": [100, 150, 200, 250, 300],
    "max_depth": [6, 8, 10, 12, 15, None],
    "min_samples_split": [2, 4, 6, 8, 10],
    "min_samples_leaf": [1, 2, 4, 6],
    "max_features": ["sqrt", "log2", None],
    "bootstrap": [True, False],
    "class_weight": ["balanced", "balanced_subsample", None]
}
```

### انتخاب روش بهینه‌سازی

- **GridSearchCV**: برای داده‌های کم (< 1000 نمونه)
- **RandomizedSearchCV**: برای داده‌های زیاد (≥ 1000 نمونه)

## 🎛️ داشبورد مدیریتی

### دسترسی: `/admin/ai-dashboard`

**بخش‌های جدید**:
- **تاریخچه بهینه‌سازی**: نمایش تمام بهینه‌سازی‌های انجام شده
- **آمار کلی**: تعداد بهینه‌سازی‌ها، آخرین دقت، بهترین دقت
- **دکمه بهینه‌سازی دستی**: امکان اجرای بهینه‌سازی از داشبورد
- **نمودار پیشرفت**: نمایش بهبود دقت در طول زمان

### ویژگی‌های داشبورد:

```tsx
// آمار کلی
<StatsCards />

// جدول تاریخچه
<OptimizationTable />

// دکمه بهینه‌سازی دستی
<ManualOptimizationButton />

// نمودار پیشرفت دقت
<AccuracyProgressChart />
```

## 📈 مثال‌های کاربردی

### 1. بهینه‌سازی دستی

```bash
# از طریق npm
npm run optimize

# از طریق Python
cd ml && python core/ai_optimizer.py

# از طریق API
curl -X POST http://localhost:3000/api/ml/optimize
```

### 2. مشاهده نتایج

```json
{
  "status": "success",
  "method": "GridSearchCV",
  "best_params": {
    "n_estimators": 250,
    "max_depth": 12,
    "min_samples_split": 4
  },
  "accuracy": 0.875,
  "cv_score": 0.862
}
```

### 3. تنظیم Cron Job

```bash
# ویرایش crontab
crontab -e

# اضافه کردن خط زیر:
0 2 1 * * cd /path/to/testology && npm run auto-optimize
```

## 🔄 فرآیند بهینه‌سازی

### 1. بارگذاری داده‌ها

```python
X, y, le, scaler = load_data_and_preprocess()
```

### 2. انتخاب روش

```python
if len(X) < 1000:
    method = "GridSearchCV"
else:
    method = "RandomizedSearchCV"
```

### 3. اجرای بهینه‌سازی

```python
grid_search = GridSearchCV(model, param_grid, cv=3)
grid_search.fit(X_train, y_train)
```

### 4. ارزیابی مدل

```python
best_model = grid_search.best_estimator_
accuracy = accuracy_score(y_test, y_pred)
```

### 5. ذخیره و لاگ

```python
joblib.dump(best_model, MODEL_PATH)
save_optimization_log(best_params, accuracy, cv_score)
```

## 📊 گزارش‌های خودکار

### گزارش بهینه‌سازی

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "method": "GridSearchCV",
  "best_params": {
    "n_estimators": 250,
    "max_depth": 12,
    "min_samples_split": 4
  },
  "accuracy": 0.875,
  "cv_score": 0.862,
  "improvement": 0.023
}
```

### لاگ تاریخچه

```json
[
  {
    "timestamp": "2024-01-15T10:30:00Z",
    "method": "GridSearchCV",
    "accuracy": 0.875,
    "improvement": 0.023
  },
  {
    "timestamp": "2024-01-01T10:30:00Z",
    "method": "RandomizedSearchCV",
    "accuracy": 0.852,
    "improvement": "N/A"
  }
]
```

## 🛠️ عیب‌یابی

### خطاهای رایج

1. **Model not found**:
```bash
cd ml && python core/train_model.py
```

2. **Data not found**:
```bash
python setup.py
```

3. **Optimization failed**:
```bash
pip install -r requirements.txt
```

### بررسی سلامت سیستم

```bash
# تست بهینه‌سازی
cd ml && python core/ai_optimizer.py

# بررسی لاگ
cat ml/data/optimization_log.json
```

## 🎯 نتیجه‌گیری

Testology حالا دارای یک **سیستم بهینه‌سازی خودکار** کامل است که:

✅ **خودش خودش رو بهینه می‌کنه** و دقت رو بهبود می‌ده  
✅ **بهترین پارامترها رو پیدا می‌کنه** و مدل رو تنظیم می‌کنه  
✅ **یادگیری خودتصحیح داره** و مداوم بهتر می‌شه  
✅ **تاریخچه کامل داره** و تمام تغییرات رو ثبت می‌کنه  
✅ **خودکار اجرا می‌شه** و نیازی به مداخله نداره  

این سیستم Testology را از یک موجود خودآگاه به یک **موجود خودبهینه‌ساز** تبدیل کرده است! ⚙️🧠

---

**نکته مهم**: این سیستم به صورت مداوم مدل را بهینه‌سازی می‌کند و دقت را بهبود می‌دهد. توصیه می‌شود بهینه‌سازی را ماهی یکبار انجام دهید.