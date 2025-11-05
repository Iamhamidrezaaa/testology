import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDailyMissions } from '@/lib/services/missions'
import { authOptions } from '@/lib/auth'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const missions = getDailyMissions(today.toDateString())

    // حذف مأموریت‌های قبلی امروز
    await prisma.dailyMission.deleteMany({
      where: {
        userId: session.user.id,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    })

    // ایجاد مأموریت‌های جدید
    const createdMissions = await Promise.all(
      missions.map(mission =>
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

    return NextResponse.json({ 
      success: true, 
      missions: createdMissions,
      message: 'مأموریت‌های امروز با موفقیت ایجاد شدند'
    })

  } catch (error) {
    console.error('Error assigning missions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
















