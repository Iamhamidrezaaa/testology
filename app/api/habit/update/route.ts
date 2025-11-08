import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * ثبت یک روز موفق در ترک عادت
 * POST /api/habit/update
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { habitId } = await req.json();

    if (!habitId) {
      return NextResponse.json({ error: 'Habit ID is required' }, { status: 400 });
    }

    // HabitTracker model doesn't exist in schema
    // Returning mock data for now
    const habit: { userId: string } | null = null;

    if (!habit) {
      return NextResponse.json({ error: 'Habit tracker not found' }, { status: 404 });
    }

    // Since habit is always null, we always return not found
    // But if it existed, we would check userId here
    // if (habit.userId !== session.user.id) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    // Mock update
    const updated = {
      id: habitId,
      userId: session.user.id,
      habit: 'mock-habit',
      goalDays: 30,
      currentStreak: 1,
      longestStreak: 1,
      lastChecked: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      habitTracker: updated,
      streakIncreased: true,
      currentStreak: 1
    });

  } catch (error) {
    console.error('Error updating habit tracker:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















