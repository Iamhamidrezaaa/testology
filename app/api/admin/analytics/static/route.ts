import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const response = {
      overview: {
        totalUsers: 15420,
        totalTests: 23450,
        totalArticles: 103,
        totalViews: 125670
      },
      userStats: {
        total: 15420,
        active: 8930,
        new: 2340,
        returning: 6590,
        premium: 1230,
        free: 14190
      },
      testStats: {
        total: 45,
        completed: 23450,
        averageTime: 12.5,
        completionRate: 78.5,
        satisfaction: 4.2
      },
      articleStats: {
        total: 103,
        published: 102,
        draft: 1,
        views: 125670,
        likes: 8930,
        shares: 2340,
        comments: 1560
      },
      monthlyData: [
        { month: 'فروردین', users: 1200, tests: 2500, articles: 15, revenue: 45000 },
        { month: 'اردیبهشت', users: 1350, tests: 2800, articles: 18, revenue: 52000 },
        { month: 'خرداد', users: 1500, tests: 3200, articles: 22, revenue: 58000 },
        { month: 'تیر', users: 1650, tests: 3500, articles: 25, revenue: 62000 },
        { month: 'مرداد', users: 1800, tests: 3800, articles: 28, revenue: 68000 },
        { month: 'شهریور', users: 1950, tests: 4100, articles: 32, revenue: 72000 },
        { month: 'مهر', users: 2100, tests: 4400, articles: 35, revenue: 78000 },
        { month: 'آبان', users: 2250, tests: 4700, articles: 38, revenue: 82000 },
        { month: 'آذر', users: 2400, tests: 5000, articles: 42, revenue: 88000 },
        { month: 'دی', users: 2550, tests: 5300, articles: 45, revenue: 92000 },
        { month: 'بهمن', users: 2700, tests: 5600, articles: 48, revenue: 98000 },
        { month: 'اسفند', users: 2850, tests: 5900, articles: 52, revenue: 102000 }
      ],
      geoData: [
        { country: 'ایران', users: 8540, percentage: 55.4 },
        { country: 'آمریکا', users: 2340, percentage: 15.2 },
        { country: 'کانادا', users: 1890, percentage: 12.3 },
        { country: 'آلمان', users: 1230, percentage: 8.0 },
        { country: 'انگلستان', users: 890, percentage: 5.8 },
        { country: 'سایر', users: 530, percentage: 3.4 }
      ],
      deviceData: [
        { device: 'موبایل', users: 9250, percentage: 60.0 },
        { device: 'دسکتاپ', users: 4620, percentage: 30.0 },
        { device: 'تبلت', users: 1550, percentage: 10.0 }
      ],
      browserData: [
        { browser: 'Chrome', users: 9250, percentage: 60.0 },
        { browser: 'Safari', users: 3080, percentage: 20.0 },
        { browser: 'Firefox', users: 1540, percentage: 10.0 },
        { browser: 'Edge', users: 770, percentage: 5.0 },
        { browser: 'سایر', users: 780, percentage: 5.0 }
      ],
      hourlyData: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        users: Math.floor(Math.random() * 200) + 50,
        tests: Math.floor(Math.random() * 100) + 20
      })),
      weeklyData: [
        { day: 'شنبه', users: 2340, tests: 1230 },
        { day: 'یکشنبه', users: 2890, tests: 1450 },
        { day: 'دوشنبه', users: 3120, tests: 1670 },
        { day: 'سه‌شنبه', users: 2980, tests: 1520 },
        { day: 'چهارشنبه', users: 2750, tests: 1380 },
        { day: 'پنج‌شنبه', users: 2340, tests: 1200 },
        { day: 'جمعه', users: 1890, tests: 950 }
      ]
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







