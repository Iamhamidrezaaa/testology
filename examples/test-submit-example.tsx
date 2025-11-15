/**
 * مثال کامل استفاده از API جدید برای submit کردن تست
 * این فایل یک نمونه کامل است که می‌توانی در کامپوننت‌های خودت استفاده کنی
 */

'use client';

import { useState } from 'react';
import { submitTestAnswers, ClientAnswer } from '@/lib/api-tests';

interface TestQuestion {
  id: number;
  text: string;
  options: Array<{ label: string; value: number }>;
}

interface TestSubmitExampleProps {
  testId: string;
  testName: string;
  questions: TestQuestion[];
  userId?: string | null;
}

export default function TestSubmitExample({
  testId,
  testName,
  questions,
  userId,
}: TestSubmitExampleProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // انتخاب جواب
  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // رفتن به سوال بعدی
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // رفتن به سوال قبلی
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Submit کردن تست
  const handleSubmit = async () => {
    // بررسی اینکه همه سوالات پاسخ داده شده‌اند
    const allAnswered = questions.every((q) => answers[q.id] !== undefined);
    if (!allAnswered) {
      setError('لطفاً به همه سوالات پاسخ دهید');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // تبدیل answers به فرمت مورد نیاز API
      const answersArray: ClientAnswer[] = questions.map((q) => ({
        questionId: q.id,
        value: answers[q.id],
      }));

      // گرفتن userId (از props یا localStorage)
      const finalUserId = userId || localStorage.getItem('testology_userId') || null;

      // ارسال به API
      const data = await submitTestAnswers(testId, answersArray, finalUserId);

      // نمایش نتیجه
      setResult(data.result);
    } catch (e: any) {
      console.error('Error submitting test:', e);
      setError(e.message || 'خطا در ارسال تست');
    } finally {
      setLoading(false);
    }
  };

  // اگر تست تمام شده و نتیجه آماده است
  if (result) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">نتیجه تست: {result.title}</h1>

        {/* نمره کلی */}
        <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">نمره کلی</p>
          <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
            {result.totalScore.toFixed(2)}
          </p>
          {result.totalLevelLabel && (
            <p className="mt-2 text-lg font-semibold">{result.totalLevelLabel}</p>
          )}
        </div>

        {/* زیرمقیاس‌ها */}
        {result.subscales && result.subscales.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">زیرمقیاس‌ها</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.subscales.map((subscale: any) => (
                <div
                  key={subscale.id}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {subscale.label}
                  </p>
                  <p className="text-2xl font-bold">{subscale.score.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* تفسیر */}
        {result.interpretation && result.interpretation.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">تحلیل تست</h2>
            <div className="space-y-4">
              {result.interpretation.map((chunk: any) => (
                <div
                  key={chunk.id}
                  className={`p-4 rounded-lg ${
                    chunk.priority === 'high'
                      ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                      : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  {chunk.title && (
                    <h3 className="font-semibold mb-2">{chunk.title}</h3>
                  )}
                  <p className="text-gray-700 dark:text-gray-300">{chunk.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {result.interpretationSummary && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-blue-700 dark:text-blue-300">
              {result.interpretationSummary}
            </p>
          </div>
        )}

        {/* تست‌های پیشنهادی */}
        {result.recommendedTests && result.recommendedTests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">تست‌های پیشنهادی</h2>
            <div className="flex flex-wrap gap-2">
              {result.recommendedTests.map((testId: string) => (
                <span
                  key={testId}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                >
                  {testId}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* دکمه‌های عملیات */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              setResult(null);
              setAnswers({});
              setCurrentQuestion(0);
            }}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            انجام مجدد
          </button>
          <button
            onClick={() => window.location.href = '/dashboard/tests'}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            مشاهده همه نتایج
          </button>
        </div>
      </div>
    );
  }

  // UI تست (قبل از submit)
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{testName}</h1>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          سوال {currentQuestion + 1} از {questions.length}
        </p>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-6">{currentQ.text}</h2>

        <div className="space-y-3">
          {currentQ.options.map((option) => (
            <label
              key={option.value}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                answers[currentQ.id] === option.value
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQ.id}`}
                value={option.value}
                checked={answers[currentQ.id] === option.value}
                onChange={() => handleAnswer(currentQ.id, option.value)}
                className="mr-3"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          قبلی
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={answers[currentQ.id] === undefined}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            بعدی
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'در حال پردازش...' : 'ثبت و تحلیل'}
          </button>
        )}
      </div>
    </div>
  );
}

