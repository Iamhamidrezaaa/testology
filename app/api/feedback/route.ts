import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * ارسال بازخورد
 * POST /api/feedback
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    const { message, rating, targetId, targetType, email } = await req.json();

    if (!message || message.trim() === '') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Feedback model doesn't exist in schema
    // Returning mock feedback for now
    const feedback = {
      id: 'mock-feedback-id',
      userId: session?.user?.id || null,
      targetId: targetId || null,
      targetType: targetType || null,
      rating: rating || null,
      message: message.trim(),
      email: email || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // ارسال نوتیفیکیشن به ادمین (اختیاری)
    // await sendAdminNotification('New feedback received');

    return NextResponse.json({
      success: true,
      feedback
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * دریافت بازخوردها (فقط ادمین)
 * GET /api/feedback
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Feedback model doesn't exist in schema
    // Returning empty array for now
    const feedbacks: any[] = [];

    return NextResponse.json(feedbacks);

  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















