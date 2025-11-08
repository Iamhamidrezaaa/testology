import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

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

    // مدل liveSession و liveRegistration در schema وجود ندارند
    // برای MVP، یک پیام خطا برمی‌گردانیم
    return NextResponse.json(
      { error: 'Live session feature is not available yet. Models need to be added to schema.' },
      { status: 501 }
    );

  } catch (error) {
    console.error('Error registering for live session:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















