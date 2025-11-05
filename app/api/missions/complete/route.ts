import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * تکمیل یک مأموریت
 * POST /api/missions/complete
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { missionId } = await req.json();

    if (!missionId) {
      return NextResponse.json({ error: 'Mission ID is required' }, { status: 400 });
    }

    // پیدا کردن مأموریت
    const mission = await prisma.dailyMission.findUnique({
      where: { id: missionId }
    });

    if (!mission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }

    // بررسی مالکیت
    if (mission.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // اگر قبلاً تکمیل شده
    if (mission.isCompleted) {
      return NextResponse.json({ error: 'Mission already completed' }, { status: 400 });
    }

    // تکمیل مأموریت
    const completed = await prisma.dailyMission.update({
      where: { id: missionId },
      data: { isCompleted: true }
    });

    // اضافه کردن XP به کاربر
    await prisma.userProgress.upsert({
      where: { userId: session.user.id },
      update: {
        xp: { increment: mission.xpReward }
      },
      create: {
        userId: session.user.id,
        xp: mission.xpReward,
        level: 1,
        totalTests: 0,
        streakDays: 0
      }
    });

    // ارسال نوتیفیکیشن
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: '✅ مأموریت تکمیل شد!',
        message: `${mission.xpReward} XP دریافت کردید`,
        type: 'mission_completed'
      }
    });

    return NextResponse.json({
      success: true,
      mission: completed,
      xpEarned: mission.xpReward
    });

  } catch (error) {
    console.error('Error completing mission:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















