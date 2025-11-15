/**
 * Helper functions برای کار با API تست‌ها
 * این فایل یک لایه abstraction برای فرانت فراهم می‌کند
 */

export interface ClientAnswer {
  questionId: number;
  value: number;
}

export interface TestSubmitResponse {
  success: boolean;
  result: {
    testId: string;
    title: string;
    totalScore: number;
    totalLevelId: string | null;
    totalLevelLabel: string | null;
    interpretation: any[];
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

/**
 * ارسال جواب‌های تست به API و دریافت نتیجه کامل
 */
export async function submitTestAnswers(
  testId: string,
  answers: ClientAnswer[],
  userId?: string | null
): Promise<TestSubmitResponse> {
  const res = await fetch(`/api/tests/${testId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers, userId: userId ?? null }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to submit test");
  }

  return res.json();
}

/**
 * دریافت لیست نتایج تست‌های کاربر
 */
export async function getUserTestResults(
  userId: string
): Promise<{
  success: boolean;
  results: any[];
  count: number;
}> {
  const res = await fetch(`/api/user/tests?userId=${userId}`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to fetch test results");
  }

  return res.json();
}

