import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // تعداد کل کاربران
    const totalUsers = await prisma.user.count()
    
    // تعداد کل تست‌ها
    const totalTests = await prisma.test.count()
    
    // تعداد تست‌های انجام شده امروز
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const activeToday = await prisma.testResult.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })
    
    // میانگین رضایت (بر اساس امتیازات تست‌ها)
    const testResults = await prisma.testResult.findMany({
      select: { score: true }
    })
    
    const avgSatisfaction = testResults.length > 0 
      ? Math.round(testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length)
      : 0
    
    // تعداد مقالات
    const totalArticles = await prisma.article.count()
    
    // تعداد بلاگ‌ها
    const totalBlogs = await prisma.blog.count()
    
    // تعداد نتایج تست
    const totalTestResults = await prisma.testResult.count()
    
    // آمار ماهانه
    const monthlyStats = await prisma.monthlyAnalytics.findMany({
      orderBy: { month: 'desc' },
      take: 6
    })
    
    // آمار جغرافیایی
    const geoStats = await prisma.geoAnalytics.findMany({
      orderBy: { users: 'desc' },
      take: 5
    })
    
    // آمار دستگاه‌ها
    const deviceStats = await prisma.deviceAnalytics.findMany()
    
    // آمار مرورگرها
    const browserStats = await prisma.browserAnalytics.findMany()
    
    return NextResponse.json({
      users: totalUsers,
      tests: totalTests,
      activeToday,
      avgSatisfaction,
      articles: totalArticles,
      blogs: totalBlogs,
      testResults: totalTestResults,
      monthlyStats,
      geoStats,
      deviceStats,
      browserStats
    })
    
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت آمار' },
      { status: 500 }
    )
  }
}