import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userEmail = searchParams?.get('email')
    
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

    // دریافت نتایج تست‌ها
    const testResults = await prisma.testResult.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    // دریافت داده‌های خلق و خو
    const moodData = await prisma.moodAggregate.findMany({
      where: { userCount: 1 },
      orderBy: { recordedAt: 'desc' }
    })

    // تحلیل بینش‌های رفتاری
    const insights = []

    // تحلیل اضطراب
    const anxietyTests = testResults.filter((r: any) => 
      r.testName.includes('اضطراب') || r.testName.includes('anxiety')
    )
    if (anxietyTests.length > 0) {
      const avgAnxiety = anxietyTests.reduce((sum: any, t: any) => sum + t.score, 0) / anxietyTests.length
      insights.push({
        id: 'anxiety_insight',
        category: 'anxiety',
        title: 'تحلیل اضطراب',
        description: `سطح اضطراب شما ${avgAnxiety.toFixed(1)} است. ${avgAnxiety > 70 ? 'نیاز به توجه فوری' : avgAnxiety > 50 ? 'نیاز به مدیریت' : 'در محدوده قابل قبول'}.`,
        confidence: 85,
        impact: avgAnxiety > 70 ? 'high' : avgAnxiety > 50 ? 'medium' : 'low',
        trend: 'stable',
        recommendation: avgAnxiety > 70 ? 'مشاوره با روان‌شناس توصیه می‌شود' : 'تمرینات آرامش‌بخش انجام دهید',
        createdAt: new Date().toISOString(),
        tags: ['اضطراب', 'مدیریت استرس']
      })
    }

    // تحلیل افسردگی
    const depressionTests = testResults.filter((r: any) => 
      r.testName.includes('افسردگی') || r.testName.includes('depression')
    )
    if (depressionTests.length > 0) {
      const avgDepression = depressionTests.reduce((sum: any, t: any) => sum + t.score, 0) / depressionTests.length
      insights.push({
        id: 'depression_insight',
        category: 'mood',
        title: 'تحلیل خلق و خو',
        description: `نمره خلق و خوی شما ${avgDepression.toFixed(1)} است. ${avgDepression > 60 ? 'نیاز به توجه' : 'وضعیت مطلوب'}.`,
        confidence: 80,
        impact: avgDepression > 60 ? 'high' : 'medium',
        trend: 'stable',
        recommendation: avgDepression > 60 ? 'فعالیت‌های مثبت و ورزش منظم' : 'ادامه روند فعلی',
        createdAt: new Date().toISOString(),
        tags: ['خلق و خو', 'افسردگی']
      })
    }

    // تحلیل شخصیت
    const personalityTests = testResults.filter((r: any) => 
      r.testName.includes('شخصیت') || r.testName.includes('personality')
    )
    if (personalityTests.length > 0) {
      insights.push({
        id: 'personality_insight',
        category: 'personality',
        title: 'تحلیل شخصیت',
        description: 'شخصیت شما از تعادل خوبی برخوردار است. نقاط قوت شما در برون‌گرایی و وجدان‌گرایی است.',
        confidence: 90,
        impact: 'medium',
        trend: 'stable',
        recommendation: 'از نقاط قوت خود در روابط و کار استفاده کنید',
        createdAt: new Date().toISOString(),
        tags: ['شخصیت', 'نقاط قوت']
      })
    }

    // تحلیل الگوهای خلق و خو
    if (moodData.length > 0) {
      const moodTypes = moodData.map((m: any) => m.moodType)
      const mostCommonMood = moodTypes.reduce((a, b, i, arr) => 
        arr.filter((v: any) => v === a).length >= arr.filter((v: any) => v === b).length ? a : b
      )
      
      insights.push({
        id: 'mood_pattern_insight',
        category: 'mood',
        title: 'الگوی خلق و خو',
        description: `الگوی غالب خلق و خوی شما "${mostCommonMood}" است. این نشان‌دهنده ثبات عاطفی شماست.`,
        confidence: 75,
        impact: 'medium',
        trend: 'stable',
        recommendation: 'ادامه فعالیت‌هایی که باعث بهبود خلق و خو می‌شوند',
        createdAt: new Date().toISOString(),
        tags: ['الگوهای رفتاری', 'خلق و خو']
      })
    }

    // تحلیل پیشرفت
    const recentTests = testResults.slice(0, 5)
    const olderTests = testResults.slice(5, 10)
    
    if (recentTests.length > 0 && olderTests.length > 0) {
      const recentAvg = recentTests.reduce((sum: any, t: any) => sum + t.score, 0) / recentTests.length
      const olderAvg = olderTests.reduce((sum: any, t: any) => sum + t.score, 0) / olderTests.length
      const improvement = recentAvg - olderAvg
      
      insights.push({
        id: 'progress_insight',
        category: 'progress',
        title: 'تحلیل پیشرفت',
        description: `پیشرفت شما ${improvement > 0 ? '+' : ''}${improvement.toFixed(1)} امتیاز است. ${improvement > 0 ? 'بهبود قابل توجه' : improvement < -5 ? 'نیاز به توجه' : 'ثبات نسبی'}.`,
        confidence: 85,
        impact: Math.abs(improvement) > 10 ? 'high' : 'medium',
        trend: improvement > 0 ? 'improving' : improvement < -5 ? 'declining' : 'stable',
        recommendation: improvement > 0 ? 'ادامه روند مثبت' : 'بررسی عوامل مؤثر',
        createdAt: new Date().toISOString(),
        tags: ['پیشرفت', 'تحلیل روند']
      })
    }

    // ویژگی‌های شخصیتی (نمونه)
    const personalityTraits = [
      {
        name: 'برون‌گرایی',
        score: 75,
        description: 'شما فردی اجتماعی و فعال هستید',
        color: '#3b82f6'
      },
      {
        name: 'وجدان‌گرایی',
        score: 85,
        description: 'شما فردی مسئول و منظم هستید',
        color: '#10b981'
      },
      {
        name: 'باز بودن به تجربه',
        score: 70,
        description: 'شما فردی خلاق و کنجکاو هستید',
        color: '#8b5cf6'
      },
      {
        name: 'توافق‌پذیری',
        score: 80,
        description: 'شما فردی همدل و مهربان هستید',
        color: '#f59e0b'
      },
      {
        name: 'روان‌رنجوری',
        score: 40,
        description: 'شما فردی آرام و متعادل هستید',
        color: '#ef4444'
      }
    ]

    // الگوهای رفتاری (نمونه)
    const behavioralPatterns = [
      {
        pattern: 'اضطراب صبحگاهی',
        frequency: 85,
        intensity: 70,
        context: 'ساعات 6-9 صبح',
        suggestion: 'تمرینات تنفسی و مدیتیشن صبحگاهی'
      },
      {
        pattern: 'افزایش انرژی عصر',
        frequency: 90,
        intensity: 80,
        context: 'ساعات 4-7 عصر',
        suggestion: 'انجام کارهای مهم در این ساعات'
      },
      {
        pattern: 'کاهش تمرکز بعد از ناهار',
        frequency: 75,
        intensity: 60,
        context: 'ساعات 1-3 بعدازظهر',
        suggestion: 'استراحت کوتاه و تغذیه مناسب'
      },
      {
        pattern: 'بهبود خلق در طبیعت',
        frequency: 95,
        intensity: 85,
        context: 'فضای باز و طبیعت',
        suggestion: 'افزایش زمان حضور در طبیعت'
      }
    ]

    // معیارهای پیشرفت (نمونه)
    const progressMetrics = [
      {
        metric: 'مدیریت اضطراب',
        current: 75,
        previous: 60,
        change: 15,
        target: 80,
        unit: '%'
      },
      {
        metric: 'تمرکز',
        current: 70,
        previous: 65,
        change: 5,
        target: 85,
        unit: '%'
      },
      {
        metric: 'عزت نفس',
        current: 80,
        previous: 75,
        change: 5,
        target: 90,
        unit: '%'
      },
      {
        metric: 'انگیزه',
        current: 85,
        previous: 80,
        change: 5,
        target: 95,
        unit: '%'
      }
    ]

    return NextResponse.json({
      success: true,
      insights: insights,
      personalityTraits: personalityTraits,
      behavioralPatterns: behavioralPatterns,
      progressMetrics: progressMetrics,
      stats: {
        totalInsights: insights.length,
        confidence: insights.length > 0 ? 
          insights.reduce((sum: any, i: any) => sum + i.confidence, 0) / insights.length : 0,
        categories: Array.from(new Set(insights.map((i: any) => i.category))),
        trends: {
          improving: insights.filter((i: any) => i.trend === 'improving').length,
          stable: insights.filter((i: any) => i.trend === 'stable').length,
          declining: insights.filter((i: any) => i.trend === 'declining').length
        }
      }
    })
    
  } catch (error) {
    console.error('Error fetching behavioral insights:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت بینش‌های رفتاری' },
      { status: 500 }
    )
  }
}

