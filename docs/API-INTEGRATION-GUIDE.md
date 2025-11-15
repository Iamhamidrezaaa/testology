# راهنمای اتصال فرانت به API جدید Testology

این راهنما نحوه استفاده از API جدید برای submit کردن تست‌ها و دریافت نتایج را توضیح می‌دهد.

## 📋 فهرست

1. [API Endpoints](#api-endpoints)
2. [Helper Functions](#helper-functions)
3. [مثال‌های استفاده](#مثال‌های-استفاده)
4. [به‌روزرسانی کامپوننت‌های موجود](#به‌روزرسانی-کامپوننت‌های-موجود)

---

## API Endpoints

### 1. Submit Test (ارسال تست)

**Endpoint:** `POST /api/tests/[testId]/submit`

**Request Body:**
```typescript
{
  answers: Array<{
    questionId: number;
    value: number;
  }>;
  userId?: string | null;
}
```

**Response:**
```typescript
{
  success: boolean;
  result: {
    testId: string;
    title: string;
    totalScore: number;
    totalLevelId: string | null;
    totalLevelLabel: string | null;
    interpretation: InterpretationChunk[];
    interpretationSummary?: string;
    subscales: Array<{
      id: string;
      label: string;
      score: number;
    }>;
    recommendedTests: string[];
    recommendationMessages: string[];
  };
  saved: boolean;
}
```

### 2. Get User Test Results (دریافت نتایج کاربر)

**Endpoint:** `GET /api/user/tests?userId=xxx`

**Response:**
```typescript
{
  success: boolean;
  results: Array<{
    id: string;
    userId: string | null;
    testId: string;
    testName: string | null;
    testSlug: string | null;
    score: number | null;
    result: string | null;
    severity: string | null;
    interpretation: any[] | null;
    subscales: any[] | null;
    createdAt: string;
    updatedAt: string;
  }>;
  count: number;
}
```

---

## Helper Functions

از فایل `lib/api-tests.ts` استفاده کن:

```typescript
import { submitTestAnswers, getUserTestResults } from '@/lib/api-tests';

// Submit کردن تست
const result = await submitTestAnswers(
  'GAD7', // testId
  [
    { questionId: 1, value: 2 },
    { questionId: 2, value: 3 },
    // ...
  ],
  userId // اختیاری
);

// دریافت نتایج کاربر
const userResults = await getUserTestResults(userId);
```

---

## مثال‌های استفاده

### مثال 1: Submit کردن تست در یک کامپوننت React

```typescript
'use client';

import { useState } from 'react';
import { submitTestAnswers } from '@/lib/api-tests';

export default function MyTestComponent() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (answers: Array<{questionId: number, value: number}>) => {
    try {
      setLoading(true);
      setError(null);

      // گرفتن userId (از session یا localStorage)
      const userId = localStorage.getItem('testology_userId') || null;

      const data = await submitTestAnswers('GAD7', answers, userId);

      setResult(data.result);
    } catch (e: any) {
      setError(e.message || 'خطا در ارسال تست');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* UI تست */}
      {loading && <p>در حال پردازش...</p>}
      {error && <p className="error">{error}</p>}
      {result && (
        <div>
          <h2>نتیجه: {result.title}</h2>
          <p>نمره: {result.totalScore.toFixed(2)}</p>
          <p>سطح: {result.totalLevelLabel}</p>
          
          {/* نمایش تفسیر */}
          {result.interpretation && result.interpretation.map((chunk: any) => (
            <div key={chunk.id}>
              {chunk.title && <h3>{chunk.title}</h3>}
              <p>{chunk.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### مثال 2: نمایش نتایج در داشبورد

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getUserTestResults } from '@/lib/api-tests';

export default function TestResultsDashboard() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const userId = localStorage.getItem('testology_userId') || 'demo-user';
        const data = await getUserTestResults(userId);
        
        if (data.success) {
          setResults(data.results);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <p>در حال بارگذاری...</p>;

  return (
    <div>
      <h1>نتایج تست‌های شما</h1>
      {results.map((result) => (
        <div key={result.id}>
          <h2>{result.testName}</h2>
          <p>نمره: {result.score}</p>
          <p>تاریخ: {new Date(result.createdAt).toLocaleDateString('fa-IR')}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## به‌روزرسانی کامپوننت‌های موجود

### TestRunner Component

کامپوننت `TestRunner` قبلاً به‌روزرسانی شده و از API جدید استفاده می‌کند.

### صفحه tests/[id]/start

برای به‌روزرسانی این صفحه، تابع `saveResults` را تغییر بده:

```typescript
// قبل:
const saveResponse = await fetch('/api/tests/save-result', {
  method: 'POST',
  body: JSON.stringify({ testId, testName, answers, score, analysis }),
});

// بعد:
import { submitTestAnswers } from '@/lib/api-tests';

const answersArray = answers.map((value, index) => ({
  questionId: index + 1,
  value: value,
}));

const data = await submitTestAnswers(testId, answersArray, userId);
// data.result شامل همه اطلاعات است
```

---

## نکات مهم

1. **userId**: فعلاً می‌توانی از `localStorage.getItem('testology_userId')` استفاده کنی. در نسخه نهایی، از session استفاده می‌شود.

2. **Format Answers**: همیشه answers را به فرمت `Array<{questionId: number, value: number}>` تبدیل کن.

3. **Error Handling**: همیشه try-catch استفاده کن و خطاها را به کاربر نشان بده.

4. **Loading States**: برای UX بهتر، loading state را نمایش بده.

---

## تست کردن

برای تست کردن API:

```bash
# Submit یک تست
curl -X POST http://localhost:3000/api/tests/GAD7/submit \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"questionId": 1, "value": 2},
      {"questionId": 2, "value": 3}
    ],
    "userId": "test-user"
  }'

# دریافت نتایج کاربر
curl http://localhost:3000/api/user/tests?userId=test-user
```

---

## سوالات متداول

**Q: آیا باید UI را تغییر دهم؟**
A: خیر! فقط منطق submit را تغییر بده. UI می‌تواند همان قبلی باشد.

**Q: آیا می‌توانم از API قدیمی استفاده کنم؟**
A: بهتر است به API جدید مهاجرت کنی، چون شامل interpretation و recommendation است.

**Q: چگونه userId را بگیرم؟**
A: فعلاً از localStorage استفاده کن. بعداً از session می‌گیری.

