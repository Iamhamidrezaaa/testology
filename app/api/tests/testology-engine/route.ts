/**
 * API Route برای Testology Engine
 * POST /api/tests/testology-engine
 * 
 * این endpoint موتور مرکزی Testology را اجرا می‌کند:
 * - Scoring دقیق
 * - Interpretation هوشمند
 * - Recommendation تست‌های تکمیلی
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { runTestologyEngineWithConfig } from '@/lib/testology-engine';
import type { ScoringConfig } from '@/lib/scoring-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { testSlug, answers, allTestResults } = body;

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
      return NextResponse.json(
        { error: 'Scoring config برای این تست تنظیم نشده است' },
        { status: 400 }
      );
    }

    // تبدیل answers به فرمت مورد نیاز
    const formattedAnswers: Record<number, number> = {};
    Object.entries(answers).forEach(([key, value]) => {
      const questionOrder = parseInt(key);
      const optionIndex = typeof value === 'number' ? value : parseInt(String(value));
      formattedAnswers[questionOrder] = optionIndex;
    });

    // آماده‌سازی questions
    const questions = test.questions.map(q => ({
      order: q.order,
      dimension: q.dimension,
      isReverse: q.isReverse,
    }));

    // اجرای موتور Testology
    const result = runTestologyEngineWithConfig(
      testSlug,
      formattedAnswers,
      config,
      allTestResults || {}
    );

    return NextResponse.json({
      success: true,
      result,
    });

  } catch (error) {
    console.error('Error running Testology Engine:', error);
    return NextResponse.json(
      { error: 'خطا در اجرای موتور Testology' },
      { status: 500 }
    );
  }
}

