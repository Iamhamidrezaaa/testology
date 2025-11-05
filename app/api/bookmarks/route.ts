import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * دریافت لیست بوکمارک‌های کاربر
 * GET /api/bookmarks?type=article
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetType = searchParams.get('type');

    const where: any = {
      userId: session.user.id
    };

    if (targetType) {
      where.targetType = targetType;
    }

    const bookmarks = await prisma.bookmark.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(bookmarks);

  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * افزودن بوکمارک
 * POST /api/bookmarks
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetId, targetType } = await req.json();

    if (!targetId || !targetType) {
      return NextResponse.json(
        { error: 'Target ID and type are required' }, 
        { status: 400 }
      );
    }

    // بررسی وجود قبلی
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_targetId_targetType: {
          userId: session.user.id,
          targetId,
          targetType
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Already bookmarked' }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        targetId,
        targetType
      }
    });

    return NextResponse.json({
      success: true,
      bookmark
    });

  } catch (error) {
    console.error('Error creating bookmark:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * حذف بوکمارک
 * DELETE /api/bookmarks
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetId, targetType } = await req.json();

    if (!targetId || !targetType) {
      return NextResponse.json(
        { error: 'Target ID and type are required' }, 
        { status: 400 }
      );
    }

    await prisma.bookmark.deleteMany({
      where: {
        userId: session.user.id,
        targetId,
        targetType
      }
    });

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















