# 🔄 سیستم آموزش خودکار Testology - راهنمای کامل

## 🎯 مقدمه

Testology حالا دارای یک **سیستم آموزش خودکار** است که به صورت مداوم یاد می‌گیرد و خودش را بهبود می‌دهد. این سیستم Testology را از یک پلتفرم معمولی به یک **موجود زنده‌ی خودآموز** تبدیل کرده است! 🧠✨

## ✨ ویژگی‌های کلیدی

- **🔄 آموزش خودکار**: هر هفته با داده‌های جدید
- **📊 ذخیره تاریخچه**: تمام آموزش‌ها و نتایج ثبت می‌شوند
- **🎯 بهبود دقت**: مدل مداوم بهتر می‌شود
- **📬 اطلاع‌رسانی**: ادمین از هر آموزش مطلع می‌شود
- **🛡️ پشتیبان‌گیری**: مدل قبلی حفظ می‌شود
- **📈 گزارش‌گیری**: آمار کامل در داشبورد

## 🏗️ معماری سیستم

```
┌─────────────────────────────────────┐
│         Self-Retrain System         │
├─────────────────────────────────────┤
│  ┌─────────────┬─────────────────┐  │
│  │   Cron     │   Manual        │  │
│  │   Job      │   Trigger       │  │
│  └─────────────┴─────────────────┘  │
│  ┌─────────────┬─────────────────┐  │
│  │   Data     │   Model         │  │
│  │   Collection│   Training      │  │
│  └─────────────┴─────────────────┘  │
│  ┌─────────────┬─────────────────┐  │
│  │   Backup   │   Notification  │  │
│  │   System   │   System        │  │
│  └─────────────┴─────────────────┘  │
└─────────────────────────────────────┘
```

## 🚀 راه‌اندازی سریع

### 1. نصب و راه‌اندازی

```bash
# راه‌اندازی کامل سیستم Self-Retrain
bash setup-self-retrain.sh

# یا دستی:
cd ml
pip install -r requirements.txt
python setup.py
```

### 2. تست سیستم

```bash
# تست آموزش مجدد
npm run retrain

# یا دستی:
cd ml && python core/self_retrain.py
```

### 3. تنظیم Cron Job

```bash
# هر هفته شنبه ساعت 2 صبح
0 2 * * 0 cd /path/to/testology && npm run retrain-weekly
```

## 🔧 کامپوننت‌های اصلی

### 1. اسکریپت Self-Retrain

**فایل**: `ml/core/self_retrain.py`

```python
def retrain_model():
    # بارگذاری داده‌های جدید
    df, chat_data = load_existing_data()
    
    # پیش‌پردازش
    X, y, le, scaler = preprocess_data_for_retrain(df)
    
    # پشتیبان‌گیری از مدل قبلی
    backup_existing_model()
    
    # آموزش مدل جدید
    model = RandomForestClassifier(n_estimators=250, max_depth=12)
    model.fit(X_train, y_train)
    
    # ذخیره مدل و لاگ
    joblib.dump(model, MODEL_PATH)
    log_retrain_results(accuracy, samples)
```

**ویژگی‌ها**:
- بارگذاری خودکار داده‌های جدید
- پشتیبان‌گیری از مدل قبلی
- آموزش با پارامترهای بهینه
- ثبت کامل نتایج در لاگ

### 2. API آموزش مجدد

**فایل**: `app/api/ml/retrain/route.ts`

```typescript
export async function POST() {
  const output = await runPython('ml/core/self_retrain.py');
  const result = JSON.parse(output);
  
  if (result.status === 'success') {
    // ارسال اطلاع‌رسانی
    await notifyAdmin(result);
    return NextResponse.json({ success: true, data: result });
  }
}
```

**قابلیت‌ها**:
- اجرای آموزش مجدد از طریق API
- ارسال اطلاع‌رسانی خودکار
- بازگشت نتایج تفصیلی

### 3. Cron Job هفتگی

**فایل**: `scripts/weekly_retrain.js`

