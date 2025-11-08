import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // مدل dailyMission در schema وجود ندارد
    // برای MVP، مأموریت‌های mock برمی‌گردانیم
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { getDailyMissions } = await import('@/lib/services/missions')
    const defaultMissions = getDailyMissions(today.toDateString())
    
    const missions = defaultMissions.map(m => ({
      ...m,
      id: `temp-${m.title}`,
      userId: session.user.id,
      date: today,
      isCompleted: false,
      createdAt: today
    }))
    
    return NextResponse.json({ missions })

  } catch (error) {
    console.error('Error fetching missions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
















