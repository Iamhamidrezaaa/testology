import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * API برای دریافت جلسات درمانی
 * GET /api/therapist/sessions
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'therapist' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id }
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 });
    }

    const sessions = await prisma.therapistSession.findMany({
      where: { therapistId: therapist.id },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json({
      success: true,
      sessions
    });

  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * API برای ثبت جلسه جدید
 * POST /api/therapist/sessions
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'therapist' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { patientId, date, duration, note, meetingLink } = await req.json();

    if (!patientId || !date) {
      return NextResponse.json(
        { error: 'Patient ID and date are required' }, 
        { status: 400 }
      );
    }

    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id }
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 });
    }

    const newSession = await prisma.therapistSession.create({
      data: {
        therapistId: therapist.id,
        patientId,
        date: new Date(date),
        duration: duration || 60,
        note: note || null,
        meetingLink: meetingLink || null,
        status: 'scheduled'
      }
    });

    // ارسال نوتیفیکیشن به بیمار
    await prisma.notification.create({
      data: {
        userId: patientId,
        title: '📅 جلسه جدید برنامه‌ریزی شد',
        message: `جلسه درمانی شما برای تاریخ ${new Date(date).toLocaleDateString('fa-IR')} برنامه‌ریزی شد`,
        type: 'session',
        actionUrl: '/dashboard/sessions'
      }
    });

    return NextResponse.json({
      success: true,
      session: newSession
    });

  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
