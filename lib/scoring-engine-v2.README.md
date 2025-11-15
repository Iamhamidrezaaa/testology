# Scoring Engine v2.0 — مستندات کامل

## 🎯 معرفی

Scoring Engine v2.0 موتور مرکزی نمره‌دهی Testology است که برای تمام 49 تست یک ساختار یکپارچه و قابل نگهداری فراهم می‌کند.

## 📁 ساختار فایل‌ها

```
types/
  └── test-scoring.ts          # Types مرکزی

config/tests/
  ├── index.ts                 # Export تمام configها
  ├── gad7.ts                  # Config GAD-7
  ├── phq9.ts                  # Config PHQ-9
  ├── creativity.ts             # Config Creativity
  └── ...                      # بقیه 46 تست

lib/
  └── scoring-engine-v2.ts     # موتور اصلی

app/api/score/
  └── [testId]/
      └── route.ts              # API endpoint
```

## 🚀 نحوه استفاده

### از طریق API:

```typescript
// POST /api/score/[testId]
const response = await fetch('/api/score/GAD7', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    answers: [
      { questionId: 1, value: 2 },
      { questionId: 2, value: 1 },
      { questionId: 3, value: 3 },
      // ...
    ],
    userId: 'user123' // اختیاری
  })
});

const { result } = await response.json();
// result.totalScore
// result.totalLevelLabel
// result.subscales
// result.recommendedTests
```

### استفاده مستقیم:

```typescript
import { scoreTest } from '@/lib/scoring-engine-v2';

const result = scoreTest('GAD7', [
  { questionId: 1, value: 2 },
  { questionId: 2, value: 1 },
  // ...
]);
```

## 📊 خروجی

```typescript
interface ScoredResult {
  testId: string;              // "GAD7"
  title: string;                // "تست اضطراب GAD-7"
  totalScore: number;           // 12.5
  totalLevelId: string | null;  // "moderate"
  totalLevelLabel: string | null; // "اضطراب متوسط"
  interpretation: string | null; // "سطح اضطراب در حدی است که..."
  subscales: SubscaleScore[];   // [{ id: "anxiety", label: "...", score: 12.5 }]
  rawAnswers: AnswerInput[];    // پاسخ‌های خام
  recommendedTests: string[];   // ["PSS10", "LifestyleSleepQuality"]
  recommendationMessages: string[]; // پیام‌های توصیه
}
```

## ➕ افزودن تست جدید

### مرحله 1: ایجاد فایل Config

```typescript
// config/tests/pss10.ts
import { TestConfig } from "@/types/test-scoring";

export const PSS10_CONFIG: TestConfig = {
  id: "PSS10",
  title: "تست استرس PSS-10",
  scoringType: "sum",
  scaleMin: 0,
  scaleMax: 4,
  reverseItems: [4, 5, 7, 8],
  subscales: [
    {
      id: "helplessness",
      label: "احساس درماندگی",
      items: [1, 2, 3, 6, 9, 10],
    },
    {
      id: "self_efficacy",
      label: "احساس توانمندی",
      items: [4, 5, 7, 8],
    },
  ],
  totalRange: { min: 0, max: 40 },
  cutoffs: [
    { id: "low", label: "پایین", min: 0, max: 13 },
    { id: "moderate", label: "متوسط", min: 14, max: 26 },
    { id: "high", label: "بالا", min: 27, max: 40 },
  ],
  interpretationByLevel: {
    low: "سطح استرس شما در حد معمول است...",
    moderate: "استرس قابل توجهی دارید...",
    high: "استرس شما در سطح بالایی است...",
  },
  recommendations: [
    {
      id: "pss10_moderate_plus",
      conditions: [
        { target: "total", comparator: "gte", value: 14 },
      ],
      recommendTests: ["GAD7", "LifestyleSleepQuality", "WorkLifeBalance"],
    },
  ],
};
```

### مرحله 2: اضافه کردن به index

```typescript
// config/tests/index.ts
import { PSS10_CONFIG } from './pss10';

export const TEST_CONFIGS = {
  // ...
  PSS10: PSS10_CONFIG,
};
```

### مرحله 3: تست کردن

```typescript
const result = scoreTest('PSS10', [
  { questionId: 1, value: 3 },
  { questionId: 2, value: 2 },
  // ...
]);
```

## 🔧 منطق نمره‌دهی

### 1. Reverse Scoring

```typescript
// فرمول: min + max - value
// برای 0-3: 0 + 3 - value = 3 - value
// برای 1-5: 1 + 5 - value = 6 - value
```

### 2. Subscale Scoring

- **Sum-based**: جمع تمام آیتم‌های زیرمقیاس
- **Mean-based**: میانگین تمام آیتم‌های زیرمقیاس

### 3. Total Score

- **Sum-based**: جمع تمام آیتم‌های تست
- **Mean-based**: میانگین تمام زیرمقیاس‌ها

### 4. Level Detection

بر اساس Cutoff Bands:
```typescript
if (totalScore >= band.min && totalScore <= band.max) {
  return band.id; // "mild", "moderate", etc.
}
```

### 5. Recommendations

بر اساس Rules:
```typescript
if (totalScore >= 5) {
  recommendTests.push("PSS10", "Sleep");
}
```

## 📝 نکات مهم

1. **questionId**: باید از 1 شروع شود (1-indexed)
2. **value**: مقدار خام از UI (0-3 یا 1-5)
3. **reverseItems**: لیست questionIdهای reverse
4. **subscales.items**: لیست questionIdهای هر زیرمقیاس
5. **cutoffs**: باید کامل و بدون gap باشند

## 🎨 مثال کامل

### تست Sum-based (GAD-7):

```typescript
{
  id: "GAD7",
  scoringType: "sum",
  scaleMin: 0,
  scaleMax: 3,
  reverseItems: [],
  subscales: [{ id: "anxiety", items: [1,2,3,4,5,6,7] }],
  cutoffs: [
    { id: "minimal", min: 0, max: 4 },
    { id: "mild", min: 5, max: 9 },
    // ...
  ]
}
```

### تست Mean-based (Creativity):

```typescript
{
  id: "Creativity",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [6, 7],
  subscales: [
    { id: "originality", items: [1, 5, 9] },
    { id: "fluency", items: [2, 6, 10] },
    // ...
  ],
  cutoffs: [
    { id: "low", min: 1.0, max: 2.4 },
    { id: "medium", min: 2.5, max: 3.4 },
    // ...
  ]
}
```

## 🔗 اتصال به UI

UI فعلی شما هیچ تغییری نیاز ندارد. فقط:

```typescript
// قبل (محاسبه لوکال):
const score = calculateLocal(answers);

// بعد (API call):
const res = await fetch(`/api/score/${testId}`, {
  method: 'POST',
  body: JSON.stringify({ answers, userId })
});
const { result } = await res.json();

// استفاده از result:
// result.totalScore
// result.totalLevelLabel
// result.interpretation
// result.recommendedTests
```

## ✅ مزایای این ساختار

1. **یکپارچه**: همه تست‌ها از یک ساختار استفاده می‌کنند
2. **قابل نگهداری**: تغییرات در یک جا اعمال می‌شود
3. **قابل توسعه**: افزودن تست جدید ساده است
4. **Type-safe**: تمام Types تعریف شده‌اند
5. **بدون تغییر UI**: UI فعلی بدون تغییر کار می‌کند

