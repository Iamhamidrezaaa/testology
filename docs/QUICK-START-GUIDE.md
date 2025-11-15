# 🚀 راهنمای سریع: یکپارچه‌سازی Next Steps و Badge

این راهنما برای اضافه کردن سریع کارت Next Steps و Badge به UI است.

## ✅ چک‌لیست سریع

### 1. فایل‌های آماده ✅
- [x] `lib/interpretation/recommendations.ts` - قوانین پیشنهاد
- [x] `lib/recommendation/global.ts` - موتور پیشنهاد
- [x] `components/dashboard/NextStepsCompact.tsx` - کارت UI
- [x] `hooks/useGlobalRecommendedTests.ts` - هوک Badge
- [x] `app/api/dashboard/recommendations/route.ts` - API

### 2. Migration لازم ⚠️

```bash
npx prisma migrate dev --name add_subscales_to_testresult
```

### 3. اضافه کردن به UI

#### در `app/dashboard/page.tsx`:

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

#### در `app/tests/page.tsx`:

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

## 🎯 تست سریع

1. Migration را اجرا کن
2. یک تست بزن (مثلاً MBTI)
3. به داشبورد برو → کارت Next Steps باید نمایش داده شود
4. به لیست تست‌ها برو → تست‌های پیشنهادی باید badge داشته باشند

همه چیز آماده است! 🎉

