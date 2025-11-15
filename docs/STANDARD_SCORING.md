# سیستم نمره‌دهی استاندارد تست‌ها

این سیستم برای استاندارد کردن نمره‌دهی تست‌های روان‌سنجی طراحی شده است.

## ساختار

### 1. Schema Changes

#### Test Model
- `scoringConfig` (String?): JSON string شامل کلید نمره‌دهی، reverse items، subscales و cutoffs

#### Question Model
- `dimension` (String?): برای تست‌های چندبعدی مثل MBTI: "E/I", "S/N", "T/F", "J/P"
- `isReverse` (Boolean): آیا این سوال reverse-scored است؟

### 2. Scoring Engine

فایل `lib/scoring-engine.ts` شامل:
- `ScoringConfig`: Interface برای config تست
- `calculateTestScore()`: تابع اصلی برای محاسبه نمره
- توابع محاسبه برای انواع مختلف تست‌ها

### 3. Test Configs

هر تست یک فایل config در `lib/test-configs/` دارد که شامل:
- نوع scoring (mbti, likert, sum, average, custom)
- dimensions (برای تست‌های چندبعدی)
- reverse items
- subscales
- cutoffs

## استفاده

### برای MBTI

```typescript
import { getMBTIConfigJSON } from '@/lib/test-configs/mbti-config';

// ذخیره config در دیتابیس
await prisma.test.update({
  where: { testSlug: 'mbti' },
  data: {
    scoringConfig: getMBTIConfigJSON(),
  },
});

// تنظیم dimension برای هر سوال
await prisma.question.updateMany({
  where: { testId: test.id, order: { in: [1, 2, 3] } },
  data: { dimension: 'E/I' },
});
```

### محاسبه نمره

```typescript
// از طریق API
const response = await fetch('/api/tests/calculate-score', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    testSlug: 'mbti',
    answers: {
      1: 3, // سوال 1، گزینه 3 (موافقم)
      2: 1, // سوال 2، گزینه 1 (مخالفم)
      // ...
    },
  }),
});

const { result } = await response.json();
// result.type = "ENFP"
// result.dimensions = { "E/I": 5, "S/N": -3, ... }
```

## ساختار ScoringConfig

```typescript
interface ScoringConfig {
  type: 'mbti' | 'likert' | 'sum' | 'average' | 'custom';
  dimensions?: string[]; // ["E/I", "S/N", "T/F", "J/P"]
  reverseItems?: number[]; // [2, 5, 8] - شماره سوالات reverse
  subscales?: {
    name: string;
    items: number[];
  }[];
  cutoffs?: {
    [key: string]: {
      min: number;
      max: number;
      label: string;
      severity?: 'mild' | 'moderate' | 'severe';
    }[];
  };
  weighting?: {
    [key: string]: number;
  };
}
```

## مثال: MBTI

```json
{
  "type": "mbti",
  "dimensions": ["E/I", "S/N", "T/F", "J/P"],
  "weighting": {
    "strongly_disagree": -2,
    "disagree": -1,
    "neutral": 0,
    "agree": +1,
    "strongly_agree": +2
  }
}
```

## مثال: تست Likert با Reverse Items

```json
{
  "type": "likert",
  "reverseItems": [2, 5, 8, 12],
  "cutoffs": {
    "total": [
      { "min": 0, "max": 10, "label": "پایین", "severity": "mild" },
      { "min": 11, "max": 20, "label": "متوسط", "severity": "moderate" },
      { "min": 21, "max": 30, "label": "بالا", "severity": "severe" }
    ]
  }
}
```

## مراحل بعدی

برای هر تست (1 تا 49):
1. ایجاد config file در `lib/test-configs/`
2. تنظیم `scoringConfig` در دیتابیس
3. تنظیم `dimension` و `isReverse` برای هر سوال
4. تست و اعتبارسنجی

