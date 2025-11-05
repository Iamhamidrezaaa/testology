import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * دریافت لیست ردیاب‌های عادت کاربر
 * GET /api/habit/list
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const habits = await prisma.habitTracker.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });

    // محاسبه آمار برای هر عادت
    const habitsWithStats = habits.map(habit => {
      const progressPercentage = Math.min(
        100,
        (habit.currentStreak / habit.goalDays) * 100
      );

      const daysRemaining = Math.max(0, habit.goalDays - habit.currentStreak);

      // بررسی آیا امروز چک شده یا نه
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      let checkedToday = false;
      if (habit.lastChecked) {
        const lastCheckedDate = new Date(habit.lastChecked);
        const lastCheckedDay = new Date(
          lastCheckedDate.getFullYear(),
          lastCheckedDate.getMonth(),
          lastCheckedDate.getDate()
        );
        checkedToday = lastCheckedDay.getTime() === today.getTime();
      }

      return {
        ...habit,
        progressPercentage: Math.round(progressPercentage),
        daysRemaining,
        isCompleted: habit.currentStreak >= habit.goalDays,
        checkedToday
      };
    });

    return NextResponse.json(habitsWithStats);

  } catch (error) {
    console.error('Error fetching habit trackers:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















