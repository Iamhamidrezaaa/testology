# ✅ چک‌لیست عملیاتی: سیستم پیشنهاد تست‌های تکمیلی

این چک‌لیست برای اطمینان از اینکه همه چیز درست کار می‌کند طراحی شده است.

## 📋 مرحله A – بررسی فایل‌ها و اتصالات

### ✅ فایل‌های جدید (باید وجود داشته باشند)

- [x] `lib/interpretation/recommendations.ts` - قوانین پیشنهاد تست‌های تکمیلی
- [x] `lib/recommendation/global.ts` - موتور پیشنهاد در سطح پروفایل کلی
- [x] `components/dashboard/NextStepsCompact.tsx` - کارت فشرده Next Steps
- [x] `hooks/useGlobalRecommendedTests.ts` - هوک برای Badge
- [x] `app/api/dashboard/recommendations/route.ts` - API endpoint

### ✅ آپدیت‌های فایل‌های موجود

#### 1. `types/interpretation.ts`
- [x] `InterpretationChunk` با `kind?: "analysis" | "recommendation"` آپدیت شده

#### 2. `lib/interpretation/handlers.ts`
- [x] تابع `chunk()` با پارامتر `kind` آپدیت شده
- [x] `handleMBTI` با `MBTI_RECOMMENDATIONS` یکپارچه شده
- [x] `handleRIASEC` با `RIASEC_RECOMMENDATIONS` یکپارچه شده
- [x] `handleAttachment` با `ATTACHMENT_RECOMMENDATIONS` یکپارچه شده
- [x] `handleLearningStyleTyped` با `LEARNING_STYLE_RECOMMENDATIONS` یکپارچه شده
- [x] `TEST_INTERPRETATION_HANDLERS` شامل این تست‌هاست:
  - [x] `MBTI: handleMBTI`
  - [x] `RIASEC: handleRIASEC`
  - [x] `Attachment: handleAttachment`
  - [x] `LearningStyle: handleLearningStyleTyped`

#### 3. `app/api/tests/[testId]/submit/route.ts`
- [x] `subscales` در TestResult ذخیره می‌شود
- [x] `interpretation` (شامل chunks با kind) ذخیره می‌شود

#### 4. `prisma/schema.prisma`
- [x] فیلد `subscales String?` به `TestResult` اضافه شده

## 📋 مرحله B – یکپارچه‌سازی UI

### ✅ صفحه داشبورد (`app/dashboard/page.tsx`)

```tsx
import { NextStepsCompactCard } from '@/components/dashboard/NextStepsCompact';

// در JSX:
<NextStepsCompactCard limit={3} />
```

**وضعیت:** باید اضافه شود

### ✅ صفحه لیست تست‌ها (`app/tests/page.tsx`)

```tsx
import { useGlobalRecommendedTests } from '@/hooks/useGlobalRecommendedTests';

const { isRecommended, isLoading } = useGlobalRecommendedTests();

// در map تست‌ها:
{!isLoading && isRecommended(test.id) && (
  <span className="badge">پیشنهادشده برای تو</span>
)}
```

**وضعیت:** باید اضافه شود

## 📋 مرحله C – تست‌های لوکال

### دستورات تست:

```bash
# 1. بررسی Lint
npm run lint

# 2. بررسی Type Check
npm run typecheck

# 3. Build
npm run build
```

### بررسی‌های دستی:

1. **تست API:**
   ```bash
   # با userId واقعی تست کن
   curl "http://localhost:3000/api/dashboard/recommendations?userId=USER_ID"
   ```

2. **تست Submit Test:**
   - یک تست بزن (مثلاً MBTI)
   - بررسی کن که `subscales` در DB ذخیره می‌شود
   - بررسی کن که `interpretation` شامل chunks با `kind` است

3. **تست UI:**
   - کارت Next Steps در داشبورد نمایش داده می‌شود
   - Badge در لیست تست‌ها نمایش داده می‌شود

## 📋 مرحله D – Migration

### اجرای Migration:

```bash
npx prisma migrate dev --name add_subscales_to_testresult
```

### بررسی Migration:

```bash
npx prisma studio
# بررسی کن که فیلد subscales در TestResult وجود دارد
```

## 📋 مرحله E – تست End-to-End

### سناریو تست:

1. **کاربر جدید:**
   - لاگین کن
   - به داشبورد برو
   - کارت Next Steps نباید نمایش داده شود (چون تستی نزده)

2. **کاربر با تست MBTI:**
   - تست MBTI بزن
   - به داشبورد برو
   - کارت Next Steps باید نمایش داده شود
   - پیشنهادها باید بر اساس تیپ MBTI باشد

3. **کاربر با چند تست:**
   - تست MBTI بزن (مثلاً INTJ)
   - تست GAD7 بزن (مثلاً moderate)
   - به داشبورد برو
   - کارت Next Steps باید ترکیبی از پیشنهادها را نشان دهد
   - در لیست تست‌ها، تست‌های پیشنهادی باید badge داشته باشند

## 🔧 مشکلات احتمالی و راه‌حل

### مشکل 1: API 404
**راه‌حل:** بررسی کن که فایل `app/api/dashboard/recommendations/route.ts` وجود دارد

### مشکل 2: subscales null در DB
**راه‌حل:** 
- بررسی کن که migration اجرا شده
- بررسی کن که در submit route، subscales ذخیره می‌شود

### مشکل 3: پیشنهادها نمایش داده نمی‌شوند
**راه‌حل:**
- بررسی کن که userId در localStorage وجود دارد
- بررسی کن که API response درست است
- Console را چک کن برای errors

### مشکل 4: Type errors
**راه‌حل:**
- `npm run typecheck` را اجرا کن
- بررسی کن که همه imports درست هستند

## ✅ چک‌لیست نهایی

قبل از deploy:

- [ ] همه فایل‌ها اضافه شده‌اند
- [ ] همه آپدیت‌ها انجام شده‌اند
- [ ] Migration اجرا شده
- [ ] `npm run lint` بدون error
- [ ] `npm run typecheck` بدون error
- [ ] `npm run build` موفق است
- [ ] API endpoint کار می‌کند
- [ ] کارت Next Steps در داشبورد نمایش داده می‌شود
- [ ] Badge در لیست تست‌ها نمایش داده می‌شود
- [ ] پیشنهادها بر اساس تست‌های انجام‌شده درست هستند

## 🎉 آماده است!

اگر همه چک‌ها ✅ هستند، سیستم آماده استفاده است!

