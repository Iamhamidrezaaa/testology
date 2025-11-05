import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * دریافت تمرین‌های من
 * GET /api/exercises/my
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const exercises = await prisma.customExercise.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(exercises);

  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * تکمیل تمرین
 * POST /api/exercises/my (with exerciseId in body)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { exerciseId } = await req.json();

    if (!exerciseId) {
      return NextResponse.json({ error: 'Exercise ID is required' }, { status: 400 });
    }

    const exercise = await prisma.customExercise.findUnique({
      where: { id: exerciseId }
    });

    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    if (exercise.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.customExercise.update({
      where: { id: exerciseId },
      data: { completed: true }
    });

    // اضافه کردن XP
    await prisma.userProgress.upsert({
      where: { userId: session.user.id },
      update: {
        xp: { increment: 50 }
      },
      create: {
        userId: session.user.id,
        xp: 50,
        level: 1,
        totalTests: 0,
        streakDays: 0
      }
    });

    return NextResponse.json({
      success: true,
      exercise: updated,
      xpEarned: 50
    });

  } catch (error) {
    console.error('Error completing exercise:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















