import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

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

    // HabitTracker model doesn't exist in schema
    // Returning empty stats for now
    const habits: any[] = [];

    const totalHabits = 0;
    const completedHabits = 0;
    const activeHabits = 0;
    const totalStreakDays = 0;
    const longestStreak = 0;
    const averageProgress = 0;

    return NextResponse.json({
      totalHabits,
      completedHabits,
      activeHabits,
      totalStreakDays,
      longestStreak,
      averageProgress: 0,
      successRate: 0
    });

  } catch (error) {
    console.error('Error fetching habit stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















