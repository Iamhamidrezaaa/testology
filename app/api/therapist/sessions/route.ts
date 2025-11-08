import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

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

    if (session.user.role !== 'THERAPIST' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // مدل therapist و therapistSession در schema وجود ندارند
    // برای MVP، لیست خالی برمی‌گردانیم
    return NextResponse.json({
      success: true,
      sessions: []
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

    if (session.user.role !== 'THERAPIST' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { patientId, date } = await req.json();

    if (!patientId || !date) {
      return NextResponse.json(
        { error: 'Patient ID and date are required' }, 
        { status: 400 }
      );
    }

    // مدل therapist و therapistSession در schema وجود ندارند
    // برای MVP، یک پیام موفقیت mock برمی‌گردانیم
    // ارسال نوتیفیکیشن به بیمار
    await prisma.notification.create({
      data: {
        userId: patientId,
        title: '📅 جلسه جدید برنامه‌ریزی شد',
        message: `جلسه درمانی شما برای تاریخ ${new Date(date).toLocaleDateString('fa-IR')} برنامه‌ریزی شد`
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Session feature is not fully available yet. Models need to be added to schema.'
    });

  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
