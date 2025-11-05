import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * ارسال پیام خصوصی
 * POST /api/messages/send
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { receiverId, content } = await req.json();

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: 'Receiver ID and content are required' }, 
        { status: 400 }
      );
    }

    // بررسی وجود گیرنده
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    });

    if (!receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });
    }

    // ساخت پیام
    const message = await prisma.privateMessage.create({
      data: {
        senderId: session.user.id,
        receiverId,
        content,
        read: false
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    // ارسال نوتیفیکیشن به گیرنده
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: '💌 پیام جدید',
        message: `پیام جدیدی از ${session.user.name || 'یک کاربر'} دریافت کردید`,
        type: 'new_message',
        actionUrl: '/messages'
      }
    });

    return NextResponse.json({
      success: true,
      message
    });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
