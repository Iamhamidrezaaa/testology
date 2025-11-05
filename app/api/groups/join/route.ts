import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * پیوستن به گروه درمانی
 * POST /api/groups/join
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { groupId } = await req.json();

    if (!groupId) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
    }

    // بررسی وجود گروه
    const group = await prisma.therapyGroup.findUnique({
      where: { id: groupId }
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    if (!group.isActive) {
      return NextResponse.json({ error: 'Group is not active' }, { status: 400 });
    }

    // بررسی عضویت قبلی
    const existingMembership = await prisma.groupMembership.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: session.user.id
        }
      }
    });

    if (existingMembership) {
      return NextResponse.json({ error: 'Already a member' }, { status: 400 });
    }

    // افزودن عضو جدید
    const membership = await prisma.groupMembership.create({
      data: {
        groupId,
        userId: session.user.id,
        role: 'member'
      },
      include: {
        group: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    // ارسال نوتیفیکیشن
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: '✅ پیوستن به گروه',
        message: `با موفقیت به گروه "${group.name}" پیوستید`,
        type: 'group_join'
      }
    });

    return NextResponse.json({
      success: true,
      membership
    });

  } catch (error) {
    console.error('Error joining group:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















