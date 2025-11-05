import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * دریافت آمار گیمیفیکیشن کاربر
 * GET /api/gamification/stats
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // دریافت آمار gamification
    let gamification = await prisma.gamification.findUnique({
      where: { userId: session.user.id }
    });

    // اگر وجود نداشت، ایجاد کن
    if (!gamification) {
      gamification = await prisma.gamification.create({
        data: {
          userId: session.user.id,
          xp: 0,
          level: 1,
          medals: 0,
          challengesCompleted: 0,
          streakDays: 0
        }
      });
    }

    // محاسبه XP مورد نیاز برای سطح بعد
    const currentLevelXP = (gamification.level - 1) * 1000;
    const nextLevelXP = gamification.level * 1000;
    const xpInCurrentLevel = gamification.xp - currentLevelXP;
    const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
    const progressPercentage = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

    // دریافت رتبه (تعداد کاربرانی که XP بیشتری دارند + 1)
    const rank = await prisma.gamification.count({
      where: {
        xp: {
          gt: gamification.xp
        }
      }
    }) + 1;

    // دریافت تعداد کل کاربران
    const totalUsers = await prisma.gamification.count();

    return NextResponse.json({
      xp: gamification.xp,
      level: gamification.level,
      medals: gamification.medals,
      challengesCompleted: gamification.challengesCompleted,
      streakDays: gamification.streakDays,
      currentLevelXP,
      nextLevelXP,
      xpInCurrentLevel,
      xpNeededForNextLevel,
      progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
      rank,
      totalUsers
    });

  } catch (error) {
    console.error('Error fetching gamification stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















