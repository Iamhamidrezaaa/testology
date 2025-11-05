import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    const feedback = await prisma.feedback.create({
      data: {
        userId: session?.user?.id || null,
        targetId: targetId || null,
        targetType: targetType || null,
        rating: rating || null,
        message: message.trim(),
        email: email || null
      }
    });

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
    
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const resolved = searchParams.get('resolved');

    const where: any = {};

    if (resolved !== null) {
      where.resolved = resolved === 'true';
    }

    const feedbacks = await prisma.feedback.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(feedbacks);

  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















