import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * ارسال تمرین شخصی‌شده به بیمار
 * POST /api/therapist/exercises/send
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // بررسی نقش درمانگر
    if (session.user.role !== 'THERAPIST' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Therapist access required' }, 
        { status: 403 }
      );
    }

    const { userId, title, description } = await req.json();

    if (!userId || !title || !description) {
      return NextResponse.json(
        { error: 'User ID, title and description are required' }, 
        { status: 400 }
      );
    }

    // بررسی وجود بیمار
    const patient = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // CustomExercise and Notification models don't exist in schema
    // Returning mock exercise for now
    const exercise = {
      id: 'mock-exercise-id',
      userId,
      therapistId: session.user.id,
      title,
      description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      exercise
    });

  } catch (error) {
    console.error('Error sending exercise:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * دریافت لیست تمرین‌های ارسال شده توسط درمانگر
 * GET /api/therapist/exercises/send
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'THERAPIST' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // CustomExercise model doesn't exist in schema
    // Returning empty array for now
    const exercises: any[] = [];

    return NextResponse.json(exercises);

  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















