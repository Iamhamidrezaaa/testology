// سیستم ذخیره تست‌ها با فراخوانی APIهای سرور (بدون استفاده مستقیم از Prisma در کلاینت)

export interface SimpleTestResult {
  id: string;
  testId: string;
  testName: string;
  score: number;
  answers: Record<string, any>;
  result: string;
  analysis?: string;
  completedAt: Date;
  userId?: string;
}

export class SimpleTestStorage {
  // ذخیره نتیجه تست در دیتابیس از طریق API
  static async saveTestResult(result: Omit<SimpleTestResult, 'id' | 'completedAt'>): Promise<SimpleTestResult> {
    try {
      const resp = await fetch('/api/tests/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });
      if (!resp.ok) throw new Error('API save-result failed');
      const data = await resp.json();
      if (!data?.success) throw new Error(data?.error || 'API returned error');
      return data.data as SimpleTestResult;
    } catch (error) {
      console.error('❌ خطا در ذخیره نتیجه تست:', error);
      throw new Error('خطا در ذخیره نتیجه تست');
    }
  }

  // دریافت همه نتایج تست‌ها از دیتابیس (API)
  static async getAllTestResults(userId?: string): Promise<SimpleTestResult[]> {
    try {
      const url = userId ? `/api/tests/results?userId=${encodeURIComponent(userId)}` : '/api/tests/results';
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('API results failed');
      const data = await resp.json();
      if (!data?.success) throw new Error(data?.error || 'API returned error');
      return (data.data || []) as SimpleTestResult[];
    } catch (error) {
      console.error('❌ خطا در دریافت نتایج تست‌ها:', error);
      return [];
    }
  }

  // دریافت نتایج تست‌های کاربر
  static async getUserTestResults(userId?: string): Promise<SimpleTestResult[]> {
    return await this.getAllTestResults(userId);
  }

  // دریافت نتیجه تست خاص (با فیلتر سمت کلاینت روی نتایج API)
  static async getTestResult(testId: string, userId?: string): Promise<SimpleTestResult | null> {
    try {
      const all = await this.getAllTestResults(userId);
      return all.find(r => r.testId === testId) || null;
    } catch (error) {
      console.error('❌ خطا در دریافت نتیجه تست:', error);
      return null;
    }
  }

  // حذف نتیجه تست (اختیاری - در حال حاضر استفاده نمی‌شود)
  static async deleteTestResult(_resultId: string): Promise<boolean> {
    console.warn('deleteTestResult API not implemented');
    return false;
  }

  // پاک کردن همه نتایج (اختیاری - در حال حاضر استفاده نمی‌شود)
  static async clearAllResults(_userId?: string): Promise<void> {
    console.warn('clearAllResults API not implemented');
  }

  // دریافت آمار تست‌ها
  static async getTestStats(userId?: string): Promise<{
    totalTests: number;
    averageScore: number;
    completedTests: string[];
    lastTestDate?: Date;
  }> {
    try {
      const userResults = await this.getUserTestResults(userId);
      
      if (userResults.length === 0) {
        return {
          totalTests: 0,
          averageScore: 0,
          completedTests: []
        };
      }

      const totalTests = userResults.length;
      const averageScore = userResults.reduce((sum, result) => sum + result.score, 0) / totalTests;
      const completedTests = userResults.map(result => result.testName);
      const lastTestDate = userResults[0]?.completedAt;

      return {
        totalTests,
        averageScore: Math.round(averageScore * 100) / 100,
        completedTests,
        lastTestDate
      };
    } catch (error) {
      console.error('❌ خطا در دریافت آمار تست‌ها:', error);
      return {
        totalTests: 0,
        averageScore: 0,
        completedTests: []
      };
    }
  }
}
