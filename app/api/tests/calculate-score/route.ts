import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateTestScore, ScoringConfig } from '@/lib/scoring-engine';

/**
 * POST /api/tests/calculate-score
 * محاسبه نمره تست بر اساس scoring config
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { testSlug, answers } = body;

    if (!testSlug || !answers) {
      return NextResponse.json(
        { error: 'testSlug و answers الزامی است' },
        { status: 400 }
      );
    }

    // دریافت تست از دیتابیس
    const test = await prisma.test.findUnique({
      where: { testSlug },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!test) {
      return NextResponse.json(
        { error: 'تست یافت نشد' },
        { status: 404 }
      );
    }

    // دریافت scoring config
    let config: ScoringConfig;
    if (test.scoringConfig) {
      config = JSON.parse(test.scoringConfig);
    } else {
      // اگر config وجود نداشت، از config پیش‌فرض استفاده کن
      return NextResponse.json(
        { error: 'Scoring config برای این تست تنظیم نشده است' },
        { status: 400 }
      );
    }

    // تبدیل answers به فرمت مورد نیاز
    // answers باید به صورت { questionOrder: selectedOptionIndex } باشد
    const formattedAnswers: Record<number, number> = {};
    Object.entries(answers).forEach(([key, value]) => {
      const questionOrder = parseInt(key);
      const optionIndex = typeof value === 'number' ? value : parseInt(String(value));
      formattedAnswers[questionOrder] = optionIndex;
    });

    // محاسبه نمره
    const result = calculateTestScore(
      testSlug,
      config,
      formattedAnswers,
      test.questions.map(q => ({
        order: q.order,
        dimension: q.dimension,
        isReverse: q.isReverse,
      }))
    );

    return NextResponse.json({
      success: true,
      result,
    });

  } catch (error) {
    console.error('Error calculating test score:', error);
    return NextResponse.json(
      { error: 'خطا در محاسبه نمره تست' },
      { status: 500 }
    );
  }
}

