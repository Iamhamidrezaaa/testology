import { prisma } from '@/lib/prisma'

interface RecommendationResult {
  contentId: string
  reason: string
  priority: number
}

export async function analyzeUserHistory(userId: string): Promise<RecommendationResult> {
  try {
    // دریافت اطلاعات کاربر
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true
      }
    })

    // دریافت mood log های اخیر
    const recentMoods = await prisma.moodLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 7 // آخرین 7 روز
    })

    // دریافت نتایج تست‌های اخیر
    const recentTests = await prisma.testResult.findMany({
      where: { userId, completed: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    // دریافت تمرین‌های قبلی
    const previousAssignments = await prisma.weeklyAssignment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // تحلیل وضعیت کاربر
    const analysis = analyzeUserState(recentMoods, recentTests, previousAssignments)
    
    // تولید پیشنهاد بر اساس تحلیل
    const recommendation = await generateRecommendation(analysis, userId)
    
    return recommendation

  } catch (error) {
    console.error('Error analyzing user history:', error)
    // پیشنهاد پیش‌فرض در صورت خطا
    return {
      contentId: 'default-breathing-exercise',
      reason: 'تمرین تنفسی برای آرامش و کاهش استرس',
      priority: 3
    }
  }
}

function analyzeUserState(moods: any[], tests: any[], assignments: any[]) {
  // تحلیل mood ها
  const moodAnalysis = {
    averageEnergy: moods.reduce((sum, mood) => sum + (mood.energy || 5), 0) / moods.length || 5,
    averageStress: moods.reduce((sum, mood) => sum + (mood.stress || 5), 0) / moods.length || 5,
    averageSleep: moods.reduce((sum, mood) => sum + (mood.sleepHour || 8), 0) / moods.length || 8,
    exerciseDays: moods.filter(mood => mood.exercise).length,
    meditationDays: moods.filter(mood => mood.meditation).length,
    dominantMood: getDominantMood(moods)
  }

  // تحلیل تست‌ها
  const testAnalysis = {
    averageScore: tests.reduce((sum, test) => sum + test.score, 0) / tests.length || 0,
    testTypes: tests.map(test => test.testName),
    recentTrend: getTestTrend(tests)
  }

  // تحلیل تمرین‌ها
  const assignmentAnalysis = {
    completedCount: assignments.filter(a => a.status === 'completed').length,
    inProgressCount: assignments.filter(a => a.status === 'in_progress').length,
    categories: assignments.map(a => a.contentId)
  }

  return {
    mood: moodAnalysis,
    tests: testAnalysis,
    assignments: assignmentAnalysis,
    overallState: determineOverallState(moodAnalysis, testAnalysis, assignmentAnalysis)
  }
}

function getDominantMood(moods: any[]): string {
  const moodCounts = moods.reduce((acc, mood) => {
    acc[mood.mood] = (acc[mood.mood] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || '😐'
}

function getTestTrend(tests: any[]): string {
  if (tests.length < 2) return 'stable'
  
  const recent = tests.slice(0, 2)
  const older = tests.slice(2, 4)
  
  if (recent.length === 0 || older.length === 0) return 'stable'
  
  const recentAvg = recent.reduce((sum, test) => sum + test.score, 0) / recent.length
  const olderAvg = older.reduce((sum, test) => sum + test.score, 0) / older.length
  
  if (recentAvg > olderAvg + 5) return 'improving'
  if (recentAvg < olderAvg - 5) return 'declining'
  return 'stable'
}

function determineOverallState(mood: any, tests: any, assignments: any): string {
  // الگوریتم ساده برای تعیین وضعیت کلی
  if (mood.averageEnergy < 4 || mood.averageStress > 7) {
    return 'stressed'
  }
  if (mood.exerciseDays < 2 && mood.meditationDays < 2) {
    return 'inactive'
  }
  if (tests.averageScore < 30) {
    return 'needs_support'
  }
  if (assignments.completedCount > 5) {
    return 'active'
  }
  return 'balanced'
}

async function generateRecommendation(analysis: any, userId: string): Promise<RecommendationResult> {
  const { mood, tests, assignments, overallState } = analysis

  // دریافت محتوای موجود
  const availableContent = await prisma.marketplaceItem.findMany({
    where: {
      type: { in: ['exercise', 'meditation', 'worksheet'] },
      category: { in: ['anxiety', 'depression', 'stress', 'general'] }
    },
    take: 20
  })

  // الگوریتم پیشنهاد بر اساس وضعیت
  let recommendedContent = null
  let reason = ''
  let priority = 3

  switch (overallState) {
    case 'stressed':
      recommendedContent = availableContent.find(c => 
        c.category === 'stress' && c.type === 'meditation'
      ) || availableContent.find(c => c.category === 'anxiety')
      reason = 'بر اساس سطح استرس بالا و انرژی پایین، تمرین آرامش پیشنهاد می‌شود'
      priority = 5
      break

    case 'inactive':
      recommendedContent = availableContent.find(c => 
        c.type === 'exercise' && c.difficulty === 'beginner'
      ) || availableContent.find(c => c.category === 'general')
      reason = 'برای افزایش فعالیت و بهبود وضعیت کلی، تمرین سبک پیشنهاد می‌شود'
      priority = 4
      break

    case 'needs_support':
      recommendedContent = availableContent.find(c => 
        c.category === 'depression' || c.category === 'anxiety'
      ) || availableContent.find(c => c.type === 'worksheet')
      reason = 'بر اساس نتایج تست‌ها، محتوای تخصصی برای بهبود وضعیت روانی پیشنهاد می‌شود'
      priority = 5
      break

    case 'active':
      recommendedContent = availableContent.find(c => 
        c.difficulty === 'intermediate' || c.difficulty === 'advanced'
      ) || availableContent.find(c => c.type === 'exercise')
      reason = 'با توجه به پیشرفت خوب شما، تمرین پیشرفته‌تر پیشنهاد می‌شود'
      priority = 3
      break

    default: // balanced
      recommendedContent = availableContent.find(c => 
        c.category === 'general' && c.type === 'meditation'
      ) || availableContent[0]
      reason = 'تمرین متعادل برای حفظ وضعیت خوب شما'
      priority = 2
      break
  }

  // اگر محتوای مناسب پیدا نشد، محتوای پیش‌فرض
  if (!recommendedContent) {
    recommendedContent = availableContent[0] || {
      id: 'default-content',
      title: 'تمرین تنفسی پایه',
      category: 'general',
      type: 'meditation'
    }
    reason = 'تمرین پایه برای شروع'
    priority = 1
  }

  return {
    contentId: recommendedContent.id,
    reason,
    priority
  }
}

// تابع کمکی برای تولید پیشنهادات دسته‌ای
export async function generateBulkRecommendations(userIds: string[]): Promise<Record<string, RecommendationResult>> {
  const results: Record<string, RecommendationResult> = {}
  
  for (const userId of userIds) {
    try {
      results[userId] = await analyzeUserHistory(userId)
    } catch (error) {
      console.error(`Error generating recommendation for user ${userId}:`, error)
      results[userId] = {
        contentId: 'default-content',
        reason: 'پیشنهاد پیش‌فرض',
        priority: 1
      }
    }
  }
  
  return results
}
















