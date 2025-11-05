import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    const liveSession = await prisma.liveSession.findUnique({
      where: { id: sessionId },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            image: true,
            specialty: true,
            therapistProfile: true
          }
        },
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      }
    });

    if (!liveSession) {
      return NextResponse.json({ error: 'Live session not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...liveSession,
      participantsCount: liveSession.registrations.length
    });

  } catch (error) {
    console.error('Error fetching live session:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















