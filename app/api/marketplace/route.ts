import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * دریافت لیست محصولات مارکت
 * GET /api/marketplace?category=anxiety&type=exercise&limit=12
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (type) {
      where.type = type;
    }

    const items = await prisma.marketplaceItem.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    const total = await prisma.marketplaceItem.count({ where });

    return NextResponse.json({
      items,
      total,
      hasMore: (offset + limit) < total
    });

  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















