import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * دریافت لیست جلسات لایو
 * GET /api/live/sessions?upcoming=true
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const upcoming = searchParams.get('upcoming') === 'true';
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '12');

    const where: any = {
      isPublished: true
    };

    if (upcoming) {
      where.startTime = {
        gte: new Date()
      };
    }

    if (category) {
      where.category = category;
    }

    // مدل liveSession هنوز در schema تعریف نشده
    // برای MVP، یک آرایه خالی برمی‌گردانیم
    const sessions: any[] = [];

    // شبیه‌سازی تاخیر کوتاه برای UX بهتر
    await new Promise(resolve => setTimeout(resolve, 100));

    const formatted = sessions.map(session => ({
      ...session,
      participantsCount: session._count?.registrations || 0
    }));

    return NextResponse.json(formatted);

  } catch (error) {
    console.error('Error fetching live sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * ایجاد جلسه لایو جدید
 * POST /api/live/sessions
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // فقط ادمین می‌تونه جلسه بسازه (در حال حاضر)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, slug, description, startTime, category, maxParticipants } = await req.json();

    if (!title || !slug || !description || !startTime || !category) {
      return NextResponse.json(
        { error: 'Title, slug, description, startTime and category are required' }, 
        { status: 400 }
      );
    }

    // مدل liveSession هنوز در schema تعریف نشده
    // برای MVP، یک پیام موفقیت برمی‌گردانیم
    return NextResponse.json({
      success: true,
      message: 'Live session feature will be available soon',
      liveSession: {
        id: 'temp-id',
        title,
        slug,
        description,
        startTime: new Date(startTime),
        category,
        maxParticipants: maxParticipants || null,
        url: `https://meet.jit.si/testology-live-${slug}`,
        hostId: session.user.id,
        isPublished: false
      }
    });

  } catch (error) {
    console.error('Error creating live session:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}







