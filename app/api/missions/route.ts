import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // دریافت مأموریت‌های امروز
    const missions = await prisma.dailyMission.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: today,
          lt: tomorrow
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    // اگر مأموریت‌ای برای امروز وجود ندارد، ایجاد کن
    if (missions.length === 0) {
      const { getDailyMissions } = await import('@/lib/services/missions')
      const defaultMissions = getDailyMissions(today.toDateString())
      
      const createdMissions = await Promise.all(
        defaultMissions.map(mission =>
          prisma.dailyMission.create({
            data: {
              title: mission.title,
              description: mission.description,
              xpReward: mission.xpReward,
              userId: session.user.id,
              date: today
            }
          })
        )
      )
      
      return NextResponse.json({ missions: createdMissions })
    }

    return NextResponse.json({ missions })

  } catch (error) {
    console.error('Error fetching missions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
















