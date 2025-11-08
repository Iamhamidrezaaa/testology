import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

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

    // Gamification model doesn't exist in schema
    // Using UserProgress instead
    const current = await prisma.userProgress.upsert({
      where: { userId: session.user.id },
      update: {
        xp: { increment: xpEarned }
      },
      create: {
        userId: session.user.id,
        xp: xpEarned,
        level: 1,
        totalTests: 0,
        streakDays: 0
      }
    });

    // محاسبه سطح جدید (هر 1000 XP = 1 سطح)
    const newLevel = Math.floor((current.xp || 0) / 1000) + 1;
    const leveledUp = newLevel > (current.level || 1);

    // اگر سطح بالا رفت، به‌روزرسانی کن
    if (leveledUp) {
      await prisma.userProgress.update({
        where: { userId: session.user.id },
        data: { level: newLevel }
      });

      // Notification model may not exist, skip for now
      // await prisma.notification.create({...});
    }

    // اگر مدال گرفت، نوتیف بفرست (Notification model may not exist)
    // if (medal) { ... }

    return NextResponse.json({
      success: true,
      xp: (current.xp || 0) + xpEarned,
      level: newLevel,
      medals: 0, // Medals don't exist in schema
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
















