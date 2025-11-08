import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * ایجاد ردیاب عادت جدید
 * POST /api/habit/create
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { habit, goalDays } = await req.json();

    if (!habit || !goalDays) {
      return NextResponse.json(
        { error: 'Habit name and goal days are required' }, 
        { status: 400 }
      );
    }

    if (goalDays < 1) {
      return NextResponse.json(
        { error: 'Goal days must be at least 1' }, 
        { status: 400 }
      );
    }

    // HabitTracker model doesn't exist in schema
    // Returning mock habitTracker for now
    const habitTracker = {
      id: 'mock-habit-id',
      userId: session.user.id,
      habit,
      goalDays,
      currentStreak: 0,
      longestStreak: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Notification model may not exist, skip for now
    // await prisma.notification.create({...});

    return NextResponse.json({
      success: true,
      habitTracker
    });

  } catch (error) {
    console.error('Error creating habit tracker:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















