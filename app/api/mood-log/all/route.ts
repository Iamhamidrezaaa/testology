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

    const userId = session.user.id

    // دریافت تمام mood log های کاربر
    const moodLogs = await prisma.moodLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    })

    // آمار کلی
    const stats = {
      totalEntries: moodLogs.length,
      averageEnergy: moodLogs.reduce((sum: number, log: typeof moodLogs[0]) => sum + (log.energy || 0), 0) / moodLogs.length || 0,
      averageStress: moodLogs.reduce((sum: number, log: typeof moodLogs[0]) => sum + (log.stress || 0), 0) / moodLogs.length || 0,
      averageSleep: moodLogs.reduce((sum: number, log: typeof moodLogs[0]) => sum + (log.sleepHour || 0), 0) / moodLogs.length || 0,
      exerciseDays: moodLogs.filter((log: typeof moodLogs[0]) => log.exercise).length,
      meditationDays: moodLogs.filter((log: typeof moodLogs[0]) => log.meditation).length,
      moodCounts: moodLogs.reduce((acc: Record<string, number>, log: typeof moodLogs[0]) => {
        acc[log.mood] = (acc[log.mood] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }

    // گروه‌بندی بر اساس ماه
    const monthlyData = moodLogs.reduce((acc: Record<string, typeof moodLogs>, log: typeof moodLogs[0]) => {
      const monthKey = log.date.toISOString().substring(0, 7) // YYYY-MM
      if (!acc[monthKey]) {
        acc[monthKey] = []
      }
      acc[monthKey].push(log)
      return acc
    }, {} as Record<string, any[]>)

    return NextResponse.json({
      moodLogs,
      stats,
      monthlyData
    })

  } catch (error) {
    console.error('Error fetching mood logs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
















