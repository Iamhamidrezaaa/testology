import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * دریافت لیست گروه‌های درمانی
 * GET /api/groups/list?my=true
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const onlyMyGroups = searchParams.get('my') === 'true';

    let where: any = {
      isActive: true
    };

    // اگر فقط گروه‌های خودش رو می‌خواد
    if (onlyMyGroups) {
      where.members = {
        some: {
          userId: session.user.id
        }
      };
    }

    const groups = await prisma.therapyGroup.findMany({
      where,
      include: {
        members: {
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // فرمت کردن داده‌ها
    const formattedGroups = groups.map(group => ({
      ...group,
      memberCount: group.members.length,
      isMember: group.members.some(m => m.userId === session.user.id),
      role: group.members.find(m => m.userId === session.user.id)?.role || null
    }));

    return NextResponse.json(formattedGroups);

  } catch (error) {
    console.error('Error fetching therapy groups:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















