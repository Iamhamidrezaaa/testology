import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userEmail = searchParams.get('email')
    
    if (!userEmail) {
      return NextResponse.json(
        { error: 'ایمیل کاربر مورد نیاز است' },
        { status: 400 }
      )
    }

    // پیدا کردن کاربر
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'کاربر یافت نشد' },
        { status: 404 }
      )
    }

    // تعداد تست‌های انجام شده
    const completedTests = await prisma.userTest.count({
      where: { userId: user.id }
    })

    // تعداد نتایج تست
    const testResults = await prisma.testResult.count({
      where: { userId: user.id }
    })

    // میانگین امتیاز تست‌ها
    const avgScore = await prisma.testResult.aggregate({
      where: { userId: user.id },
      _avg: { score: true }
    })

    // آخرین تست‌های انجام شده
    const recentTests = await prisma.testResult.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        testName: true,
        score: true,
        result: true,
        createdAt: true
      }
    })

    // داده‌های خلق و خو (آخرین 30 روز)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const moodData = await prisma.moodAggregate.findMany({
      where: {
        recordedAt: { gte: thirtyDaysAgo }
      },
      orderBy: { recordedAt: 'asc' }
    })

    // آمار تست‌ها بر اساس دسته‌بندی
    const testCategories = await prisma.testResult.groupBy({
      by: ['testName'],
      where: { userId: user.id },
      _count: { testName: true },
      _avg: { score: true }
    })

    // تاریخچه چت
    const chatHistory = await prisma.chatHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        role: true,
        content: true,
        createdAt: true
      }
    })

    // اعلان‌های خوانده نشده
    const unreadNotifications = await prisma.notification.count({
      where: {
        userId: user.id,
        read: false
      }
    })

    // محاسبه نمره خلق و خو
    const moodScore = moodData.length > 0 
      ? moodData.reduce((sum, mood) => sum + mood.intensity, 0) / moodData.length
      : 0

    // محاسبه پیشرفت هفتگی
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const weeklyTests = await prisma.testResult.count({
      where: {
        userId: user.id,
        createdAt: { gte: oneWeekAgo }
      }
    })

    const weeklyProgress = Math.min((weeklyTests / 3) * 100, 100) // حداکثر 100%

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      stats: {
        completedTests,
        testResults,
        avgScore: Math.round(avgScore._avg.score || 0),
        moodScore: Math.round(moodScore * 10) / 10,
        weeklyProgress: Math.round(weeklyProgress),
        unreadNotifications
      },
      recentTests,
      moodData: moodData.map(mood => ({
        moodType: mood.moodType,
        intensity: mood.intensity,
        recordedAt: mood.recordedAt
      })),
      testCategories: testCategories.map(cat => ({
        testName: cat.testName,
        count: cat._count.testName,
        avgScore: Math.round(cat._avg.score || 0)
      })),
      chatHistory,
      insights: {
        totalInsights: testResults,
        moodTrend: moodData.length > 1 ? 
          (moodData[moodData.length - 1].intensity - moodData[0].intensity) : 0,
        testFrequency: Math.round(completedTests / 30 * 7) // تست در هفته
      }
    })
    
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت آمار کاربر' },
      { status: 500 }
    )
  }
}


