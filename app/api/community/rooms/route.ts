import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * دریافت لیست اتاق‌های چت عمومی
 * GET /api/community/rooms
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const where: any = {
      isActive: true
    };

    if (category) {
      where.category = category;
    }

    // PublicRoom model doesn't exist in schema
    // Returning empty array for now
    const rooms: any[] = [];

    return NextResponse.json(rooms);

  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * ایجاد اتاق چت جدید
 * POST /api/community/rooms
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // فقط ادمین یا درمانگر می‌تونه اتاق بسازه
    if (session.user.role !== 'THERAPIST' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, category, description } = await req.json();

    if (!title || !category) {
      return NextResponse.json(
        { error: 'Title and category are required' }, 
        { status: 400 }
      );
    }

    // PublicRoom model doesn't exist in schema
    // Returning mock room for now
    const room = {
      id: 'mock-id',
      title,
      category,
      description: description || null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      room
    });

  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















