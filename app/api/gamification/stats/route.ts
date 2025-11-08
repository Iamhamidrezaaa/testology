import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

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

    // Gamification model doesn't exist in schema
    // Using UserProgress instead
    let gamification = await prisma.userProgress.findUnique({
      where: { userId: session.user.id }
    });

    // اگر وجود نداشت، ایجاد کن
    if (!gamification) {
      gamification = await prisma.userProgress.create({
        data: {
          userId: session.user.id,
          xp: 0,
          level: 1,
          totalTests: 0,
          streakDays: 0
        }
      });
    }

    // محاسبه XP مورد نیاز برای سطح بعد
    const currentLevelXP = ((gamification.level || 1) - 1) * 1000;
    const nextLevelXP = (gamification.level || 1) * 1000;
    const xpInCurrentLevel = (gamification.xp || 0) - currentLevelXP;
    const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
    const progressPercentage = xpNeededForNextLevel > 0 ? (xpInCurrentLevel / xpNeededForNextLevel) * 100 : 0;

    // دریافت رتبه (تعداد کاربرانی که XP بیشتری دارند + 1)
    const rank = await prisma.userProgress.count({
      where: {
        xp: {
          gt: gamification.xp || 0
        }
      }
    }) + 1;

    // دریافت تعداد کل کاربران
    const totalUsers = await prisma.userProgress.count();

    return NextResponse.json({
      xp: gamification.xp || 0,
      level: gamification.level || 1,
      medals: 0, // Medals don't exist in schema
      challengesCompleted: 0, // Challenges don't exist in schema
      streakDays: gamification.streakDays || 0,
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
















