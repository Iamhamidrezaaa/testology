import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString())

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { date: 'asc' }
    })

    // تبدیل به فرمت مناسب برای تقویم
    const calendarData = moodEntries.map(entry => ({
      id: entry.id,
      mood: entry.mood,
      note: entry.note,
      date: entry.date.toISOString().split('T')[0]
    }))

    // آمار ماهانه
    const moodStats = {
      totalEntries: moodEntries.length,
      moodDistribution: moodEntries.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      averageMood: moodEntries.length > 0 
        ? moodEntries.reduce((sum, entry) => {
            const moodValue = getMoodValue(entry.mood)
            return sum + moodValue
          }, 0) / moodEntries.length
        : 0
    }

    return NextResponse.json({ 
      calendarData,
      stats: moodStats
    })

  } catch (error) {
    console.error('Error fetching mood data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getMoodValue(mood: string): number {
  const moodValues: Record<string, number> = {
    '😊': 5,
    '😐': 3,
    '😢': 1,
    '😠': 2,
    '😴': 4
  }
  return moodValues[mood] || 3
}
















