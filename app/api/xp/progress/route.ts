import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateProgress, getXPForNextLevel } from '@/lib/services/leveling';

/**
 * API برای دریافت اطلاعات پیشرفت کاربر
 * GET /api/xp/progress
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // دریافت پیشرفت کاربر
    let userProgress = await prisma.userProgress.findUnique({
      where: { userId: session.user.id }
    });

    // اگر پیشرفت وجود نداشت، یکی ایجاد کن
    if (!userProgress) {
      userProgress = await prisma.userProgress.create({
        data: {
          userId: session.user.id,
          xp: 0,
          level: 1,
          totalTests: 0,
          streakDays: 0
        }
      });
    }

    const progress = calculateProgress(userProgress.xp, userProgress.level);
    const nextLevelXP = getXPForNextLevel(userProgress.level);

    return NextResponse.json({
      xp: userProgress.xp,
      level: userProgress.level,
      progress,
      nextLevelXP,
      totalTests: userProgress.totalTests,
      streakDays: userProgress.streakDays,
      achievements: userProgress.achievements,
      lastActivity: userProgress.lastActivity
    });

  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















