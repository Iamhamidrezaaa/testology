import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * اعطای پاداش XP و مدال
 * POST /api/gamification/reward
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { xpEarned, medal, challengeCompleted } = await req.json();

    if (typeof xpEarned !== 'number' || xpEarned < 0) {
      return NextResponse.json({ error: 'Invalid XP value' }, { status: 400 });
    }

    // به‌روزرسانی یا ایجاد gamification
    const current = await prisma.gamification.upsert({
      where: { userId: session.user.id },
      update: {
        xp: { increment: xpEarned },
        medals: medal ? { increment: 1 } : undefined,
        challengesCompleted: challengeCompleted ? { increment: 1 } : undefined
      },
      create: {
        userId: session.user.id,
        xp: xpEarned,
        medals: medal ? 1 : 0,
        challengesCompleted: challengeCompleted ? 1 : 0,
        level: 1,
        streakDays: 0
      }
    });

    // محاسبه سطح جدید (هر 1000 XP = 1 سطح)
    const newLevel = Math.floor(current.xp / 1000) + 1;
    const leveledUp = newLevel > current.level;

    // اگر سطح بالا رفت، به‌روزرسانی کن
    if (leveledUp) {
      await prisma.gamification.update({
        where: { userId: session.user.id },
        data: { level: newLevel }
      });

      // ارسال نوتیفیکیشن
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          title: '🎉 سطح جدید!',
          message: `تبریک! به سطح ${newLevel} رسیدید`,
          type: 'level_up'
        }
      });
    }

    // اگر مدال گرفت، نوتیف بفرست
    if (medal) {
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          title: '🏅 مدال جدید!',
          message: 'شما یک مدال جدید دریافت کردید',
          type: 'medal'
        }
      });
    }

    return NextResponse.json({
      success: true,
      xp: current.xp + xpEarned,
      level: newLevel,
      medals: current.medals + (medal ? 1 : 0),
      leveledUp,
      xpEarned
    });

  } catch (error) {
    console.error('Error rewarding user:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















