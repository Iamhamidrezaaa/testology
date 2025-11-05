import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // دریافت آمار محبوب‌ترین تست‌ها
    const results = await prisma.testResult.findMany({
      select: { 
        testName: true,
        testSlug: true,
        score: true
      },
    })

    // محاسبه آمار
    const summary = results.reduce((acc: any, r) => {
      const key = r.testName || r.testSlug
      if (!acc[key]) {
        acc[key] = { 
          testName: key, 
          count: 0, 
          totalScore: 0,
          scores: []
        }
      }
      acc[key].count++
      if (r.score) {
        acc[key].totalScore += r.score
        acc[key].scores.push(r.score)
      }
      return acc
    }, {} as Record<string, any>)

    // تبدیل به آرایه و محاسبه میانگین
    const chartData = Object.values(summary).map((item: any) => ({
      testName: item.testName,
      count: item.count,
      averageScore: item.count > 0 ? item.totalScore / item.count : 0,
      percentage: 0 // بعداً محاسبه می‌شود
    }))

    // محاسبه درصد
    const totalTests = chartData.reduce((sum, item) => sum + item.count, 0)
    chartData.forEach(item => {
      item.percentage = totalTests > 0 ? Math.round((item.count / totalTests) * 100) : 0
    })

    // مرتب‌سازی بر اساس تعداد
    chartData.sort((a, b) => b.count - a.count)

    return NextResponse.json(chartData)

  } catch (error) {
    console.error('Error fetching popular tests:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

















