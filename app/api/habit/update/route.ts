import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * ثبت یک روز موفق در ترک عادت
 * POST /api/habit/update
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { habitId } = await req.json();

    if (!habitId) {
      return NextResponse.json({ error: 'Habit ID is required' }, { status: 400 });
    }

    // پیدا کردن ردیاب
    const habit = await prisma.habitTracker.findUnique({
      where: { id: habitId }
    });

    if (!habit) {
      return NextResponse.json({ error: 'Habit tracker not found' }, { status: 404 });
    }

    if (habit.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // بررسی آخرین چک
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (habit.lastChecked) {
      const lastCheckedDate = new Date(habit.lastChecked);
      const lastCheckedDay = new Date(
        lastCheckedDate.getFullYear(),
        lastCheckedDate.getMonth(),
        lastCheckedDate.getDate()
      );

      // اگر امروز قبلاً چک کرده
      if (lastCheckedDay.getTime() === today.getTime()) {
        return NextResponse.json({ error: 'Already checked today' }, { status: 400 });
      }

      // اگر دیروز چک نکرده، streak صفر میشه
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastCheckedDay.getTime() < yesterday.getTime()) {
        // Streak قطع شده
        const newStreak = 1;
        const updated = await prisma.habitTracker.update({
          where: { id: habitId },
          data: {
            currentStreak: newStreak,
            longestStreak: Math.max(habit.longestStreak, newStreak),
            lastChecked: now
          }
        });

        return NextResponse.json({
          success: true,
          habitTracker: updated,
          streakBroken: true,
          message: 'Streak was reset, starting new streak!'
        });
      }
    }

    // افزایش streak
    const newStreak = habit.currentStreak + 1;
    const newLongestStreak = Math.max(habit.longestStreak, newStreak);

    const updated = await prisma.habitTracker.update({
      where: { id: habitId },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastChecked: now
      }
    });

    // اگر به هدف رسید
    if (newStreak === habit.goalDays) {
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          title: '🎉 به هدف رسیدید!',
          message: `تبریک! ${habit.goalDays} روز متوالی "${habit.habit}" را کامل کردید!`,
          type: 'goal_reached'
        }
      });

      // اعطای مدال
      await fetch(`${process.env.NEXTAUTH_URL}/api/gamification/reward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          xpEarned: 200,
          medal: true
        })
      });
    }
    // milestone های دیگر
    else if ([7, 14, 21, 30, 50, 100].includes(newStreak)) {
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          title: `🔥 ${newStreak} روز متوالی!`,
          message: `عالی! به ${newStreak} روز متوالی رسیدید. ادامه دهید!`,
          type: 'milestone'
        }
      });
    }

    return NextResponse.json({
      success: true,
      habitTracker: updated,
      streakIncreased: true,
      currentStreak: newStreak
    });

  } catch (error) {
    console.error('Error updating habit tracker:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















