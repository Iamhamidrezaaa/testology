import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * دریافت لیدربورد (رتبه‌بندی)
 * GET /api/gamification/leaderboard?limit=10
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // دریافت top users
    const topUsers = await prisma.gamification.findMany({
      take: limit,
      orderBy: [
        { xp: 'desc' },
        { level: 'desc' }
      ],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    // دریافت رتبه کاربر جاری
    const userGamification = await prisma.gamification.findUnique({
      where: { userId: session.user.id }
    });

    let userRank = null;
    if (userGamification) {
      userRank = await prisma.gamification.count({
        where: {
          xp: {
            gt: userGamification.xp
          }
        }
      }) + 1;
    }

    // فرمت کردن نتایج
    const leaderboard = topUsers.map((item, index) => ({
      rank: index + 1,
      userId: item.user.id,
      name: item.user.name || 'کاربر ناشناس',
      image: item.user.image,
      xp: item.xp,
      level: item.level,
      medals: item.medals,
      challengesCompleted: item.challengesCompleted,
      isCurrentUser: item.userId === session.user.id
    }));

    return NextResponse.json({
      leaderboard,
      userRank,
      totalUsers: await prisma.gamification.count()
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















