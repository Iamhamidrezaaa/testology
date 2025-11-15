# راهنمای یکپارچه‌سازی UI: کارت Next Steps و Badge پیشنهادی

این راهنما نحوه اضافه کردن کارت "قدم‌های بعدی پیشنهادی" و badge "پیشنهادشده برای تو" را توضیح می‌دهد.

## 📋 کامپوننت‌ها و هوک‌های آماده

### 1. `NextStepsCompactCard` - کارت فشرده

**مسیر:** `components/dashboard/NextStepsCompact.tsx`

**استفاده:**
```tsx
import { NextStepsCompactCard } from '@/components/dashboard/NextStepsCompact';

export default function DashboardPage() {
  return (
    <div>
      <NextStepsCompactCard userId="user123" limit={3} />
      {/* بقیه داشبورد */}
    </div>
  );
}
```

**ویژگی‌ها:**
- نمایش 3 پیشنهاد اول (قابل تنظیم با `limit`)
- Loading state
- Dark mode support
- Responsive
- لینک به تست‌های پیشنهادی

### 2. `useGlobalRecommendedTests` - هوک برای Badge

**مسیر:** `hooks/useGlobalRecommendedTests.ts`

**استفاده:**
```tsx
import { useGlobalRecommendedTests } from '@/hooks/useGlobalRecommendedTests';

export default function TestsListPage() {
  const { isRecommended, isLoading } = useGlobalRecommendedTests(userId);

  return (
    <div>
      {tests.map(test => (
        <div key={test.id}>
          <h3>{test.title}</h3>
          {isRecommended(test.id) && (
            <span className="badge">پیشنهادشده برای تو</span>
          )}
        </div>
      ))}
    </div>
  );
}
```

**ویژگی‌ها:**
- برگرداندن `Set<string>` از testIdهای پیشنهادی
- Helper function `isRecommended(testId)` برای چک کردن
- Loading state با `isLoading`

## 🎨 مثال کامل: صفحه لیست تست‌ها

```tsx
'use client';

import { useGlobalRecommendedTests } from '@/hooks/useGlobalRecommendedTests';
import Link from 'next/link';

interface TestMeta {
  id: string;
  title: string;
  category?: string;
  description?: string;
}

const tests: TestMeta[] = [
  { id: "MBTI", title: "تست شخصیت‌شناسی MBTI", category: "شخصیت‌شناسی" },
  { id: "NEO_FFI", title: "تست شخصیت NEO-FFI", category: "شخصیت‌شناسی" },
  { id: "GAD7", title: "تست اضطراب GAD-7", category: "سلامت روان" },
  { id: "PHQ9", title: "تست افسردگی PHQ-9", category: "سلامت روان" },
  { id: "PSS10", title: "تست استرس PSS-10", category: "سلامت روان" },
  { id: "RIASEC", title: "تست شغلی RIASEC", category: "شغلی" },
  { id: "Attachment", title: "تست سبک دلبستگی", category: "روابط" },
  { id: "LearningStyle", title: "تست سبک یادگیری", category: "یادگیری" },
  // ... بقیه تست‌ها
];

export default function TestsIndexPage() {
  // دریافت userId از session یا props
  const userId = "user123"; // یا از session بگیر
  
  const { isRecommended, isLoading } = useGlobalRecommendedTests(userId);

  return (
    <div className="px-4 py-4">
      <h1 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">
        همه تست‌ها
      </h1>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {tests.map((test) => {
          const recommended = !isLoading && isRecommended(test.id);

          return (
            <div
              key={test.id}
              className={`flex flex-col justify-between rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md ${
                recommended
                  ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/20"
                  : "border-slate-200 bg-white/70 dark:border-slate-700 dark:bg-gray-800/70"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex-1">
                    {test.title}
                  </h2>
                  {recommended && (
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                      پیشنهادشده برای تو
                    </span>
                  )}
                </div>

                {test.category && (
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {test.category}
                  </p>
                )}

                {test.description && (
                  <p className="mt-2 text-[12px] leading-relaxed text-slate-700 dark:text-slate-300 line-clamp-2">
                    {test.description}
                  </p>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <Link
                  href={`/tests/${test.id.toLowerCase()}`}
                  className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-gray-700 transition-colors"
                >
                  شروع تست
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

## 🎨 مثال کامل: صفحه داشبورد/هوم

```tsx
'use client';

import { NextStepsCompactCard } from '@/components/dashboard/NextStepsCompact';

export default function DashboardPage() {
  // دریافت userId از session
  const userId = "user123"; // یا از session بگیر

  return (
    <div className="dashboard-page px-4 py-4">
      {/* هدر، سلام کاربر */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          سلام! 👋
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          خوش اومدی به داشبورد Testology
        </p>
      </div>

      {/* کارت قدم‌های بعدی */}
      <NextStepsCompactCard userId={userId} limit={3} />

      {/* بقیه‌ی داشبورد */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* نمودارها، آخرین نتایج، آمار و ... */}
      </div>
    </div>
  );
}
```

## 🎯 استایل Badge

برای badge "پیشنهادشده برای تو" می‌توانی از این استایل‌ها استفاده کنی:

### استایل ساده (مینیمال):
```tsx
<span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
  پیشنهادشده برای تو
</span>
```

### استایل با آیکون:
```tsx
<span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
  <span>✨</span>
  پیشنهادشده برای تو
</span>
```

### استایل با border:
```tsx
<span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
  پیشنهادشده برای تو
</span>
```

## 📱 Responsive Design

هر دو کامپوننت responsive هستند:
- Mobile: کارت و badge به صورت عمودی نمایش داده می‌شوند
- Tablet: Grid 2 ستونی
- Desktop: Grid 3 ستونی

## 🔄 Real-time Updates

هر دو کامپوننت:
- در mount شدن API را صدا می‌زنند
- اگر کاربر تست جدید بزند، بعد از refresh صفحه پیشنهادها آپدیت می‌شوند
- می‌توانی در آینده polling یا WebSocket اضافه کنی

## ✅ نکات مهم

1. **userId**: اگر از session استفاده می‌کنی، userId را از session بگیر
2. **Loading States**: هر دو کامپوننت loading state دارند
3. **Error Handling**: اگر API fail شود، gracefully handle می‌شود
4. **Performance**: فقط یک بار API صدا زده می‌شود (در useEffect)
5. **Dark Mode**: هر دو کامپوننت dark mode support دارند

## 🚀 مراحل یکپارچه‌سازی

1. **اضافه کردن کارت به داشبورد:**
   ```tsx
   import { NextStepsCompactCard } from '@/components/dashboard/NextStepsCompact';
   <NextStepsCompactCard userId={userId} />
   ```

2. **اضافه کردن badge به لیست تست‌ها:**
   ```tsx
   import { useGlobalRecommendedTests } from '@/hooks/useGlobalRecommendedTests';
   const { isRecommended } = useGlobalRecommendedTests(userId);
   {isRecommended(test.id) && <Badge />}
   ```

3. **تست کردن:**
   - یک تست بزن (مثلاً MBTI)
   - بررسی کن که کارت در داشبورد نمایش داده می‌شود
   - بررسی کن که badge در لیست تست‌ها نمایش داده می‌شود

همه چیز آماده است! 🎉

