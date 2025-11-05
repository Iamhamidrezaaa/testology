import { TestResult } from '../types'

export async function saveTestResult(testId: string, answers: Record<string, string>): Promise<void> {
  try {
    const response = await fetch('/api/analyze/' + testId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      throw new Error('خطا در ذخیره نتایج');
    }
  } catch (error) {
    console.error('Error saving test result:', error);
    throw error;
  }
} 