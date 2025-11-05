import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * تولید لینک لایو برای گروه
 * POST /api/groups/live
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
      where: { id: groupId },
      include: {
        members: true
      }
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // بررسی عضویت
    const isMember = group.members.some(m => m.userId === session.user.id);
    if (!isMember) {
      return NextResponse.json({ error: 'You are not a member of this group' }, { status: 403 });
    }

    // تولید room name منحصر به فرد
    const roomName = `testology-${groupId.slice(0, 8)}`;
    
    // استفاده از Jitsi Meet
    const liveUrl = `https://meet.jit.si/${roomName}`;

    // یا می‌تونید از Daily.co استفاده کنید:
    // const dailyApiKey = process.env.DAILY_API_KEY;
    // if (dailyApiKey) {
    //   const response = await fetch('https://api.daily.co/v1/rooms', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${dailyApiKey}`
    //     },
    //     body: JSON.stringify({
    //       name: roomName,
    //       privacy: 'private',
    //       properties: {
    //         enable_screenshare: true,
    //         enable_chat: true
    //       }
    //     })
    //   });
    //   const room = await response.json();
    //   liveUrl = room.url;
    // }

    return NextResponse.json({
      success: true,
      liveUrl,
      roomName,
      groupName: group.name,
      message: 'Live session link generated successfully'
    });

  } catch (error) {
    console.error('Error generating live session:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















