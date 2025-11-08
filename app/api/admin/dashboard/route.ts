import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, startOfWeek, startOfMonth, startOfYear } from 'date-fns'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || 'month'

    // تعیین بازه زمانی بر اساس فیلتر
    let startDate: Date
    const now = new Date()
    switch (timeRange) {
      case 'day':
        startDate = startOfDay(now)
        break
      case 'week':
        startDate = startOfWeek(now)
        break
      case 'month':
        startDate = startOfMonth(now)
        break
      case 'year':
        startDate = startOfYear(now)
        break
      default:
        startDate = startOfMonth(now)
    }

    // دریافت آمار کلی
    const [totalUsers, totalTestsTaken, totalFeedbacks] = await Promise.all([
      prisma.user.count().catch(() => 0),
      // prisma.testResult.count(), // مدل testResult هنوز generate نشده
      0, // Mock data
      // prisma.comment.count(), // مدل comment هنوز generate نشده
      0, // Mock data
    ])
    
    const totalArticles = 0 // TODO: Implement when post model is added

    // دریافت آمار کاربران در بازه زمانی
    const userStats = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: startDate
        }
      },
      _count: true,
      orderBy: {
        createdAt: 'asc'
      }
    }).catch(() => [])

    // دریافت تست‌های محبوب
    // const popularTests = await prisma.testResult.groupBy({
    //   by: ['testName'],
    //   where: {
    //     createdAt: {
    //       gte: startDate
    //     }
    //   },
    //   _count: true,
    //   orderBy: {
    //     _count: {
    //       testName: 'desc'
    //     }
    //   },
    //   take: 5
    // })
    const popularTests: any[] = [] // Mock data

    // دریافت توزیع تست‌ها بر اساس دسته‌بندی
    // TODO: Implement when testMetadata model is added
    const testDistribution: any[] = []

    // دریافت فعالیت‌های اخیر
    const recentActivities = await Promise.all([
      // کاربران جدید
      prisma.user.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          createdAt: true
        }
      }).catch(() => []),
      // تست‌های جدید
      // TODO: Implement when testMetadata model is added
      Promise.resolve([]),
      // نظرات جدید
      // prisma.comment.findMany({
      //   take: 2,
      //   orderBy: { createdAt: 'desc' },
      //   select: {
      //     id: true,
      //     content: true,
      //     createdAt: true
      //   }
      // }),
      Promise.resolve([]), // Mock data
      // مقالات جدید
      // TODO: Implement when post model is added
      Promise.resolve([])
    ])

    // تبدیل داده‌ها به فرمت مورد نیاز
    const formattedUserStats = userStats.map((stat: any) => ({
      date: stat.createdAt.toLocaleDateString('fa-IR'),
      count: stat._count
    }))

    const formattedPopularTests = popularTests.map((test: any) => ({
      name: test.testName,
      count: test._count
    }))

    const formattedTestDistribution = testDistribution.map((dist: any) => ({
      category: dist.tags[0] || 'بدون دسته‌بندی',
      count: dist._count
    }))

    const formattedActivities = [
      ...recentActivities[0].map((user: any) => ({
        id: user.id,
        type: 'user' as const,
        title: 'کاربر جدید',
        description: `${user.name || 'کاربر'} به سایت پیوست`,
        time: user.createdAt.toISOString()
      })),
      // TODO: Implement when testMetadata model is added
      // ...recentActivities[1].map(test => ({
      //   id: test.id,
      //   type: 'test' as const,
      //   title: 'تست جدید',
      //   description: `تست ${test.title} اضافه شد`,
      //   time: test.createdAt.toISOString()
      // })),
      // ...recentActivities[2].map((comment: any) => ({
      //   id: comment.id,
      //   type: 'comment' as const,
      //   title: 'نظر جدید',
      //   description: comment.content.substring(0, 50) + '...',
      //   time: comment.createdAt.toISOString()
      // })),
      // TODO: Implement when post model is added
      // ...recentActivities[3].map(post => ({
      //   id: post.id,
      //   type: 'article' as const,
      //   title: 'مقاله جدید',
      //   description: `مقاله "${post.title}" منتشر شد`,
      //   time: post.createdAt.toISOString()
      // }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5)

    return NextResponse.json({
      totalUsers,
      totalTestsTaken,
      totalFeedbacks,
      totalArticles,
      userStats: formattedUserStats,
      popularTests: formattedPopularTests,
      testDistribution: formattedTestDistribution,
      recentActivities: formattedActivities
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات داشبورد' },
      { status: 500 }
    )
  }
} 
