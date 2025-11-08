import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // دریافت آمار محبوب‌ترین تست‌ها
    const testStats = await prisma.testResult.groupBy({
      by: ['testName'],
      _count: { id: true },
      _avg: { score: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    })

    const totalTests = await prisma.testResult.count()

    const chartData = testStats.map((stat: any) => ({
      testName: stat.testName || 'Unknown',
      count: stat._count.id,
      averageScore: stat._avg.score || 0,
      percentage: totalTests > 0 ? Math.round((stat._count.id / totalTests) * 100) : 0
    }))

    return NextResponse.json(chartData)

  } catch (error) {
    console.error('Error fetching test popularity:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















