import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * ثبت وضعیت احساسی
 * POST /api/mood/add
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { mood, note } = await req.json();

    if (!mood) {
      return NextResponse.json({ error: 'Mood is required' }, { status: 400 });
    }

    // ساخت ورودی جدید
    const entry = await prisma.moodEntry.create({
      data: {
        userId: session.user.id,
        mood,
        note: note || null,
        date: new Date()
      }
    });

    // به‌روزرسانی streak (تداوم روزانه)
    await updateStreak(session.user.id);

    // اضافه کردن XP برای ثبت mood
    await prisma.userProgress.upsert({
      where: { userId: session.user.id },
      update: {
        xp: { increment: 20 }
      },
      create: {
        userId: session.user.id,
        xp: 20,
        level: 1,
        totalTests: 0,
        streakDays: 0
      }
    });

    return NextResponse.json({
      success: true,
      entry,
      xpEarned: 20
    });

  } catch (error) {
    console.error('Error adding mood entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * به‌روزرسانی تداوم روزانه
 */
async function updateStreak(userId: string) {
  const progress = await prisma.userProgress.findUnique({
    where: { userId }
  });

  if (!progress) return;

  const lastActivity = new Date(progress.lastActivity);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

  let newStreak = progress.streakDays;

  if (diffDays === 1) {
    // روز بعد - افزایش streak
    newStreak = progress.streakDays + 1;
  } else if (diffDays > 1) {
    // قطع شده - ریست به 1
    newStreak = 1;
  }
  // اگر همون روز باشه، streak تغییر نمی‌کنه

  await prisma.userProgress.update({
    where: { userId },
    data: {
      streakDays: newStreak,
      lastActivity: now
    }
  });
}
















