import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userEmail = searchParams.get('email')
    
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: 'ایمیل کاربر مورد نیاز است' },
        { status: 400 }
      )
    }

    // پیدا کردن کاربر
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 404 }
      )
    }

    // دریافت نتایج تست‌ها برای محاسبه آمار
    const testResults = await prisma.testResult.findMany({
      where: { userId: user.id }
    })

    // محاسبه آمار یادگیری
    const totalCourses = 12 // تعداد کل دوره‌ها
    const completedCourses = Math.floor(Math.random() * 5) + 3 // 3-7 دوره تکمیل شده
    const totalStudyTime = Math.floor(Math.random() * 200) + 100 // 100-300 دقیقه
    const currentStreak = Math.floor(Math.random() * 20) + 5 // 5-25 روز متوالی
    const longestStreak = Math.max(currentStreak, Math.floor(Math.random() * 30) + 10)
    const averageScore = testResults.length > 0 ? 
      testResults.reduce((sum, t) => sum + t.score, 0) / testResults.length : 
      Math.floor(Math.random() * 20) + 75 // 75-95
    const certificates = Math.floor(completedCourses * 0.7) // 70% از دوره‌های تکمیل شده گواهی دارند
    const totalAchievements = Math.floor(Math.random() * 10) + 5 // 5-15 دستاورد

    const stats = {
      totalCourses,
      completedCourses,
      totalStudyTime,
      currentStreak,
      longestStreak,
      averageScore: Math.round(averageScore),
      certificates,
      achievements: totalAchievements
    }

    // دوره‌های نمونه
    const courses = [
      {
        id: '1',
        title: 'مبانی روان‌شناسی',
        description: 'آشنایی با اصول اولیه روان‌شناسی و کاربردهای آن در زندگی روزمره',
        category: 'psychology',
        level: 'beginner',
        duration: 120,
        progress: 75,
        status: 'in_progress',
        rating: 4.8,
        instructor: 'دکتر احمد محمدی',
        thumbnail: '/images/psychology-basics.jpg',
        tags: ['روان‌شناسی', 'مبانی', 'علمی'],
        createdAt: '2024-01-15T10:00:00Z',
        lastAccessed: '2024-01-20T14:30:00Z'
      },
      {
        id: '2',
        title: 'مدیریت استرس',
        description: 'تکنیک‌های عملی برای کاهش استرس و افزایش آرامش در زندگی',
        category: 'stress',
        level: 'intermediate',
        duration: 90,
        progress: 100,
        status: 'completed',
        rating: 4.9,
        instructor: 'دکتر فاطمه احمدی',
        thumbnail: '/images/stress-management.jpg',
        tags: ['استرس', 'مدیریت', 'آرامش'],
        createdAt: '2024-01-10T09:00:00Z',
        lastAccessed: '2024-01-18T16:45:00Z'
      },
      {
        id: '3',
        title: 'توسعه شخصی',
        description: 'راهکارهای عملی برای رشد شخصی و دستیابی به اهداف',
        category: 'personal',
        level: 'intermediate',
        duration: 180,
        progress: 0,
        status: 'not_started',
        rating: 4.7,
        instructor: 'دکتر علی رضایی',
        thumbnail: '/images/personal-development.jpg',
        tags: ['توسعه شخصی', 'اهداف', 'رشد'],
        createdAt: '2024-01-12T11:00:00Z',
        lastAccessed: null
      },
      {
        id: '4',
        title: 'مدیریت زمان',
        description: 'استراتژی‌های مؤثر برای مدیریت بهتر زمان و افزایش بهره‌وری',
        category: 'time',
        level: 'beginner',
        duration: 60,
        progress: 45,
        status: 'in_progress',
        rating: 4.6,
        instructor: 'دکتر مریم حسینی',
        thumbnail: '/images/time-management.jpg',
        tags: ['زمان', 'بهره‌وری', 'سازماندهی'],
        createdAt: '2024-01-14T08:00:00Z',
        lastAccessed: '2024-01-19T10:15:00Z'
      },
      {
        id: '5',
        title: 'ارتباطات مؤثر',
        description: 'مهارت‌های ارتباطی برای بهبود روابط شخصی و حرفه‌ای',
        category: 'communication',
        level: 'intermediate',
        duration: 150,
        progress: 30,
        status: 'in_progress',
        rating: 4.5,
        instructor: 'دکتر رضا کریمی',
        thumbnail: '/images/effective-communication.jpg',
        tags: ['ارتباطات', 'مهارت', 'روابط'],
        createdAt: '2024-01-16T13:00:00Z',
        lastAccessed: '2024-01-20T09:30:00Z'
      }
    ]

    // مسیرهای یادگیری
    const learningPaths = [
      {
        id: '1',
        title: 'مسیر روان‌شناس',
        description: 'مسیر کامل برای تبدیل شدن به یک روان‌شناس حرفه‌ای',
        courses: ['1', '2', '3'],
        progress: 60,
        estimatedTime: 480,
        difficulty: 'advanced',
        category: 'psychology'
      },
      {
        id: '2',
        title: 'مسیر سلامت روان',
        description: 'مسیر کامل برای حفظ و بهبود سلامت روان',
        courses: ['2', '4', '5'],
        progress: 80,
        estimatedTime: 300,
        difficulty: 'intermediate',
        category: 'wellness'
      }
    ]

    // دستاوردها
    const achievements = [
      {
        id: '1',
        title: 'اولین دوره',
        description: 'اولین دوره خود را تکمیل کردید',
        icon: 'trophy',
        earnedAt: '2024-01-18T15:30:00Z',
        points: 100,
        rarity: 'common'
      },
      {
        id: '2',
        title: 'استمرار',
        description: '7 روز متوالی مطالعه کردید',
        icon: 'flame',
        earnedAt: '2024-01-20T12:00:00Z',
        points: 250,
        rarity: 'rare'
      },
      {
        id: '3',
        title: 'دانشجو نمونه',
        description: 'میانگین امتیاز بالای 90 کسب کردید',
        icon: 'star',
        earnedAt: '2024-01-19T14:20:00Z',
        points: 500,
        rarity: 'epic'
      },
      {
        id: '4',
        title: 'استاد',
        description: '10 دوره تکمیل کردید',
        icon: 'crown',
        earnedAt: null,
        points: 1000,
        rarity: 'legendary'
      }
    ]

    return NextResponse.json({
      success: true,
      courses: courses,
      learningPaths: learningPaths,
      achievements: achievements,
      stats: stats
    })
    
  } catch (error) {
    console.error('Error fetching learning data:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت داده‌های یادگیری' },
      { status: 500 }
    )
  }
}
