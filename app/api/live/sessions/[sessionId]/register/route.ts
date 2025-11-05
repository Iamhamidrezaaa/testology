import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * ثبت‌نام در جلسه لایو
 * POST /api/live/sessions/[sessionId]/register
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = params;

    // بررسی وجود جلسه
    const liveSession = await prisma.liveSession.findUnique({
      where: { id: sessionId },
      include: {
        _count: {
          select: {
            registrations: true
          }
        }
      }
    });

    if (!liveSession) {
      return NextResponse.json({ error: 'Live session not found' }, { status: 404 });
    }

    if (!liveSession.isPublished) {
      return NextResponse.json({ error: 'Session is not published yet' }, { status: 400 });
    }

    // بررسی ظرفیت
    if (liveSession.maxParticipants && liveSession._count.registrations >= liveSession.maxParticipants) {
      return NextResponse.json({ error: 'Session is full' }, { status: 400 });
    }

    // بررسی ثبت‌نام قبلی
    const existing = await prisma.liveRegistration.findUnique({
      where: {
        liveId_userId: {
          liveId: sessionId,
          userId: session.user.id
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Already registered' }, { status: 400 });
    }

    // ثبت‌نام
    const registration = await prisma.liveRegistration.create({
      data: {
        liveId: sessionId,
        userId: session.user.id
      }
    });

    // ارسال نوتیفیکیشن
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: '✅ ثبت‌نام موفق',
        message: `شما در جلسه "${liveSession.title}" ثبت‌نام کردید`,
        type: 'live_registration',
        actionUrl: `/live/${liveSession.slug}`
      }
    });

    return NextResponse.json({
      success: true,
      registration,
      liveUrl: liveSession.url
    });

  } catch (error) {
    console.error('Error registering for live session:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















