import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // UserProfile model doesn't exist in schema
    // Using UserProgress and User instead
    const topUsers = await prisma.userProgress.findMany({
      where: {
        xp: { gt: 0 }
      },
      orderBy: {
        xp: 'desc'
      },
      take: 50
    }).catch(() => [])

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

    const leaderboard = topUsers.map((up, index) => {
      const user = userMap.get(up.userId)
      return {
        rank: index + 1,
        id: up.userId,
        username: user?.name || 'کاربر ناشناس',
        fullName: user?.name || 'کاربر ناشناس',
        avatar: user?.image || null,
        level: up.level || 1,
        xp: up.xp || 0,
        totalPoints: up.xp || 0,
        badges: 0, // Badge model doesn't exist
        recentBadges: []
      }
    })

    // آمار کلی
    const totalUsers = await prisma.userProgress.count({
      where: { xp: { gt: 0 } }
    }).catch(() => 0)

    const totalXP = await prisma.userProgress.aggregate({
      where: { xp: { gt: 0 } },
      _sum: { xp: true }
    }).catch(() => ({ _sum: { xp: null } }))

    return NextResponse.json({
      leaderboard,
      stats: {
        totalUsers,
        totalXP: totalXP._sum.xp || 0
      }
    })

  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
