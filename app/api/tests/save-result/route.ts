import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testId, testName, score, answers, result, analysis, userId } = body;

    const email = (userId || 'demo-user') as string;

    // پیدا کردن کاربر
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    // ذخیره نتیجه تست در دیتابیس
    const testResult = await prisma.testResult.create({
      data: {
        testId,
        testName,
        score,
        answers: JSON.stringify(answers), // تبدیل Object به JSON string
        result,
        analysis,
        userId: user.id
      }
    });

    console.log('✅ نتیجه تست در دیتابیس ذخیره شد:', testResult);

    return NextResponse.json({
      success: true,
      data: {
        id: testResult.id,
        testId: testResult.testId,
        testName: testResult.testName,
        score: testResult.score,
        answers: testResult.answers,
        result: testResult.result,
        analysis: testResult.analysis,
        completedAt: testResult.createdAt, // استفاده از createdAt
        userId: testResult.userId
      }
    });
  } catch (error) {
    console.error('❌ خطا در ذخیره نتیجه تست:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در ذخیره نتیجه تست' },
      { status: 500 }
    );
  }
}