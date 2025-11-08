import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

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

    // مدل dailyMission در schema وجود ندارد
    // برای MVP، یک پیام موفقیت mock برمی‌گردانیم
    // در حالت واقعی، باید XP را به userProgress اضافه کنیم
    const mockXpReward = 100;

    // اضافه کردن XP به کاربر (این بخش کار می‌کند چون userProgress وجود دارد)
    await prisma.userProgress.upsert({
      where: { userId: session.user.id },
      update: {
        xp: { increment: mockXpReward }
      },
      create: {
        userId: session.user.id,
        xp: mockXpReward,
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
        message: `${mockXpReward} XP دریافت کردید`
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Mission feature is not fully available yet. Models need to be added to schema.',
      xpEarned: mockXpReward
    });

  } catch (error) {
    console.error('Error completing mission:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















