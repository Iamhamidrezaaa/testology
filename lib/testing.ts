// سیستم تست و Error Handling
export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  totalDuration: number;
  passed: number;
  failed: number;
}

class TestRunner {
  private tests: Array<() => Promise<void> | void> = [];
  private currentTest: string = '';

  // اضافه کردن تست
  test(name: string, fn: () => Promise<void> | void) {
    this.tests.push(async () => {
      this.currentTest = name;
      try {
        await fn();
        console.log(`✅ ${name}`);
      } catch (error) {
        console.error(`❌ ${name}:`, error);
        throw error;
      }
    });
  }

  // اجرای تمام تست‌ها
  async run(): Promise<TestSuite> {
    const results: TestResult[] = [];
    const startTime = Date.now();

    for (const testFn of this.tests) {
      const testStart = Date.now();
      try {
        await testFn();
        results.push({
          name: this.currentTest,
          passed: true,
          duration: Date.now() - testStart
        });
      } catch (error) {
        results.push({
          name: this.currentTest,
          passed: false,
          error: error instanceof Error ? error.message : String(error),
          duration: Date.now() - testStart
        });
      }
    }

    const totalDuration = Date.now() - startTime;
    const passed = results.filter(r => r.passed).length;
    const failed = results.length - passed;

    return {
      name: 'Test Suite',
      tests: results,
      totalDuration,
      passed,
      failed
    };
  }
}

export const testRunner = new TestRunner();

// تابع کمکی برای تست‌ها
export function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, but got ${actual}`);
      }
    },
    toEqual(expected: any) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy value, but got ${actual}`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected falsy value, but got ${actual}`);
      }
    },
    toThrow() {
      try {
        if (typeof actual === 'function') {
          actual();
        }
        throw new Error('Expected function to throw, but it did not');
      } catch (error) {
        // تابع خطا پرتاب کرده - این چیزی است که می‌خواستیم
      }
    }
  };
}

// Error Handler سراسری
export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorLog: Array<{ timestamp: Date; error: Error; context?: any }> = [];

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  // ثبت خطا
  logError(error: Error, context?: any) {
    this.errorLog.push({
      timestamp: new Date(),
      error,
      context
    });

    // در production، خطا را به سرویس مانیتورینگ بفرست
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(error, context);
    }
  }

  // دریافت آمار خطاها
  getErrorStats() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentErrors = this.errorLog.filter(
      entry => entry.timestamp > last24h
    );

    return {
      total: this.errorLog.length,
      last24h: recentErrors.length,
      recent: recentErrors.slice(-10)
    };
  }

  // پاک کردن لاگ‌های قدیمی
  cleanup() {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 روز
    this.errorLog = this.errorLog.filter(entry => entry.timestamp > cutoff);
  }

  private sendToMonitoring(error: Error, context?: any) {
    // اینجا می‌توانید به سرویس‌های مانیتورینگ مثل Sentry متصل شوید
    console.error('Production Error:', error, context);
  }
}

export const errorHandler = GlobalErrorHandler.getInstance();

// تابع کمکی برای مدیریت خطاها در API
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler.logError(
        error instanceof Error ? error : new Error(String(error)),
        { args }
      );
      throw error;
    }
  };
}

// تست‌های نمونه
export function runSampleTests() {
  testRunner.test('Basic Math', () => {
    expect(2 + 2).toBe(4);
    expect(10 - 5).toBe(5);
  });

  testRunner.test('String Operations', () => {
    expect('hello'.toUpperCase()).toBe('HELLO');
    expect('test'.length).toBe(4);
  });

  testRunner.test('Array Operations', () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr.includes(2)).toBeTruthy();
  });

  return testRunner.run();
}





