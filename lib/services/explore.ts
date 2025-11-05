import { prisma } from '@/lib/prisma'

export interface ExploreUser {
  id: string
  username: string
  fullName: string
  bio?: string
  mood?: string
  totalPoints: number
  testCount: number
  joinDate: string
}

export interface ExploreTest {
  slug: string
  name: string
  completionCount: number
  details?: {
    id: string
    title: string
    description: string
    category: string
    estimatedTime: number
    difficulty: string
  }
}

export async function getExploreData(): Promise<{
  users: ExploreUser[]
  popularTests: ExploreTest[]
}> {
  try {
    // دریافت کاربران فعال
    const users = await prisma.userProfile.findMany({
      where: {
        isPublic: true
      },
      include: {
        user: {
          select: {
            id: true
          }
        }
      },
      orderBy: { totalPoints: 'desc' },
      take: 12
    })

    // محاسبه آمار برای هر کاربر
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const testCount = await prisma.testResult.count({
          where: {
            userId: user.userId,
            completed: true
          }
        })

        return {
          id: user.id,
          username: user.username,
          fullName: user.fullName || 'کاربر',
          bio: user.bio,
          mood: user.mood,
          totalPoints: user.totalPoints,
          testCount,
          joinDate: user.createdAt.toISOString()
        }
      })
    )

    // دریافت تست‌های محبوب
    const popularTests = await prisma.testResult.groupBy({
      by: ['testSlug', 'testName'],
      where: {
        completed: true
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 8
    })

    // دریافت جزئیات تست‌ها
    const testsWithDetails = await Promise.all(
      popularTests.map(async (test) => {
        const testDetails = await prisma.test.findFirst({
          where: {
            slug: test.testSlug
          },
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            estimatedTime: true,
            difficulty: true
          }
        })

        return {
          slug: test.testSlug,
          name: test.testName,
          completionCount: test._count.id,
          details: testDetails
        }
      })
    )

    return {
      users: usersWithStats,
      popularTests: testsWithDetails
    }

  } catch (error) {
    console.error('Error fetching explore data:', error)
    return {
      users: [],
      popularTests: []
    }
  }
}