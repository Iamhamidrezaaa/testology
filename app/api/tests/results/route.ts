import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userEmail = searchParams.get('userEmail');

    console.log('🔍 API /api/tests/results called with:', { userId, userEmail });

    let whereClause = {};
    
    if (userId) {
      whereClause = { userId };
      console.log('📊 Using userId:', userId);
    } else if (userEmail) {
      // پیدا کردن userId بر اساس userEmail
      console.log('🔍 Looking for user with email:', userEmail);
      const user = await prisma.user.findUnique({
        where: { email: userEmail }
      });
      console.log('👤 User found:', user);
      if (user) {
        whereClause = { userId: user.id };
        console.log('📊 Using userId from email:', user.id);
      } else {
        console.log('❌ User not found with email:', userEmail);
      }
    }

    // دریافت نتایج تست‌ها از دیتابیس
    const results = await prisma.testResult.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    const formattedResults = results.map(result => ({
      id: result.id,
      testId: result.testId,
      testName: result.testName,
      score: result.score,
      answers: typeof result.answers === 'string' ? JSON.parse(result.answers) : result.answers, // تبدیل JSON string به Object
      result: result.result,
      analysis: result.analysis,
      completedAt: result.createdAt, // استفاده از createdAt به جای completedAt
      userId: result.userId
    }));

    return NextResponse.json({
      success: true,
      results: formattedResults
    });
  } catch (error: any) {
    console.error('❌ خطا در دریافت نتایج تست‌ها:', error);
    console.error('Error stack:', error?.stack);
    console.error('Error message:', error?.message);
    return NextResponse.json(
      { success: false, error: error?.message || 'خطا در دریافت نتایج تست‌ها' },
      { status: 500 }
    );
  }
}

