import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * دریافت جزئیات یک آیتم از مارکت
 * GET /api/marketplace/[itemId]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;

    const item = await prisma.marketplaceItem.findUnique({
      where: { id: itemId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            specialty: true,
            therapistProfile: true
          }
        }
      }
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(item);

  } catch (error) {
    console.error('Error fetching marketplace item:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















