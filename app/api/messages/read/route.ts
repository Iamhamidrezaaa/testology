import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * علامت‌گذاری پیام به عنوان خوانده شده
 * POST /api/messages/read
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // مدل privateMessage در schema وجود ندارد
    // برای MVP، یک پیام موفقیت برمی‌گردانیم
    return NextResponse.json({
      success: true,
      message: 'Message feature is not available yet. Models need to be added to schema.'
    });

  } catch (error) {
    console.error('Error marking message as read:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















