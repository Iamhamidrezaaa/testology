import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getDailyMissions } from '@/lib/services/missions'
import { authOptions } from '@/lib/auth'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // مدل dailyMission در schema وجود ندارد
    // برای MVP، یک پیام موفقیت برمی‌گردانیم
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const missions = getDailyMissions(today.toDateString())

    return NextResponse.json({ 
      success: true, 
      missions: missions.map(m => ({ ...m, id: 'temp-id', userId: session.user.id, date: today, isCompleted: false })),
      message: 'مأموریت‌های امروز با موفقیت ایجاد شدند (Mock)'
    })

  } catch (error) {
    console.error('Error assigning missions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
















