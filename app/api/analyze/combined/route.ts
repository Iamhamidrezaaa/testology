import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // دریافت تمام نتایج تست‌های کاربر
    const testResults = await prisma.testResult.findMany({
      where: { 
        userId,
        completed: true 
      },
      orderBy: { createdAt: 'desc' }
    })

    if (testResults.length === 0) {
      return NextResponse.json({ 
        error: 'No test results found',
        message: 'ابتدا باید حداقل یک تست انجام دهید'
      }, { status: 404 })
    }

    // دریافت ورودی‌های احساسات
    const moodEntries = await prisma.moodEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30 // آخرین ۳۰ ورودی
    })

    // آماده‌سازی داده‌ها برای تحلیل
    const analysisData = {
      testResults: testResults.map(result => ({
        testName: result.testName,
        testSlug: result.testSlug,
        score: result.score,
        resultText: result.resultText,
        createdAt: result.createdAt
      })),
      moodEntries: moodEntries.map(entry => ({
        mood: entry.mood,
        note: entry.note,
        date: entry.date
      })),
      userProfile: await prisma.userProfile.findUnique({
        where: { userId },
        select: {
          level: true,
          xp: true,
          totalPoints: true
        }
      })
    }

    // تحلیل ترکیبی با GPT
    const combinedReport = await generateCombinedAnalysis(analysisData)
    
    // تولید نمودار داده‌ها
    const chartData = generateChartData(testResults, moodEntries)
    
    // تعیین سطح ریسک
    const riskLevel = determineRiskLevel(analysisData)
    
    // تولید پیشنهادات
    const recommendations = generateRecommendations(analysisData)

    // ذخیره در دیتابیس
    const mentalHealthProfile = await prisma.mentalHealthProfile.upsert({
      where: { userId },
      update: {
        combinedReport,
        chartData,
        insights: JSON.stringify(analysisData),
        recommendations,
        riskLevel,
        updatedAt: new Date()
      },
      create: {
        userId,
        combinedReport,
        chartData,
        insights: JSON.stringify(analysisData),
        recommendations,
        riskLevel
      }
    })

    return NextResponse.json({
      success: true,
      combinedReport,
      chartData,
      riskLevel,
      recommendations,
      stats: {
        totalTests: testResults.length,
        totalMoodEntries: moodEntries.length,
        lastTestDate: testResults[0]?.createdAt,
        lastMoodDate: moodEntries[0]?.date
      }
    })

  } catch (error) {
    console.error('Error in combined analysis:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generateCombinedAnalysis(data: any): Promise<string> {
  // شبیه‌سازی تحلیل GPT (در واقعیت باید با OpenAI API ارتباط برقرار کرد)
  const { testResults, moodEntries, userProfile } = data
  
  let analysis = "## تحلیل ترکیبی وضعیت روان‌شناسی شما\n\n"
  
  // تحلیل تست‌ها
  analysis += "### نتایج تست‌های انجام شده:\n"
  testResults.forEach((test: any, index: number) => {
    analysis += `${index + 1}. **${test.testName}**: ${test.resultText}\n`
  })
  
  // تحلیل احساسات
  if (moodEntries.length > 0) {
    analysis += "\n### الگوی احساسات شما:\n"
    const moodCounts = moodEntries.reduce((acc: any, entry: any) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1
      return acc
    }, {})
    
    Object.entries(moodCounts).forEach(([mood, count]) => {
      analysis += `- ${mood}: ${count} بار\n`
    })
  }
  
  // تحلیل کلی
  analysis += "\n### تحلیل کلی:\n"
  analysis += "بر اساس نتایج تست‌ها و ثبت احساسات شما، وضعیت روان‌شناختی شما نشان‌دهنده موارد زیر است:\n\n"
  
  // تحلیل بر اساس نوع تست‌ها
  const testTypes = testResults.map((t: any) => t.testSlug)
  if (testTypes.includes('rosenberg')) {
    analysis += "• عزت نفس شما در سطح مناسبی قرار دارد\n"
  }
  if (testTypes.includes('anxiety')) {
    analysis += "• سطح اضطراب شما قابل مدیریت است\n"
  }
  if (testTypes.includes('depression')) {
    analysis += "• نشانه‌های افسردگی در شما در حد طبیعی است\n"
  }
  
  // پیشنهادات
  analysis += "\n### پیشنهادات:\n"
  analysis += "• ادامه انجام تست‌های منظم\n"
  analysis += "• ثبت روزانه احساسات\n"
  analysis += "• مشاوره با متخصص در صورت نیاز\n"
  
  return analysis
}

function generateChartData(testResults: any[], moodEntries: any[]) {
  const chartData = []
  
  // ترکیب داده‌های تست و احساسات
  const allDates = new Set([
    ...testResults.map(t => t.createdAt.toISOString().split('T')[0]),
    ...moodEntries.map(m => m.date.toISOString().split('T')[0])
  ])
  
  Array.from(allDates).sort().forEach(date => {
    const dayTests = testResults.filter(t => 
      t.createdAt.toISOString().split('T')[0] === date
    )
    const dayMoods = moodEntries.filter(m => 
      m.date.toISOString().split('T')[0] === date
    )
    
    chartData.push({
      date,
      tests: dayTests.length,
      averageScore: dayTests.length > 0 
        ? dayTests.reduce((sum, t) => sum + t.score, 0) / dayTests.length 
        : 0,
      mood: dayMoods[0]?.mood || null,
      moodValue: getMoodValue(dayMoods[0]?.mood)
    })
  })
  
  return chartData
}

function getMoodValue(mood: string): number {
  const moodValues: Record<string, number> = {
    '😊': 5,
    '😐': 3,
    '😢': 1,
    '😠': 2,
    '😴': 4
  }
  return moodValues[mood] || 3
}

function determineRiskLevel(data: any): string {
  const { testResults, moodEntries } = data
  
  // تحلیل ساده بر اساس امتیازات
  const avgScore = testResults.reduce((sum: number, test: any) => sum + test.score, 0) / testResults.length
  
  if (avgScore < 30) return 'high'
  if (avgScore < 60) return 'medium'
  return 'low'
}

function generateRecommendations(data: any): string {
  const { testResults, moodEntries, userProfile } = data
  
  let recommendations = "### پیشنهادات شخصی‌سازی شده:\n\n"
  
  // بر اساس نوع تست‌ها
  const testTypes = testResults.map((t: any) => t.testSlug)
  
  if (testTypes.includes('rosenberg')) {
    recommendations += "• تمرینات تقویت عزت نفس\n"
  }
  if (testTypes.includes('anxiety')) {
    recommendations += "• تکنیک‌های مدیریت اضطراب\n"
  }
  if (testTypes.includes('depression')) {
    recommendations += "• فعالیت‌های مثبت و انگیزه‌بخش\n"
  }
  
  // بر اساس احساسات
  if (moodEntries.length > 0) {
    const recentMoods = moodEntries.slice(0, 7).map((m: any) => m.mood)
    const negativeMoods = recentMoods.filter((m: string) => ['😢', '😠'].includes(m))
    
    if (negativeMoods.length > 3) {
      recommendations += "• مشاوره با روان‌شناس\n"
      recommendations += "• تمرینات آرام‌سازی\n"
    }
  }
  
  // بر اساس سطح کاربر
  if (userProfile && userProfile.level < 5) {
    recommendations += "• انجام تست‌های بیشتر برای شناخت بهتر\n"
  }
  
  return recommendations
}