import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * دریافت پیام‌های ارسالی
 * GET /api/messages/sent
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // مدل privateMessage در schema وجود ندارد
    // برای MVP، لیست خالی برمی‌گردانیم
    return NextResponse.json([]);

  } catch (error) {
    console.error('Error fetching sent messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















