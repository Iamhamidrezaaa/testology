import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * دریافت آمار کلی ترک عادت
 * GET /api/habit/stats
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const habits = await prisma.habitTracker.findMany({
      where: { userId: session.user.id }
    });

    const totalHabits = habits.length;
    const completedHabits = habits.filter(h => h.currentStreak >= h.goalDays).length;
    const activeHabits = habits.filter(h => h.currentStreak > 0 && h.currentStreak < h.goalDays).length;

    const totalStreakDays = habits.reduce((sum, h) => sum + h.currentStreak, 0);
    const longestStreak = Math.max(...habits.map(h => h.longestStreak), 0);

    // محاسبه میانگین پیشرفت
    const averageProgress = totalHabits > 0
      ? habits.reduce((sum, h) => sum + (h.currentStreak / h.goalDays), 0) / totalHabits * 100
      : 0;

    return NextResponse.json({
      totalHabits,
      completedHabits,
      activeHabits,
      totalStreakDays,
      longestStreak,
      averageProgress: Math.round(averageProgress),
      successRate: totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0
    });

  } catch (error) {
    console.error('Error fetching habit stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















