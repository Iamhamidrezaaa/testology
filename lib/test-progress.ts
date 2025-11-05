// سیستم ردیابی پیشرفت تست‌ها
export interface TestProgress {
  currentTest: string | null;
  completedTests: string[];
  totalTests: number;
  startTime: Date;
  lastUpdated: Date;
}

export interface TestResult {
  testId: string;
  testName: string;
  score: number;
  completedAt: Date;
  analysis?: string;
}

export class TestProgressTracker {
  private static STORAGE_KEY = 'testology_test_progress';
  private static RESULTS_KEY = 'testology_test_results';

  // دریافت پیشرفت فعلی
  static getProgress(): TestProgress | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;
      
      const progress = JSON.parse(stored);
      return {
        ...progress,
        startTime: new Date(progress.startTime),
        lastUpdated: new Date(progress.lastUpdated)
      };
    } catch (error) {
      console.error('Error loading test progress:', error);
      return null;
    }
  }

  // شروع ردیابی جدید
  static startTracking(suggestedTests: string[]): TestProgress {
    const progress: TestProgress = {
      currentTest: suggestedTests[0] || null,
      completedTests: [],
      totalTests: suggestedTests.length,
      startTime: new Date(),
      lastUpdated: new Date()
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    return progress;
  }

  // تکمیل تست
  static completeTest(testId: string, result: TestResult): TestProgress | null {
    const progress = this.getProgress();
    if (!progress) return null;

    // اضافه کردن تست تکمیل شده
    if (!progress.completedTests.includes(testId)) {
      progress.completedTests.push(testId);
    }

    // تعیین تست بعدی
    const allTests = this.getAllSuggestedTests();
    const currentIndex = allTests.findIndex(test => test.id === testId);
    const nextTest = allTests[currentIndex + 1];
    
    progress.currentTest = nextTest ? nextTest.id : null;
    progress.lastUpdated = new Date();

    // ذخیره پیشرفت
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));

    // ذخیره نتیجه تست
    this.saveTestResult(result);

    // به‌روزرسانی داده‌های داشبورد
    this.updateDashboardData();

    return progress;
  }

  // به‌روزرسانی داده‌های داشبورد
  private static updateDashboardData(): void {
    try {
      const { DashboardDataManager } = require('@/lib/dashboard-data');
      
      const progress = this.getProgress();
      const results = this.getAllTestResults();
      
      if (progress && results.length > 0) {
        // محاسبه XP (هر تست 50 XP)
        const newXP = results.length * 50;
        
        DashboardDataManager.updateDashboardData({
          hasCompletedScreening: true,
          hasTestResults: true,
          hasProgressData: true,
          completedTests: progress.completedTests.length,
          totalTests: progress.totalTests,
          totalXP: newXP,
          userLevel: Math.floor(newXP / 100) + 1
        });
      }
    } catch (error) {
      console.error('Error updating dashboard data:', error);
    }
  }

  // ذخیره نتیجه تست
  static saveTestResult(result: TestResult): void {
    try {
      const existingResults = this.getAllTestResults();
      existingResults.push(result);
      localStorage.setItem(this.RESULTS_KEY, JSON.stringify(existingResults));
      
      // همچنین در سیستم ذخیره ساده نیز ذخیره کن
      this.saveToSimpleStorage(result);
    } catch (error) {
      console.error('Error saving test result:', error);
    }
  }

  // ذخیره در سیستم ساده
  private static saveToSimpleStorage(result: TestResult): void {
    try {
      const { SimpleTestStorage } = require('@/lib/simple-test-storage');
      SimpleTestStorage.saveTestResult({
        testId: result.testId,
        testName: result.testName,
        score: result.score,
        answers: {},
        result: result.analysis || 'تحلیل تست تکمیل شد',
        analysis: result.analysis,
        userId: 'demo-user'
      });
    } catch (error) {
      console.error('Error saving to simple storage:', error);
    }
  }

  // دریافت همه نتایج تست‌ها
  static getAllTestResults(): TestResult[] {
    try {
      const stored = localStorage.getItem(this.RESULTS_KEY);
      if (!stored) return [];
      
      const results = JSON.parse(stored);
      return results.map((result: any) => ({
        ...result,
        completedAt: new Date(result.completedAt)
      }));
    } catch (error) {
      console.error('Error loading test results:', error);
      return [];
    }
  }

  // دریافت تست‌های پیشنهادی
  static getAllSuggestedTests(): Array<{id: string, name: string}> {
    try {
      const stored = localStorage.getItem('testology_suggested_tests');
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error loading suggested tests:', error);
      return [];
    }
  }

  // بررسی اینکه آیا همه تست‌ها تکمیل شده‌اند
  static isAllTestsCompleted(): boolean {
    const progress = this.getProgress();
    if (!progress) return false;
    
    return progress.completedTests.length >= progress.totalTests;
  }

  // دریافت درصد پیشرفت
  static getProgressPercentage(): number {
    const progress = this.getProgress();
    if (!progress || progress.totalTests === 0) return 0;
    
    return (progress.completedTests.length / progress.totalTests) * 100;
  }

  // پاک کردن پیشرفت (برای شروع جدید)
  static clearProgress(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.RESULTS_KEY);
    localStorage.removeItem('testology_suggested_tests');
  }

  // دریافت تست فعلی
  static getCurrentTest(): string | null {
    const progress = this.getProgress();
    return progress?.currentTest || null;
  }

  // دریافت تست‌های تکمیل شده
  static getCompletedTests(): string[] {
    const progress = this.getProgress();
    return progress?.completedTests || [];
  }

  // دریافت تست‌های باقی‌مانده
  static getRemainingTests(): string[] {
    const progress = this.getProgress();
    if (!progress) return [];
    
    const allTests = this.getAllSuggestedTests();
    return allTests
      .map(test => test.id)
      .filter(testId => !progress.completedTests.includes(testId));
  }
}
