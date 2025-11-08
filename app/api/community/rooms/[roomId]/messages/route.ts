import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * دریافت پیام‌های یک اتاق
 * GET /api/community/rooms/[roomId]/messages
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // PublicMessage model doesn't exist in schema
    // Returning empty array for now
    const messages: any[] = [];

    return NextResponse.json(messages);

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * ارسال پیام در اتاق
 * POST /api/community/rooms/[roomId]/messages
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = params;
    const { content, isAnonymous } = await req.json();

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // PublicRoom and PublicMessage models don't exist in schema
    // Returning mock message for now
    const message = {
      id: 'mock-id',
      roomId,
      userId: session.user.id,
      content: content.trim(),
      isAnonymous: isAnonymous || false,
      createdAt: new Date(),
      user: {
        id: session.user.id,
        name: session.user.name || null,
        image: session.user.image || null
      }
    };

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
















