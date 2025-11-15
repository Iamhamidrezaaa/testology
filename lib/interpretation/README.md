# 📚 سیستم Interpretation چندلایه Testology

## 🎯 هدف

تبدیل نتایج عددی تست‌ها به گزارش‌های انسانی، دقیق و چندلایه که به کاربر کمک می‌کند وضعیت خود را بهتر درک کند.

## 🏗️ معماری

### سه لایه Interpretation:

1. **لایه 1 - تفسیر تک‌تست**: برای هر تست بر اساس level (minimal, mild, moderate, severe)
2. **لایه 2 - تفسیر زیرمقیاس‌ها**: تحلیل جزئی‌تر هر زیرمقیاس (اختیاری)
3. **لایه 3 - تفسیر ترکیبی**: تحلیل هوشمند ترکیب چند تست

## 📁 ساختار فایل‌ها

```
lib/interpretation/
├── index.ts                    # موتور اصلی
├── cross-rules.ts              # قوانین ترکیبی
├── gad7.ts                     # تفسیر GAD-7
├── phq9.ts                     # تفسیر PHQ-9
├── pss10.ts                    # تفسیر PSS-10
├── lifestyle-sleep-quality.ts  # تفسیر خواب
├── lifestyle-harmony.ts        # تفسیر سبک زندگی
├── work-life-balance.ts        # تفسیر تعادل کار-زندگی
└── README.md                   # این فایل
```

## 🔧 نحوه استفاده

### 1. استفاده مستقیم:

```typescript
import { buildInterpretation } from "@/lib/interpretation";
import { scoreTest } from "@/lib/scoring-engine-v2";

// نمره‌دهی تست‌ها
const gad7Result = scoreTest("GAD7", gad7Answers);
const phq9Result = scoreTest("PHQ9", phq9Answers);
const pss10Result = scoreTest("PSS10", pss10Answers);

// ساخت Interpretation
const interpretation = buildInterpretation([
  gad7Result,
  phq9Result,
  pss10Result,
]);

// استفاده از chunks
interpretation.chunks.forEach((chunk) => {
  console.log(chunk.title);
  console.log(chunk.body);
  if (chunk.priority === "high") {
    // نشان دادن به صورت برجسته
  }
});
```

### 2. استفاده از API:

```typescript
const response = await fetch("/api/interpretation", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    results: [
      gad7Result,
      phq9Result,
      pss10Result,
    ],
  }),
});

const { interpretation } = await response.json();
```

## ➕ افزودن تفسیر برای تست جدید

### مثال: افزودن تفسیر برای تست Creativity

```typescript
// lib/interpretation/creativity.ts
import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const CREATIVITY_INTERPRETATION: TestInterpretationConfig = {
  testId: "Creativity",
  byLevel: {
    low: (r) => ({
      id: "creativity_low",
      title: "خلاقیت",
      body: "پاسخ‌هایت نشان می‌دهد که...",
      testId: "Creativity",
    }),
    medium: (r) => ({
      id: "creativity_medium",
      title: "خلاقیت متوسط",
      body: "الگوی پاسخ‌ها نشان می‌دهد...",
      testId: "Creativity",
    }),
    // ...
  },
};

// سپس در lib/interpretation/index.ts اضافه کن:
import { CREATIVITY_INTERPRETATION } from "./creativity";

const TEST_INTERPRETATIONS = [
  // ...
  CREATIVITY_INTERPRETATION,
];
```

## 🔗 افزودن Rule ترکیبی جدید

### مثال: Rule برای ترکیب Creativity + Innovation

```typescript
// در lib/interpretation/cross-rules.ts
export const CROSS_RULES: CrossTestRule[] = [
  // ...
  {
    id: "creativity_innovation_combo",
    applies: (results) => {
      const creativity = get("Creativity", results);
      const innovation = get("Innovation", results);
      
      if (!creativity || !innovation) return false;
      
      return (
        creativity.totalLevelId === "high" &&
        innovation.totalLevelId === "low"
      );
    },
    build: () => ({
      id: "combo_creativity_innovation",
      title: "ایده‌های زیاد، اجرای کم",
      body: "نتایج نشان می‌دهد که...",
    }),
  },
];
```

## 📝 اصول نوشتن متن‌های Interpretation

1. **گرم و انسانی**: از زبان رباتی و خشک پرهیز کن
2. **دقیق و علمی**: بر اساس نتایج واقعی تست باشد
3. **امیدبخش**: بدون ناامید کردن کاربر
4. **عملی**: پیشنهادهای قابل اجرا بده
5. **مختصر**: هر chunk حداکثر 2-3 پاراگراف

## 🎨 نمایش در UI

```tsx
// مثال استفاده در کامپوننت React
import { buildInterpretation } from "@/lib/interpretation";

function InterpretationDisplay({ results }) {
  const interpretation = buildInterpretation(results);
  
  return (
    <div>
      {interpretation.chunks.map((chunk) => (
        <div
          key={chunk.id}
          className={chunk.priority === "high" ? "alert" : "normal"}
        >
          {chunk.title && <h3>{chunk.title}</h3>}
          <p>{chunk.body}</p>
        </div>
      ))}
    </div>
  );
}
```

## ✅ تست‌های پوشش داده شده

- ✅ GAD-7 (اضطراب)
- ✅ PHQ-9 (افسردگی)
- ✅ PSS-10 (استرس)
- ✅ Lifestyle Sleep Quality (خواب)
- ✅ Lifestyle Harmony (سبک زندگی)
- ✅ Work-Life Balance (تعادل کار-زندگی)

## 🚧 TODO

- [ ] افزودن تفسیر برای بقیه 43 تست
- [ ] افزودن تفسیر زیرمقیاس‌ها (bySubscale)
- [ ] افزودن Ruleهای ترکیبی بیشتر
- [ ] افزودن خلاصه هوشمند (summary)
- [ ] افزودن پیشنهادات عملی (actionable recommendations)

