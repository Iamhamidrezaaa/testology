import { NextRequest, NextResponse } from 'next/server';
import { SimpleTestStorage } from '@/lib/simple-test-storage';

export async function POST(req: NextRequest) {
  try {
    const { testId, testName, score, answers, analysis, userId } = await req.json();

    // اعتبارسنجی داده‌ها
    if (!testId || !testName || typeof score !== 'number') {
      return NextResponse.json({ 
        success: false, 
        error: 'داده‌های ناقص' 
      }, { status: 400 });
    }

    // تولید متن نتیجه بر اساس نمره
    const getResultText = (score: number): string => {
      if (score >= 80) return "عالی - شما در این زمینه عملکرد بسیار خوبی دارید";
      if (score >= 60) return "خوب - شما در این زمینه عملکرد مناسبی دارید";
      if (score >= 40) return "متوسط - شما در این زمینه نیاز به بهبود دارید";
      return "نیاز به بهبود - شما در این زمینه نیاز به تمرین و تلاش بیشتری دارید";
    };

    // ذخیره نتیجه تست
    const testResult = SimpleTestStorage.saveTestResult({
      testId,
      testName,
      score,
      answers: answers || {},
      result: getResultText(score),
      analysis: analysis || "تحلیل خلاصه: وضعیت شما در حد متوسط است.",
      userId: userId || 'demo-user'
    });

    // به‌روزرسانی داده‌های داشبورد
    const stats = await SimpleTestStorage.getTestStats(userId);
    
    // ذخیره آمار در localStorage (برای استفاده در فرانت‌اند)
    if (typeof window !== 'undefined') {
      localStorage.setItem('testology_dashboard_data', JSON.stringify({
        hasCompletedScreening: true,
        hasTestResults: true,
        hasProgressData: true,
        lastActivity: new Date(),
        userLevel: Math.floor(stats.averageScore / 20) + 1,
        totalXP: stats.totalTests * 50,
        completedTests: stats.totalTests,
        totalTests: stats.totalTests + 2 // فرض می‌کنیم 2 تست دیگر پیشنهاد شده
      }));
    }

    return NextResponse.json({
      success: true,
      result: testResult,
      stats,
      message: 'نتیجه تست با موفقیت ذخیره شد'
    });

  } catch (error) {
    console.error('❌ خطا در ذخیره نتیجه تست:', error);
    return NextResponse.json({
      success: false,
      error: 'خطا در ذخیره نتیجه تست',
      details: error instanceof Error ? error.message : 'خطای نامشخص'
    }, { status: 500 });
  }
}

// دریافت نتایج تست‌ها
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const results = await SimpleTestStorage.getUserTestResults(userId || undefined);
    const stats = await SimpleTestStorage.getTestStats(userId || undefined);

    return NextResponse.json({
      success: true,
      results,
      stats
    });

  } catch (error) {
    console.error('❌ خطا در دریافت نتایج تست:', error);
    return NextResponse.json({
      success: false,
      error: 'خطا در دریافت نتایج تست'
    }, { status: 500 });
  }
}




