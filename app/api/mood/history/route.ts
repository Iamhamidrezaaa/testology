import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * دریافت تاریخچه احساس
 * GET /api/mood/history
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '30');
    const offset = parseInt(searchParams.get('offset') || '0');

    const history = await prisma.moodEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset
    });

    // آمار کلی
    const stats = await calculateMoodStats(session.user.id);

    return NextResponse.json({
      history,
      stats,
      total: await prisma.moodEntry.count({
        where: { userId: session.user.id }
      })
    });

  } catch (error) {
    console.error('Error fetching mood history:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * محاسبه آمار احساسات
 */
async function calculateMoodStats(userId: string) {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const entries = await prisma.moodEntry.findMany({
    where: {
      userId,
      date: {
        gte: last30Days
      }
    }
  });

  const moodCounts: Record<string, number> = {};
  entries.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
  });

  // پیدا کردن غالب‌ترین mood
  const mostCommon = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])[0];

  return {
    totalEntries: entries.length,
    last30Days: entries.length,
    mostCommonMood: mostCommon ? mostCommon[0] : null,
    moodDistribution: moodCounts
  };
}
















