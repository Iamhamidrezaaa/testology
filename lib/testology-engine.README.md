# Testology Engine v1.0 — مستندات استفاده

## 🎯 معرفی

Testology Engine یک موتور مرکزی یکپارچه است که 3 کار اصلی انجام می‌دهد:

1. **Scoring دقیق**: اعمال Reverse، محاسبه زیرمقیاس‌ها، Cutoff، تشخیص سطح
2. **Interpretation هوشمند**: تحلیل انسانی و توصیفی بر اساس تست، زیرمقیاس‌ها و ترکیب نتایج
3. **Recommendation**: پیشنهاد تست‌های تکمیلی بر اساس نقاط ضعف و منطق ارزیابی مشترک

## 📦 ساختار

### فایل‌های اصلی:
- `lib/testology-engine.ts`: موتور مرکزی
- `app/api/tests/testology-engine/route.ts`: API endpoint

## 🚀 نحوه استفاده

### 1. استفاده از API

```typescript
// POST /api/tests/testology-engine
const response = await fetch('/api/tests/testology-engine', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    testSlug: 'creativity',
    answers: {
      1: 3, // questionOrder: selectedOptionIndex (0-4)
      2: 4,
      3: 2,
      // ...
    },
    allTestResults: { // اختیاری - برای تحلیل ترکیبی
      'stress': { totalScore: 28, subscales: { ... } },
      'sleep': { totalScore: 12, subscales: { ... } },
    }
  })
});

const { result } = await response.json();
```

### 2. استفاده مستقیم از موتور

```typescript
import { runTestologyEngineWithConfig } from '@/lib/testology-engine';
import { ScoringConfig } from '@/lib/scoring-engine';

const config: ScoringConfig = {
  type: 'average',
  reverseItems: [6, 7],
  subscales: [
    { name: 'Originality', items: [1, 5, 9] },
    { name: 'Fluency', items: [2, 6, 10] },
  ],
  // ...
};

const questions = [
  { order: 1, dimension: 'Originality', isReverse: false },
  { order: 2, dimension: 'Fluency', isReverse: false },
  // ...
];

const result = runTestologyEngineWithConfig(
  'creativity',
  { 1: 3, 2: 4, ... },
  config,
  questions,
  allTestResults // اختیاری
);
```

## 📊 خروجی موتور

```typescript
interface TestologyEngineResult {
  testId: string;
  testSlug: string;
  scores: {
    [subscale: string]: number;
    total: number;
  };
  level: string; // "Medium", "High", "Low", etc.
  severity: 'mild' | 'moderate' | 'severe' | null;
  interpretation: string; // تفسیر کامل و انسانی
  subscaleInterpretations?: {
    [subscale: string]: string;
  };
  recommendedTests: string[]; // لیست تست‌های تکمیلی
  metadata?: {
    cutoff?: any;
    ruleMatches?: string[]; // Rules تطبیق‌یافته
    [key: string]: any;
  };
}
```

### مثال خروجی:

```json
{
  "testId": "creativity",
  "testSlug": "creativity",
  "scores": {
    "originality": 4.2,
    "fluency": 3.1,
    "flexibility": 2.4,
    "elaboration": 3.8,
    "total": 3.38
  },
  "level": "Medium",
  "severity": null,
  "interpretation": "Your creativity is moderate with strengths in originality and elaboration, but limited flexibility...\n\n🔍 تحلیل ترکیبی:\n1. شما ایده‌های زیادی دارید اما در اجرای آن‌ها مشکل دارید...",
  "subscaleInterpretations": {
    "originality": "Originality بالا: شما می‌توانید...",
    "fluency": "Fluency متوسط: شما در حال توسعه...",
    // ...
  },
  "recommendedTests": [
    "innovation",
    "curiosity",
    "growth-mindset",
    "time-management",
    "focus-attention"
  ],
  "metadata": {
    "cutoff": { "min": 2.5, "max": 3.4, "label": "Medium" },
    "ruleMatches": ["high_creativity_low_implementation"]
  }
}
```

## 🔧 قوانین تفسیر (Interpretation Rules)

موتور از قوانین هوشمند برای تفسیر ترکیبی استفاده می‌کند:

### مثال‌های Rules:

1. **low_energy_and_low_focus**: اگر انرژی و تمرکز هر دو پایین باشند
2. **high_anxiety_low_sleep**: اگر اضطراب بالا و خواب پایین باشد
3. **low_openness_high_conservation**: اگر گشودگی پایین و ثبات بالا باشد
4. **high_creativity_low_implementation**: اگر خلاقیت بالا اما اجرا پایین باشد

### افزودن Rule جدید:

```typescript
// در lib/testology-engine.ts
const INTERPRETATION_RULES: InterpretationRule[] = [
  // ...
  {
    rule: 'your_custom_rule',
    conditions: {
      'Subscale1': '<2.5',
      'Subscale2': '>3.5',
    },
    message: 'پیام تفسیر شما',
    suggestions: ['test1', 'test2'],
    priority: 8,
  },
];
```

## 🎯 قوانین پیشنهاد (Recommendation Rules)

موتور بر اساس شرایط زیرمقیاس‌ها، تست‌های تکمیلی پیشنهاد می‌دهد:

### مثال‌های Rules:

1. **low_openness** → Growth Mindset, Curiosity, Innovation
2. **high_anxiety** → GAD-7, Sleep, MAAS, Lifestyle Harmony
3. **low_sleep_quality** → PSQI, Lifestyle Sleep, Stress

### افزودن Recommendation Rule جدید:

```typescript
// در lib/testology-engine.ts
const RECOMMENDATION_RULES: RecommendationRule[] = [
  // ...
  {
    trigger: 'your_trigger',
    conditions: {
      'Subscale': '<2.5',
    },
    tests: ['test1', 'test2', 'test3'],
    priority: 8,
  },
];
```

## 🔍 تحلیل ترکیبی

موتور می‌تواند نتایج چند تست را با هم ترکیب کند و تحلیل عمیق‌تری ارائه دهد:

```typescript
const allTestResults = {
  'stress': {
    totalScore: 28,
    subscales: { 'Helplessness': 15, 'Self_Efficacy': 13 }
  },
  'sleep': {
    totalScore: 12,
    subscales: { 'Quality': 3.2, 'Duration': 2.8 }
  },
  'creativity': {
    totalScore: 3.5,
    subscales: { 'Originality': 4.2, 'Implementation': 2.1 }
  }
};

// موتور می‌تواند الگوهای ترکیبی را تشخیص دهد:
// - استرس بالا + خواب بد → چرخه منفی
// - خلاقیت بالا + اجرای پایین → نیاز به Time Management
```

## 📝 نکات مهم

1. **فرمت Answers**: باید به صورت `{ questionOrder: selectedOptionIndex }` باشد که `selectedOptionIndex` از 0 شروع می‌شود (0-4 برای 5 گزینه)

2. **Reverse Items**: به صورت خودکار اعمال می‌شود (فرمول: `6 - original_score`)

3. **Priority**: Rules با priority بالاتر اولویت بیشتری دارند

4. **محدودیت پیشنهادات**: حداکثر 7 تست تکمیلی پیشنهاد می‌شود

## 🚧 توسعه آینده

- [ ] افزودن Rules بیشتر برای تفسیرهای ترکیبی
- [ ] یادگیری ماشین برای پیشنهادات شخصی‌سازی‌شده
- [ ] تحلیل روند در طول زمان
- [ ] پیشنهاد تمرین‌ها و فعالیت‌ها (نه فقط تست‌ها)

