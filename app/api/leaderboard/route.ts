import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // دریافت 50 کاربر برتر بر اساس XP
    const topUsers = await prisma.userProfile.findMany({
      where: {
        isPublic: true,
        xp: { gt: 0 }
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        },
        badges: {
          include: {
            badge: true
          }
        }
      },
      orderBy: [
        { xp: 'desc' },
        { totalPoints: 'desc' },
        { createdAt: 'asc' }
      ],
      take: 50
    })

    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      username: user.username,
      fullName: user.fullName || user.user.name || 'کاربر ناشناس',
      avatar: user.user.image,
      level: user.level,
      xp: user.xp,
      totalPoints: user.totalPoints,
      badges: user.badges.length,
      recentBadges: user.badges
        .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
        .slice(0, 3)
        .map(ub => ({
          name: ub.badge.name,
          icon: ub.badge.icon,
          rarity: ub.badge.rarity
        }))
    }))

    // آمار کلی
    const totalUsers = await prisma.userProfile.count({
      where: { isPublic: true }
    })

    const totalXP = await prisma.userProfile.aggregate({
      where: { isPublic: true },
      _sum: { xp: true }
    })

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
