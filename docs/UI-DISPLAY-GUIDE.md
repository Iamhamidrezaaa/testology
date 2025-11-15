# راهنمای نمایش Interpretation در UI

این راهنما نحوه نمایش تفسیرها و پیشنهاد تست‌های تکمیلی در UI را توضیح می‌دهد.

## 📋 ساختار InterpretationChunk

هر `InterpretationChunk` شامل:
- `id`: شناسه یکتا
- `title`: عنوان (اختیاری)
- `body`: متن تفسیر
- `priority`: "normal" | "high"
- `kind`: "analysis" | "recommendation" (جداسازی تحلیل از پیشنهاد)

## 🎨 نمایش در صفحه تست (بعد از Submit)

```typescript
'use client';

import { useState } from 'react';

export default function TestResultDisplay({ result }: { result: any }) {
  // جداسازی تحلیل و پیشنهاد
  const analysisChunks = Array.isArray(result?.interpretation)
    ? result.interpretation.filter((c: any) => c.kind !== "recommendation")
    : [];

  const recommendationChunks = Array.isArray(result?.interpretation)
    ? result.interpretation.filter((c: any) => c.kind === "recommendation")
    : [];

  return (
    <div className="test-result-box max-w-3xl mx-auto p-6">
      {/* نمره و خلاصه */}
      <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">{result.title}</h1>
        <p className="text-4xl font-bold text-indigo-600">
          {result.totalScore.toFixed(2)}
        </p>
        {result.totalLevelLabel && (
          <p className="text-lg font-semibold mt-2">{result.totalLevelLabel}</p>
        )}
      </div>

      {/* بخش تحلیل */}
      {analysisChunks.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold mb-4">تحلیل تست</h2>
          <div className="space-y-4">
            {analysisChunks.map((chunk: any) => (
              <div
                key={chunk.id}
                className={`p-4 rounded-lg ${
                  chunk.priority === "high"
                    ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    : "bg-gray-50 dark:bg-gray-800"
                }`}
              >
                {chunk.title && (
                  <h3 className="font-semibold mb-2 text-lg">{chunk.title}</h3>
                )}
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {chunk.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* بخش پیشنهاد تست‌های تکمیلی */}
      {recommendationChunks.length > 0 && (
        <section className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <h2 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-300">
            تست‌های تکمیلی پیشنهادی
          </h2>
          <div className="space-y-3">
            {recommendationChunks.map((chunk: any) => (
              <div key={chunk.id} className="recommendation-chunk">
                {chunk.title && (
                  <h3 className="font-semibold mb-2 text-purple-600 dark:text-purple-400">
                    {chunk.title}
                  </h3>
                )}
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {chunk.body}
                </p>
              </div>
            ))}
          </div>

          {/* دکمه‌های لینک به تست‌های پیشنهادی */}
          <div className="mt-4 flex flex-wrap gap-2">
            {recommendationChunks
              .filter((c: any) => c.body.includes("**"))
              .map((chunk: any) => {
                // استخراج testId از متن (مثلاً **GAD7**)
                const match = chunk.body.match(/\*\*(\w+)\*\*/);
                if (match) {
                  const testId = match[1];
                  return (
                    <a
                      key={chunk.id}
                      href={`/tests/${testId.toLowerCase()}`}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      {testId}
                    </a>
                  );
                }
                return null;
              })}
          </div>
        </section>
      )}
    </div>
  );
}
```

## 🎨 نمایش در داشبورد (Modal جزئیات)

```typescript
'use client';

interface TestResultRecord {
  id: string;
  testId: string;
  testName: string | null;
  score: number | null;
  interpretation: any[] | null;
  // ...
}

export default function TestDetailModal({
  selected,
  onClose,
}: {
  selected: TestResultRecord;
  onClose: () => void;
}) {
  if (!selected) return null;

  const analysisChunks = Array.isArray(selected.interpretation)
    ? selected.interpretation.filter((c: any) => c.kind !== "recommendation")
    : [];

  const recommendationChunks = Array.isArray(selected.interpretation)
    ? selected.interpretation.filter((c: any) => c.kind === "recommendation")
    : [];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">
              جزئیات تست: {selected.testName || selected.testId}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* نمره */}
          {selected.score !== null && (
            <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">نمره کلی</p>
              <p className="text-3xl font-bold">{selected.score.toFixed(2)}</p>
            </div>
          )}

          {/* بخش تحلیل */}
          {analysisChunks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">تحلیل تست</h3>
              <div className="space-y-3">
                {analysisChunks.map((chunk: any) => (
                  <div
                    key={chunk.id}
                    className={`p-3 rounded-lg ${
                      chunk.priority === "high"
                        ? "bg-red-50 dark:bg-red-900/20 border border-red-200"
                        : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    {chunk.title && (
                      <h4 className="font-semibold mb-1">{chunk.title}</h4>
                    )}
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {chunk.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* بخش پیشنهاد تست‌های تکمیلی */}
          {recommendationChunks.length > 0 && (
            <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold mb-3 text-purple-700 dark:text-purple-300">
                تست‌های تکمیلی پیشنهادی
              </h3>
              <div className="space-y-2">
                {recommendationChunks.map((chunk: any) => (
                  <div key={chunk.id}>
                    {chunk.title && (
                      <h4 className="font-semibold mb-1 text-purple-600">
                        {chunk.title}
                      </h4>
                    )}
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {chunk.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

## 🎨 مثال کامل با استخراج TestId از پیشنهادها

```typescript
// Helper function برای استخراج testIdها از recommendation chunks
function extractTestIdsFromRecommendations(
  chunks: InterpretationChunk[]
): string[] {
  const testIds = new Set<string>();
  
  chunks
    .filter((c) => c.kind === "recommendation")
    .forEach((chunk) => {
      // پیدا کردن **TestId** در متن
      const matches = chunk.body.matchAll(/\*\*(\w+)\*\*/g);
      for (const match of matches) {
        testIds.add(match[1]);
      }
    });
  
  return Array.from(testIds);
}

// استفاده در کامپوننت
const recommendedTestIds = extractTestIdsFromRecommendations(
  result.interpretation || []
);

// نمایش به صورت کارت‌های قابل کلیک
<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
  {recommendedTestIds.map((testId) => (
    <a
      key={testId}
      href={`/tests/${testId.toLowerCase()}`}
      className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-center"
    >
      {testId}
    </a>
  ))}
</div>
```

## 📝 نکات مهم

1. **جداسازی با `kind`**: همیشه از `kind` برای جدا کردن تحلیل و پیشنهاد استفاده کن
2. **Priority**: chunks با `priority: "high"` را با رنگ/استایل متفاوت نشان بده
3. **Whitespace**: از `whitespace-pre-line` برای حفظ خطوط استفاده کن
4. **TestId Extraction**: می‌توانی testIdها را از متن استخراج کنی و لینک بدهی
5. **Responsive**: UI را responsive طراحی کن

## 🎯 مثال کامل برای MBTI

```typescript
// بعد از submit تست MBTI
const result = await submitTestAnswers('MBTI', answers, userId);

// result.interpretation شامل:
// - chunks با kind: "analysis" (تیپ، ابعاد، توضیحات)
// - chunks با kind: "recommendation" (پیشنهاد تست‌های تکمیلی)

// نمایش:
<TestResultDisplay result={result.result} />
```

همه چیز در `TestResult.interpretation` به صورت JSON ذخیره می‌شود و در داشبورد هم قابل دسترسی است! ✅

