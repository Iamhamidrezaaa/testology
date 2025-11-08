import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { calculateLevel, getXPForTest, checkAchievements } from '@/lib/services/leveling';

/**
 * API برای افزودن XP پس از انجام تست
 * POST /api/xp/add
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { score, testSlug } = await req.json();

    if (typeof score !== 'number' || score < 0) {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
    }

    const xpToAdd = getXPForTest(score);

    // به‌روزرسانی یا ایجاد پروگرس کاربر
    const userProgress = await prisma.userProgress.upsert({
      where: { userId: session.user.id },
      update: { 
        xp: { increment: xpToAdd },
        totalTests: { increment: 1 },
        lastActivity: new Date()
      },
      create: { 
        userId: session.user.id, 
        xp: xpToAdd,
        totalTests: 1,
        level: 1
      },
    });

    // محاسبه سطح جدید
    const newXP = userProgress.xp + xpToAdd;
    const newLevel = calculateLevel(newXP);
    const leveledUp = newLevel > userProgress.level;

    // بررسی دستاوردهای جدید
    const newAchievements = checkAchievements({
      totalTests: userProgress.totalTests + 1,
      xp: newXP,
      level: newLevel,
      streakDays: userProgress.streakDays
    });

    // فیلتر کردن دستاوردهایی که قبلاً کسب نشده‌اند
    // توجه: achievements در schema وجود ندارد، پس فقط برای نمایش استفاده می‌شود
    const achievementsToAdd = newAchievements;

    // به‌روزرسانی سطح
    const updatedProgress = await prisma.userProgress.update({
      where: { userId: session.user.id },
      data: { 
        level: newLevel
      },
    });

    // ارسال نوتیفیکیشن در صورت لول‌آپ
    if (leveledUp) {
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          title: '🎉 تبریک! سطح جدید',
          message: `شما به سطح ${newLevel} رسیدید!`
        }
      });
    }

    // ارسال نوتیفیکیشن برای دستاوردهای جدید
    for (const achievement of achievementsToAdd) {
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          title: '🏆 دستاورد جدید!',
          message: `دستاورد "${achievement}" را کسب کردید`
        }
      });
    }

    return NextResponse.json({ 
      success: true,
      xp: updatedProgress.xp,
      level: updatedProgress.level,
      xpAdded: xpToAdd,
      leveledUp,
      newAchievements: achievementsToAdd
    });

  } catch (error) {
    console.error('Error adding XP:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

