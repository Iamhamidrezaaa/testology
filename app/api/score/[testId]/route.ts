/**
 * API Route برای نمره‌دهی تست‌ها
 * POST /api/score/[testId]
 * 
 * این endpoint موتور مرکزی scoring را اجرا می‌کند
 * بدون نیاز به تغییر UI - فقط فرانت جواب‌ها را POST می‌کند
 */

import { NextRequest, NextResponse } from 'next/server';
import { scoreTest } from '@/lib/scoring-engine-v2';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const { testId } = params;

    if (!testId) {
      return NextResponse.json(
        { error: 'testId الزامی است' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { answers, userId } = body as {
      answers: { questionId: number; value: number }[];
      userId?: string | null;
    };

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: 'answers الزامی است و باید آرایه باشد' },
        { status: 400 }
      );
    }

    // محاسبه نمره
    const result = scoreTest(testId, answers);

    // ذخیره در DB — اختیاری / قابل تطبیق با مدل فعلی
    if (userId && prisma) {
      try {
        await prisma.testResult.create({
          data: {
            userId,
            testName: result.title,
            testId: result.testId,
            testSlug: testId,
            score: result.totalScore,
            result: result.totalLevelLabel || null,
            resultText: result.interpretation || null,
            rawAnswers: JSON.stringify(result.rawAnswers),
            answers: JSON.stringify(result.rawAnswers),
            severity: result.totalLevelId || null,
            interpretation: result.interpretation || null,
            completed: true,
          },
        });
      } catch (dbError) {
        // اگر مدل وجود نداشت یا خطا داد، فقط لاگ کن
        console.warn('Could not save to database:', dbError);
      }
    }

    return NextResponse.json({
      success: true,
      result,
    });

  } catch (err: any) {
    console.error('Error in scoring API:', err);
    return NextResponse.json(
      { 
        error: 'خطا در محاسبه نمره',
        details: err.message 
      },
      { status: 500 }
    );
  }
}

