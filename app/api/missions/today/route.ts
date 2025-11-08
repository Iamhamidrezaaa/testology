import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';

/**
 * دریافت مأموریت‌های امروز
 * GET /api/missions/today
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // مدل dailyMission در schema وجود ندارد
    // برای MVP، مأموریت‌های mock برمی‌گردانیم
    const today = new Date();
    const newMissions = await createDailyMissions(session.user.id);
    return NextResponse.json(newMissions);

  } catch (error) {
    console.error('Error fetching daily missions:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * ایجاد مأموریت‌های روزانه برای کاربر
 */
async function createDailyMissions(userId: string) {
  const missions = [
    {
      title: 'انجام یک تست روان‌شناسی',
      description: 'یکی از تست‌های موجود را کامل کنید',
      xpReward: 100
    },
    {
      title: 'ثبت احساس امروز',
      description: 'وضعیت روحی خود را در تقویم ثبت کنید',
      xpReward: 50
    },
    {
      title: 'مطالعه یک مقاله',
      description: 'یک مقاله از بلاگ را بخوانید',
      xpReward: 30
    },
    {
      title: '10 دقیقه مدیتیشن',
      description: 'وقت بگذارید برای آرامش ذهن',
      xpReward: 75
    }
  ];

  // مدل dailyMission در schema وجود ندارد
  // برای MVP، مأموریت‌های mock برمی‌گردانیم
  const today = new Date();
  return missions.map(mission => ({
    id: `temp-${mission.title}`,
    userId,
    title: mission.title,
    description: mission.description,
    xpReward: mission.xpReward,
    date: today,
    isCompleted: false,
    createdAt: today
  }));
}
