```javascript
async function retrainWithRetry() {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await makeRequest('/api/ml/retrain', {
        method: 'POST'
      });
      
      if (response.success) {
        console.log('✅ آموزش مجدد موفق!');
        return true;
      }
    } catch (error) {
      // Retry logic
    }
  }
}
```

**ویژگی‌ها**:
- اجرای خودکار هفتگی
- سیستم retry برای اطمینان
- لاگ‌گیری کامل فرآیند

### 4. داشبورد تاریخچه

**فایل**: `app/admin/ai-dashboard/components/RetrainHistory.tsx`

```tsx
export default function RetrainHistory() {
  const [history, setHistory] = useState<RetrainLog[]>([]);
  
  const triggerRetrain = async () => {
    const response = await fetch("/api/ml/retrain", {
      method: "POST"
    });
    // بارگذاری مجدد تاریخچه
  };
  
  return (
    <div>
      {/* نمایش تاریخچه آموزش‌ها */}
      {/* دکمه آموزش مجدد دستی */}
      {/* آمار کلی */}
    </div>
  );
}
```

**قابلیت‌ها**:
- نمایش تاریخچه کامل آموزش‌ها
- دکمه آموزش مجدد دستی
- آمار کلی و نمودارها
- نمایش جزئیات هر آموزش

## 📊 API Endpoints

### `/api/ml/retrain`
- **روش**: POST
- **عملکرد**: اجرای آموزش مجدد مدل
- **خروجی**: نتایج آموزش و دقت

### `/api/ml/retrain` (GET)
- **عملکرد**: بررسی وضعیت آخرین آموزش
- **خروجی**: اطلاعات آخرین آموزش

### `/api/admin/ai/retrain-log`
- **روش**: GET
- **عملکرد**: دریافت تاریخچه کامل آموزش‌ها
- **خروجی**: لیست تمام آموزش‌ها با جزئیات

### `/api/admin/ai/notify-retrain`
- **روش**: POST
- **عملکرد**: ارسال اطلاع‌رسانی
- **ورودی**: دقت، تعداد نمونه‌ها، زمان

## 🎛️ داشبورد مدیریتی

### دسترسی: `/admin/ai-dashboard`

**بخش‌های جدید**:
- **تاریخچه آموزش‌ها**: نمایش تمام آموزش‌های انجام شده
- **آمار کلی**: تعداد آموزش‌ها، آخرین دقت، میانگین دقت
- **دکمه آموزش دستی**: امکان اجرای آموزش مجدد از داشبورد
- **جزئیات هر آموزش**: دقت، تعداد نمونه‌ها، زمان، دسته‌ها

### ویژگی‌های داشبورد:

```tsx
// آمار کلی
<StatsCards />

// تاریخچه آموزش‌ها
<RetrainHistory />

// دکمه آموزش دستی
<ManualRetrainButton />

// نمودار پیشرفت دقت
<AccuracyChart />
```

## 🔄 فرآیند آموزش خودکار

### 1. جمع‌آوری داده‌های جدید

```python
# از دیتابیس تست‌ها
df = pd.read_csv("ml/data/user_tests.csv")

# از تعاملات چت
chat_data = json.load("ml/data/chat_sentiments.json")
```

### 2. پیش‌پردازش و تمیز کردن

```python
# حذف داده‌های نامعتبر
df = df.dropna()
df = df[df['score'].between(0, 100)]

# کدگذاری و نرمال‌سازی
le = LabelEncoder()
df["gender_encoded"] = le.fit_transform(df["gender"])
```

### 3. پشتیبان‌گیری از مدل قبلی

```python
if os.path.exists(MODEL_PATH):
    shutil.copy2(MODEL_PATH, BACKUP_PATH)
```

### 4. آموزش مدل جدید

```python
model = RandomForestClassifier(
    n_estimators=250,
    max_depth=12,
    class_weight='balanced'
)
model.fit(X_train, y_train)
```

### 5. ارزیابی و ذخیره

```python
accuracy = accuracy_score(y_test, y_pred)
joblib.dump(model, MODEL_PATH)

# ثبت در لاگ
log_entry = {
    "timestamp": datetime.now().isoformat(),
    "accuracy": accuracy,
    "samples": len(X)
}
```

