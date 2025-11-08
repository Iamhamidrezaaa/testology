import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * دریافت جزئیات یک جلسه لایو
 * GET /api/live/sessions/[sessionId]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

    // مدل liveSession در schema وجود ندارد
    // برای MVP، یک پیام خطا برمی‌گردانیم
    return NextResponse.json(
      { error: 'Live session feature is not available yet. Models need to be added to schema.' },
      { status: 501 }
    );

  } catch (error) {
    console.error('Error fetching live session:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















