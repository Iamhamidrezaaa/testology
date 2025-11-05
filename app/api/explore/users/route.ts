import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // دریافت کاربران فعال و عمومی
    const users = await prisma.userProfile.findMany({
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
          },
          orderBy: {
            earnedAt: 'desc'
          },
          take: 3
        }
      },
      orderBy: [
        { xp: 'desc' },
        { badges: { _count: 'desc' } }
      ],
      take: 30
    })

    const exploreUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      fullName: user.fullName || user.user.name || 'کاربر ناشناس',
      avatar: user.user.image,
      level: user.level,
      xp: user.xp,
      badges: user.badges.length,
      bio: user.bio,
      recentBadges: user.badges.map(ub => ({
        name: ub.badge.name,
        icon: ub.badge.icon,
        rarity: ub.badge.rarity
      }))
    }))

    return NextResponse.json(exploreUsers)

  } catch (error) {
    console.error('Error fetching explore users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
