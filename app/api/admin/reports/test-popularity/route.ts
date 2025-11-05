import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // دریافت آمار محبوب‌ترین تست‌ها
    const testStats = await prisma.testResult.groupBy({
      by: ['testSlug', 'testName'],
      _count: { testSlug: true },
      _avg: { score: true },
      orderBy: { _count: { testSlug: 'desc' } },
      take: 10
    })

    const totalTests = await prisma.testResult.count()

    const chartData = testStats.map((stat: any) => ({
      testName: stat.testName || stat.testSlug,
      count: stat._count.testSlug,
      averageScore: stat._avg.score || 0,
      percentage: totalTests > 0 ? Math.round((stat._count.testSlug / totalTests) * 100) : 0
    }))

    return NextResponse.json(chartData)

  } catch (error) {
    console.error('Error fetching test popularity:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















