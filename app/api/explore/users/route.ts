import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // UserProfile model doesn't exist in schema - using UserProgress instead
    const usersWithProgress = await prisma.userProgress.findMany({
      where: {
        xp: { gt: 0 }
      },
      orderBy: {
        xp: 'desc'
      },
      take: 30
    }).catch(() => [])

    // Get user details separately
    const userIds = usersWithProgress.map(up => up.userId)
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

    const exploreUsers = usersWithProgress.map(up => {
      const user = userMap.get(up.userId)
      return {
        id: up.userId,
        username: user?.name || 'کاربر ناشناس',
        fullName: user?.name || 'کاربر ناشناس',
        avatar: user?.image || null,
        level: up.level || 1,
        xp: up.xp || 0,
        badges: 0, // Badge model doesn't exist
        bio: null,
        recentBadges: []
      }
    })

    return NextResponse.json(exploreUsers)

  } catch (error) {
    console.error('Error fetching explore users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
