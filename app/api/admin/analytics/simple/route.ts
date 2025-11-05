import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // دریافت آمار کلی
    const userStats = await prisma.userAnalytics.findFirst()
    const testStats = await prisma.testAnalytics.findFirst()
    const articleStats = await prisma.articleAnalytics.findFirst()
    
    // دریافت آمار ماهانه
    const monthlyData = await prisma.monthlyAnalytics.findMany({
      orderBy: { month: 'asc' }
    })
    
    // دریافت آمار جغرافیایی
    const geoData = await prisma.geoAnalytics.findMany({
      orderBy: { users: 'desc' }
    })
    
    // دریافت آمار دستگاه‌ها
    const deviceData = await prisma.deviceAnalytics.findMany({
      orderBy: { users: 'desc' }
    })
    
    // دریافت آمار مرورگرها
    const browserData = await prisma.browserAnalytics.findMany({
      orderBy: { users: 'desc' }
    })
    
    // دریافت آمار ساعات
    const hourlyData = await prisma.hourlyAnalytics.findMany({
      orderBy: { hour: 'asc' }
    })
    
    // دریافت آمار روزهای هفته
    const weeklyData = await prisma.weeklyAnalytics.findMany()
    
    const response = {
      overview: {
        totalUsers: userStats?.total || 0,
        totalTests: testStats?.completed || 0,
        totalArticles: articleStats?.total || 0,
        totalViews: articleStats?.views || 0
      },
      userStats: userStats || {
        total: 0,
        active: 0,
        new: 0,
        returning: 0,
        premium: 0,
        free: 0
      },
      testStats: testStats || {
        total: 0,
        completed: 0,
        averageTime: 0,
        completionRate: 0,
        satisfaction: 0
      },
      articleStats: articleStats || {
        total: 0,
        published: 0,
        draft: 0,
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0
      },
      monthlyData,
      geoData,
      deviceData,
      browserData,
      hourlyData,
      weeklyData
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت آمار' },
      { status: 500 }
    )
  }
}







