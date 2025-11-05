import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // دریافت آمار کلی
    const [
      userAnalytics,
      testAnalytics,
      articleAnalytics,
      monthlyData,
      categoryData,
      dailyData,
      geoData,
      deviceData,
      browserData,
      hourlyData,
      weeklyData
    ] = await Promise.all([
      prisma.userAnalytics.findFirst(),
      prisma.testAnalytics.findFirst(),
      prisma.articleAnalytics.findFirst(),
      prisma.monthlyAnalytics.findMany({ orderBy: { month: 'asc' } }),
      prisma.categoryAnalytics.findMany(),
      prisma.dailyAnalytics.findMany({ 
        orderBy: { date: 'desc' },
        take: 30 
      }),
      prisma.geoAnalytics.findMany({ orderBy: { users: 'desc' } }),
      prisma.deviceAnalytics.findMany({ orderBy: { users: 'desc' } }),
      prisma.browserAnalytics.findMany({ orderBy: { users: 'desc' } }),
      prisma.hourlyAnalytics.findMany({ orderBy: { hour: 'asc' } }),
      prisma.weeklyAnalytics.findMany()
    ])

    // محاسبه آمار کلی
    const totalUsers = userAnalytics?.total || 0
    const totalTests = testAnalytics?.completed || 0
    const totalArticles = articleAnalytics?.total || 0
    const totalViews = articleAnalytics?.views || 0

    // محاسبه رشد ماهانه
    const monthlyGrowth = monthlyData.length > 1 ? 
      ((monthlyData[monthlyData.length - 1].users - monthlyData[0].users) / monthlyData[0].users * 100) : 0

    // محاسبه آمار روزانه
    const todayData = dailyData[0] || { users: 0, tests: 0, articles: 0, revenue: 0 }
    const yesterdayData = dailyData[1] || { users: 0, tests: 0, articles: 0, revenue: 0 }

    const dailyGrowth = {
      users: yesterdayData.users > 0 ? ((todayData.users - yesterdayData.users) / yesterdayData.users * 100) : 0,
      tests: yesterdayData.tests > 0 ? ((todayData.tests - yesterdayData.tests) / yesterdayData.tests * 100) : 0,
      articles: yesterdayData.articles > 0 ? ((todayData.articles - yesterdayData.articles) / yesterdayData.articles * 100) : 0,
      revenue: yesterdayData.revenue > 0 ? ((todayData.revenue - yesterdayData.revenue) / yesterdayData.revenue * 100) : 0
    }

    // محاسبه آمار جغرافیایی
    const topCountries = geoData.slice(0, 5)
    const totalGeoUsers = geoData.reduce((sum, geo) => sum + geo.users, 0)

    // محاسبه آمار دستگاه‌ها
    const totalDeviceUsers = deviceData.reduce((sum, device) => sum + device.users, 0)

    // محاسبه آمار مرورگرها
    const totalBrowserUsers = browserData.reduce((sum, browser) => sum + browser.users, 0)

    // محاسبه آمار ساعات پیک
    const peakHour = hourlyData.reduce((max, hour) => hour.users > max.users ? hour : max, hourlyData[0] || { hour: 0, users: 0 })

    // محاسبه آمار روزهای هفته
    const busiestDay = weeklyData.reduce((max, day) => day.users > max.users ? day : max, weeklyData[0] || { day: 'شنبه', users: 0 })

    const response = {
      overview: {
        totalUsers,
        totalTests,
        totalArticles,
        totalViews,
        monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
        dailyGrowth: {
          users: Math.round(dailyGrowth.users * 100) / 100,
          tests: Math.round(dailyGrowth.tests * 100) / 100,
          articles: Math.round(dailyGrowth.articles * 100) / 100,
          revenue: Math.round(dailyGrowth.revenue * 100) / 100
        }
      },
      userStats: userAnalytics || {
        total: 0,
        active: 0,
        new: 0,
        returning: 0,
        premium: 0,
        free: 0
      },
      testStats: testAnalytics || {
        total: 0,
        completed: 0,
        averageTime: 0,
        completionRate: 0,
        satisfaction: 0
      },
      articleStats: articleAnalytics || {
        total: 0,
        published: 0,
        draft: 0,
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0
      },
      monthlyData,
      categoryData,
      dailyData,
      geoData: {
        countries: topCountries,
        totalUsers: totalGeoUsers
      },
      deviceData: {
        devices: deviceData,
        totalUsers: totalDeviceUsers
      },
      browserData: {
        browsers: browserData,
        totalUsers: totalBrowserUsers
      },
      hourlyData,
      weeklyData,
      insights: {
        peakHour: peakHour.hour,
        busiestDay: busiestDay.day,
        topCategory: categoryData.reduce((max, cat) => cat.views > max.views ? cat : max, categoryData[0] || { category: 'general', views: 0 }).category,
        topCountry: topCountries[0]?.country || 'ایران'
      }
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