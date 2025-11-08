import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * گزارش ترکیبی تست‌های بیمار برای درمانگر
 * GET /api/therapist/report/[userId]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // بررسی نقش درمانگر
    if (session.user.role !== 'THERAPIST' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Therapist access required' }, 
        { status: 403 }
      );
    }

    const { userId } = params;

    // دریافت اطلاعات بیمار
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // دریافت تمام تست‌ها
    const results = await prisma.testResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // گروه‌بندی بر اساس نوع تست
    const testsByType: Record<string, any[]> = {};
    results.forEach(result => {
      const key = result.testId || result.testName || 'unknown';
      if (!testsByType[key]) {
        testsByType[key] = [];
      }
      testsByType[key].push({
        id: result.id,
        testName: result.testName,
        score: result.score,
        date: result.createdAt
      });
    });

    // تحلیل روند
    const trends = analyzeTrends(testsByType);

    // نقاط قوت و ضعف
    const strengths: string[] = [];
    const concerns: string[] = [];

    Object.entries(testsByType).forEach(([slug, tests]) => {
      const latestTest = tests[0];
      // استفاده از score برای تعیین سطح خطر (فرض: score پایین = خطر بالا)
      if (latestTest.score !== null && latestTest.score < 40) {
        concerns.push(`${latestTest.testName}: نیاز به توجه ویژه`);
      } else if (latestTest.score !== null && latestTest.score >= 70) {
        strengths.push(`${latestTest.testName}: وضعیت خوب`);
      }
    });

    // دریافت mood history
    const moodEntries = await prisma.moodEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30
    });

    // دریافت پیشرفت
    const progress = await prisma.userProgress.findUnique({
      where: { userId }
    });

    return NextResponse.json({
      success: true,
      patient: user,
      totalTests: results.length,
      testsByType,
      trends,
      strengths,
      concerns,
      recentMoods: moodEntries.slice(0, 7),
      progress,
      summary: generateSummary(results, concerns, strengths)
    });

  } catch (error) {
    console.error('Error fetching therapist report:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * تحلیل روند تست‌ها
 */
function analyzeTrends(testsByType: Record<string, any[]>) {
  const trends: Record<string, string> = {};

  Object.entries(testsByType).forEach(([slug, tests]) => {
    if (tests.length < 2) {
      trends[slug] = 'داده کافی نیست';
      return;
    }

    const latest = tests[0].score;
    const previous = tests[1].score;

    if (latest === null || previous === null) {
      trends[slug] = 'نامشخص';
    } else if (latest > previous) {
      trends[slug] = 'بدتر شده';
    } else if (latest < previous) {
      trends[slug] = 'بهتر شده';
    } else {
      trends[slug] = 'ثابت';
    }
  });

  return trends;
}

/**
 * تولید خلاصه کلی
 */
function generateSummary(
  results: any[],
  concerns: string[],
  strengths: string[]
): string {
  let summary = `تعداد کل تست‌ها: ${results.length}\n\n`;
  
  if (concerns.length > 0) {
    summary += `⚠️ نقاط نیازمند توجه (${concerns.length}):\n`;
    concerns.forEach(c => summary += `- ${c}\n`);
    summary += '\n';
  }

  if (strengths.length > 0) {
    summary += `✅ نقاط قوت (${strengths.length}):\n`;
    strengths.forEach(s => summary += `- ${s}\n`);
  }

  return summary;
}
