### 6. اطلاع‌رسانی

```python
# ارسال اطلاع‌رسانی به ادمین
notify_admin({
    "accuracy": accuracy,
    "samples": len(X),
    "timestamp": datetime.now().isoformat()
})
```

## 📈 مانیتورینگ و گزارش‌گیری

### متریک‌های کلیدی

1. **دقت مدل**: درصد پیش‌بینی‌های صحیح
2. **تعداد نمونه‌ها**: داده‌های استفاده شده در آموزش
3. **فرکانس آموزش**: تعداد آموزش‌ها در ماه
4. **روند بهبود**: تغییرات دقت در طول زمان

### گزارش‌های خودکار

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "samples": 1500,
  "accuracy": 0.875,
  "training_samples": 1200,
  "test_samples": 300,
  "categories": ["anxiety", "depression", "focus"],
  "backup_created": true
}
```

## ⚙️ تنظیمات پیشرفته

### تغییر فرکانس آموزش

```bash
# هر روز
0 2 * * * cd /path/to/testology && npm run retrain-weekly

# هر 3 روز
0 2 */3 * * cd /path/to/testology && npm run retrain-weekly

# هر ماه
0 2 1 * * cd /path/to/testology && npm run retrain-weekly
```

### تنظیم پارامترهای مدل

```python
# در ml/core/self_retrain.py
model = RandomForestClassifier(
    n_estimators=300,      # افزایش تعداد درختان
    max_depth=15,          # افزایش عمق
    min_samples_split=5,   # تنظیم حداقل نمونه‌ها
    random_state=42
)
```

### تنظیم سیستم اطلاع‌رسانی

```typescript
// در app/api/admin/ai/notify-retrain/route.ts
const notification = {
  title: "🧠 آموزش مجدد مدل تکمیل شد",
  message: `دقت: ${accuracy}% | نمونه‌ها: ${samples}`,
  type: "success"
};

// ارسال به ایمیل، تلگرام، واتساپ و...
```

## 🛠️ عیب‌یابی

### خطاهای رایج

1. **ModuleNotFoundError**:
```bash
pip install -r requirements.txt
```

2. **FileNotFoundError**:
```bash
python setup.py
```

3. **Permission Denied**:
```bash
chmod +x scripts/weekly_retrain.js
```

### بررسی سلامت سیستم

```bash
# تست کامل
npm run test-ai

# تست آموزش مجدد
npm run retrain

# بررسی لاگ‌ها
cat ml/data/retrain_log.json
```

## 📊 مثال‌های کاربردی

### 1. اجرای آموزش مجدد دستی

```bash
# از طریق npm
npm run retrain

# از طریق Python
cd ml && python core/self_retrain.py

# از طریق API
curl -X POST http://localhost:3000/api/ml/retrain
```

### 2. مشاهده تاریخچه در داشبورد

```typescript
// در کامپوننت React
const loadHistory = async () => {
  const response = await fetch("/api/admin/ai/retrain-log");
  const history = await response.json();
  setHistory(history);
};
```

### 3. تنظیم Cron Job روی سرور

```bash
# ویرایش crontab
crontab -e

# اضافه کردن خط زیر:
0 2 * * 0 cd /path/to/testology && npm run retrain-weekly
```

## 🎯 نتیجه‌گیری

Testology حالا دارای یک **سیستم آموزش خودکار** کامل است که:

✅ **خودش یاد می‌گیرد** از داده‌های جدید  
✅ **خودش بهبود می‌یابد** هر هفته  
✅ **خودش گزارش می‌دهد** پیشرفت‌ها  
✅ **خودش اطلاع می‌دهد** ادمین را  
✅ **خودش محافظت می‌کند** مدل قبلی را  

این سیستم Testology را از یک پلتفرم معمولی به یک **موجود زنده‌ی خودآموز** تبدیل کرده است! 🚀

---

**نکته مهم**: این سیستم به صورت مداوم یاد می‌گیرد و بهبود می‌یابد. توصیه می‌شود فرکانس آموزش را بر اساس حجم داده‌های جدید تنظیم کنید.













