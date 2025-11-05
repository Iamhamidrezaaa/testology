import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // دریافت کاربران برتر بر اساس امتیاز
    const topUsers = await prisma.userProfile.findMany({
      where: {
        isPublic: true
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        bio: true,
        mood: true,
        totalPoints: true,
        user: {
          select: {
            image: true,
            createdAt: true
          }
        }
      },
      orderBy: { totalPoints: 'desc' },
      take: 20
    })

    // محاسبه آمار برای هر کاربر
    const usersWithStats = await Promise.all(
      topUsers.map(async (user) => {
        const testCount = await prisma.testResult.count({
          where: {
            userId: user.user.id,
            completed: true
          }
        })

        return {
          ...user,
          testCount,
          joinDate: user.user.createdAt
        }
      })
    )

    return NextResponse.json({ users: usersWithStats })

  } catch (error) {
    console.error('Error fetching top users:', error)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
















