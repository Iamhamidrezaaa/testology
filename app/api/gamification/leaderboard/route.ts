import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

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

    // Gamification model doesn't exist in schema
    // Using UserProgress instead
    const topUsers = await prisma.userProgress.findMany({
      take: limit,
      orderBy: [
        { xp: 'desc' },
        { level: 'desc' }
      ]
    }).catch(() => []);

    // Get user details separately
    const userIds = topUsers.map(up => up.userId)
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds }
      },
      select: {
        id: true,
        name: true,
        image: true
      }
    })

    const userMap = new Map(users.map(u => [u.id, u]))

        // دریافت رتبه کاربر جاری
    const userGamification = await prisma.userProgress.findUnique({
      where: { userId: session.user.id }
    }).catch(() => null);

    let userRank = null;
    if (userGamification) {
      userRank = await prisma.userProgress.count({
        where: {
          xp: {
            gt: userGamification.xp
          }
        }
      }) + 1;
    }

    // فرمت کردن نتایج
    const leaderboard = topUsers.map((item, index) => {
      const user = userMap.get(item.userId)
      return {
        rank: index + 1,
        userId: item.userId,
        name: user?.name || 'کاربر ناشناس',
        image: user?.image || null,
        xp: item.xp || 0,
        level: item.level || 1,
        medals: 0, // Medals don't exist in schema
        challengesCompleted: 0, // Challenges don't exist in schema
        isCurrentUser: item.userId === session.user.id
      }
    });

    return NextResponse.json({
      leaderboard,
      userRank,
      totalUsers: await prisma.userProgress.count().catch(() => 0)
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















