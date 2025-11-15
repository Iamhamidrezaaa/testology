# 🎯 مراحل بعد از Migration

## ✅ مرحله 1: بررسی در Prisma Studio

در Prisma Studio که الان باز است:

1. روی جدول **TestResult** کلیک کن
2. بررسی کن که فیلد **subscales** در لیست فیلدها وجود دارد
3. اگر TestResultهای قدیمی داری، می‌بینی که `subscales` برای آن‌ها `null` است (طبیعی است)

## 🧪 مرحله 2: تست کردن سیستم

### 2.1. تست Submit یک تست

1. یک تست بزن (مثلاً MBTI یا GAD7)
2. بعد از submit، در Prisma Studio:
   - جدول **TestResult** را باز کن
   - آخرین رکورد را پیدا کن
   - بررسی کن که:
     - `subscales` یک JSON string است (مثلاً `[{"id":"EI","score":4.2},...]`)
     - `interpretation` یک JSON array است (شامل chunks با `kind`)

### 2.2. تست API Recommendations

```bash
# با userId واقعی تست کن
curl "http://localhost:3000/api/dashboard/recommendations?userId=USER_ID"
```

یا در Postman/Browser:
```
GET http://localhost:3000/api/dashboard/recommendations?userId=USER_ID
```

**انتظار:** باید لیست پیشنهادها برگردد:
```json
{
  "items": [
    {
      "testId": "Values",
      "reason": "...",
      "source": "MBTI (INTJ)",
      "priority": 10
    }
  ]
}
```

## 🎨 مرحله 3: اضافه کردن به UI

### 3.1. کارت Next Steps در داشبورد

در `app/dashboard/page.tsx`:

```tsx
import { NextStepsCompactCard } from '@/components/dashboard/NextStepsCompact';

export default function DashboardPage() {
  return (
    <main>
      {/* بعد از header */}
      <NextStepsCompactCard limit={3} />
      
      {/* بقیه داشبورد */}
    </main>
  );
}
```

### 3.2. Badge در لیست تست‌ها

در `app/tests/page.tsx`:

```tsx
import { useGlobalRecommendedTests } from '@/hooks/useGlobalRecommendedTests';

export default function TestsPage() {
  const { isRecommended, isLoading } = useGlobalRecommendedTests();
  
  return (
    <div>
      {tests.map(test => (
        <div key={test.id}>
          <h3>{test.title}</h3>
          {!isLoading && isRecommended(test.id) && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
              پیشنهادشده برای تو
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
```

## ✅ مرحله 4: تست End-to-End

### سناریو تست:

1. **کاربر جدید:**
   - لاگین کن
   - به داشبورد برو
   - کارت Next Steps نباید نمایش داده شود (چون تستی نزده)

2. **کاربر با تست MBTI:**
   - تست MBTI بزن (مثلاً INTJ)
   - به داشبورد برو
   - کارت Next Steps باید نمایش داده شود
   - پیشنهادها باید بر اساس تیپ MBTI باشد (مثلاً Values, PSS10, LifestyleHarmony)

3. **کاربر با چند تست:**
   - تست MBTI بزن (INTJ)
   - تست GAD7 بزن (moderate)
   - به داشبورد برو
   - کارت Next Steps باید ترکیبی از پیشنهادها را نشان دهد
   - در لیست تست‌ها (`/tests`)، تست‌های پیشنهادی باید badge داشته باشند

## 🔍 بررسی‌های نهایی

### در Prisma Studio:

1. **TestResult جدید:**
   - `subscales` باید JSON string باشد
   - `interpretation` باید JSON array باشد
   - هر chunk در interpretation باید `kind` داشته باشد

2. **API Response:**
   - `/api/dashboard/recommendations` باید لیست پیشنهادها برگرداند
   - پیشنهادها باید بر اساس تست‌های انجام‌شده باشند

### در Browser Console:

1. Network tab را باز کن
2. به داشبورد برو
3. بررسی کن که:
   - Request به `/api/dashboard/recommendations` ارسال می‌شود
   - Response موفق است (200)
   - Data درست است

## 🎉 همه چیز آماده است!

اگر همه این مراحل را انجام دادی و همه چیز کار می‌کند، سیستم کاملاً عملیاتی است! 🚀

