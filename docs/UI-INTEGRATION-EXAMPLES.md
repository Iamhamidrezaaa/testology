# مثال‌های یکپارچه‌سازی UI: Next Steps و Badge

این فایل شامل مثال‌های کامل برای یکپارچه‌سازی کارت Next Steps و badge پیشنهادی در صفحات واقعی است.

## 📋 1. اضافه کردن کارت به داشبورد

### در `app/dashboard/page.tsx`:

```tsx
"use client";

import { NextStepsCompactCard } from '@/components/dashboard/NextStepsCompact';
// ... سایر imports

export default function DashboardPage() {
  // ... کدهای موجود

  return (
    <ErrorBoundary>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        {/* ... کدهای موجود */}
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 p-6">
        {/* کارت قدم‌های بعدی - اضافه کن اینجا */}
        <NextStepsCompactCard limit={3} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* ... کدهای موجود */}
        </div>

        {/* بقیه داشبورد */}
      </main>
    </ErrorBoundary>
  );
}
```

## 📋 2. اضافه کردن Badge به لیست تست‌ها

### در `app/tests/page.tsx`:

```tsx
"use client";

import { useGlobalRecommendedTests } from '@/hooks/useGlobalRecommendedTests';
// ... سایر imports

export default function TestsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [mounted, setMounted] = useState(false);
  
  // اضافه کردن هوک برای دریافت تست‌های پیشنهادی
  const { isRecommended, isLoading } = useGlobalRecommendedTests();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const filteredTests =
    activeCategory === "all"
      ? testList
      : testList.filter((test) => test.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-10">
      {/* ... کدهای موجود */}

      {/* کارت تست‌ها */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filteredTests.map((test, index) => {
          const recommended = !isLoading && isRecommended(test.id);

          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm hover:shadow-xl border transition-all duration-300 ${
                recommended
                  ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10"
                  : "border-gray-100 dark:border-gray-800"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                {test.icon}
                <div className="flex items-center gap-2">
                  {recommended && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                      پیشنهادشده
                    </span>
                  )}
                  <span className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" /> {test.score}%
                  </span>
                </div>
              </div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                {test.title}
              </h2>
              {/* ... بقیه کد */}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
```

## 🎨 استایل‌های Badge

### استایل ساده (پیشنهادی):
```tsx
{recommended && (
  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
    پیشنهادشده برای تو
  </span>
)}
```

### استایل با آیکون:
```tsx
{recommended && (
  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
    <span>✨</span>
    پیشنهادشده
  </span>
)}
```

### استایل با border:
```tsx
{recommended && (
  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
    پیشنهادشده
  </span>
)}
```

## 🔧 نکات مهم

1. **userId**: کامپوننت‌ها به صورت خودکار از `localStorage.getItem("testology_userId")` استفاده می‌کنند
2. **Loading States**: هر دو کامپوننت loading state دارند
3. **Error Handling**: اگر API fail شود، gracefully handle می‌شود
4. **Performance**: فقط یک بار API صدا زده می‌شود

همه چیز آماده است! 🎉

