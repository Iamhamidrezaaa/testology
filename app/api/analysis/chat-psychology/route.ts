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

    // دریافت داده‌ها از localStorage (از طریق client-side)
    // این API باید از client-side فراخوانی شود تا به localStorage دسترسی داشته باشد
    return NextResponse.json({
      success: true,
      message: 'لطفاً از client-side فراخوانی کنید'
    })
    
  } catch (error) {
    console.error('Error in psychological analysis:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در تحلیل روانشناختی' },
      { status: 500 }
    )
  }
}

// تحلیل محتوای چت‌ها
function analyzeChatContent(chats: any[]) {
  const allMessages = chats.flatMap(chat => JSON.parse(chat.messages))
  const userMessages = allMessages.filter(msg => msg.role === 'user')
  
  // تحلیل احساسات
  const emotions = analyzeEmotions(userMessages)
  
  // تحلیل کلمات کلیدی
  const keywords = extractKeywords(userMessages)
  
  // تحلیل الگوهای گفتگو
  const patterns = analyzeConversationPatterns(userMessages)
  
  // تحلیل سطح اضطراب
  const anxietyLevel = analyzeAnxietyLevel(userMessages)
  
  // تحلیل اعتماد به نفس
  const confidenceLevel = analyzeConfidenceLevel(userMessages)

  return {
    emotions,
    keywords,
    patterns,
    anxietyLevel,
    confidenceLevel,
    totalMessages: userMessages.length,
    averageMessageLength: userMessages.reduce((sum, msg) => sum + msg.text.length, 0) / userMessages.length
  }
}

// تحلیل نتایج تست‌ها
function analyzeTestResults(testResults: any[]) {
  const scores = testResults.map(result => ({
    testType: result.testType,
    score: result.score,
    date: result.createdAt
  }))

  // تحلیل روند تغییرات
  const trends = analyzeScoreTrends(scores)
  
  // تحلیل نقاط قوت و ضعف
  const strengths = identifyStrengths(scores)
  const weaknesses = identifyWeaknesses(scores)
  
  // تحلیل سازگاری
  const consistency = analyzeConsistency(scores)

  return {
    trends,
    strengths,
    weaknesses,
    consistency,
    totalTests: testResults.length,
    averageScore: scores.reduce((sum, score) => sum + score.score, 0) / scores.length
  }
}

// ترکیب تحلیل‌ها
function combineAnalyses(chatAnalysis: any, testAnalysis: any) {
  return {
    overallMood: calculateOverallMood(chatAnalysis.emotions, testAnalysis.trends),
    personalityTraits: identifyPersonalityTraits(chatAnalysis, testAnalysis),
    mentalHealthIndicators: assessMentalHealthIndicators(chatAnalysis, testAnalysis),
    riskFactors: identifyRiskFactors(chatAnalysis, testAnalysis),
    protectiveFactors: identifyProtectiveFactors(chatAnalysis, testAnalysis),
    recommendedActions: generateRecommendedActions(chatAnalysis, testAnalysis),
    keyInsights: generateKeyInsights(chatAnalysis, testAnalysis),
    recommendations: generateRecommendations(chatAnalysis, testAnalysis)
  }
}

// تحلیل احساسات
function analyzeEmotions(messages: any[]) {
  const emotionKeywords = {
    happy: ['خوشحال', 'خوب', 'عالی', 'ممنون', 'شاد'],
    sad: ['غمگین', 'ناراحت', 'غم', 'درد', 'غمگین'],
    anxious: ['نگران', 'اضطراب', 'ترس', 'نگرانی', 'استرس'],
    angry: ['عصبانی', 'خشم', 'ناراحت', 'عصبانی'],
    calm: ['آرام', 'راحت', 'آسوده', 'آرامش']
  }

  const emotions = { happy: 0, sad: 0, anxious: 0, angry: 0, calm: 0 }
  
  messages.forEach(message => {
    Object.keys(emotionKeywords).forEach(emotion => {
      emotionKeywords[emotion as keyof typeof emotionKeywords].forEach(keyword => {
        if (message.text.includes(keyword)) {
          emotions[emotion as keyof typeof emotions]++
        }
      })
    })
  })

  return emotions
}

// استخراج کلمات کلیدی
function extractKeywords(messages: any[]) {
  const allText = messages.map(msg => msg.text).join(' ')
  const words = allText.split(/\s+/)
  const wordCount: { [key: string]: number } = {}
  
  words.forEach(word => {
    if (word.length > 3) {
      wordCount[word] = (wordCount[word] || 0) + 1
    }
  })

  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }))
}

// تحلیل الگوهای گفتگو
function analyzeConversationPatterns(messages: any[]) {
  return {
    averageResponseTime: 'normal', // شبیه‌سازی
    questionFrequency: messages.filter(msg => msg.text.includes('؟')).length / messages.length,
    exclamationFrequency: messages.filter(msg => msg.text.includes('!')).length / messages.length,
    averageMessageLength: messages.reduce((sum, msg) => sum + msg.text.length, 0) / messages.length
  }
}

// تحلیل سطح اضطراب
function analyzeAnxietyLevel(messages: any[]) {
  const anxietyKeywords = ['نگران', 'اضطراب', 'ترس', 'نگرانی', 'استرس', 'دلهره']
  const anxietyCount = messages.filter(msg => 
    anxietyKeywords.some(keyword => msg.text.includes(keyword))
  ).length
  
  if (anxietyCount / messages.length > 0.3) return 'high'
  if (anxietyCount / messages.length > 0.1) return 'medium'
  return 'low'
}

// تحلیل اعتماد به نفس
function analyzeConfidenceLevel(messages: any[]) {
  const confidenceKeywords = ['مطمئن', 'اعتماد', 'قدرت', 'توانایی', 'موفق']
  const confidenceCount = messages.filter(msg => 
    confidenceKeywords.some(keyword => msg.text.includes(keyword))
  ).length
  
  if (confidenceCount / messages.length > 0.2) return 'high'
  if (confidenceCount / messages.length > 0.05) return 'medium'
  return 'low'
}

// تحلیل روند تغییرات
function analyzeScoreTrends(scores: any[]) {
  if (scores.length < 2) return 'insufficient_data'
  
  const recent = scores.slice(0, 3)
  const older = scores.slice(3, 6)
  
  const recentAvg = recent.reduce((sum, score) => sum + score.score, 0) / recent.length
  const olderAvg = older.length > 0 ? older.reduce((sum, score) => sum + score.score, 0) / older.length : recentAvg
  
  if (recentAvg > olderAvg * 1.1) return 'improving'
  if (recentAvg < olderAvg * 0.9) return 'declining'
  return 'stable'
}

// شناسایی نقاط قوت
function identifyStrengths(scores: any[]) {
  const strengths: string[] = []
  
  scores.forEach(score => {
    if (score.score > 80) {
      strengths.push(score.testType)
    }
  })
  
  return Array.from(new Set(strengths))
}

// شناسایی نقاط ضعف
function identifyWeaknesses(scores: any[]) {
  const weaknesses: string[] = []
  
  scores.forEach(score => {
    if (score.score < 40) {
      weaknesses.push(score.testType)
    }
  })
  
  return Array.from(new Set(weaknesses))
}

// تحلیل سازگاری
function analyzeConsistency(scores: any[]) {
  if (scores.length < 3) return 'insufficient_data'
  
  const variance = calculateVariance(scores.map(s => s.score))
  if (variance < 100) return 'high'
  if (variance < 500) return 'medium'
  return 'low'
}

// محاسبه واریانس
function calculateVariance(numbers: number[]) {
  const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length
  const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length
  return variance
}

// محاسبه خلق کلی
function calculateOverallMood(emotions: any, trends: any) {
  const positiveEmotions = emotions.happy + emotions.calm
  const negativeEmotions = emotions.sad + emotions.anxious + emotions.angry
  
  if (positiveEmotions > negativeEmotions * 1.5) return 'positive'
  if (negativeEmotions > positiveEmotions * 1.5) return 'negative'
  return 'neutral'
}

// شناسایی ویژگی‌های شخصیتی
function identifyPersonalityTraits(chatAnalysis: any, testAnalysis: any) {
  const traits: string[] = []
  
  if (chatAnalysis.confidenceLevel === 'high') traits.push('اعتماد به نفس بالا')
  if (chatAnalysis.anxietyLevel === 'high') traits.push('سطح اضطراب بالا')
  if (testAnalysis.consistency === 'high') traits.push('ثبات شخصیتی')
  if (testAnalysis.trends === 'improving') traits.push('روحیه بهبودی')
  
  return traits
}

// ارزیابی شاخص‌های سلامت روان
function assessMentalHealthIndicators(chatAnalysis: any, testAnalysis: any) {
  const indicators: any = {
    riskLevel: 'low',
    concerns: [],
    strengths: []
  }
  
  if (chatAnalysis.anxietyLevel === 'high') {
    indicators.riskLevel = 'medium'
    indicators.concerns.push('سطح اضطراب بالا')
  }
  
  if (testAnalysis.trends === 'declining') {
    indicators.riskLevel = 'high'
    indicators.concerns.push('روند نزولی در تست‌ها')
  }
  
  if (chatAnalysis.confidenceLevel === 'high') {
    indicators.strengths.push('اعتماد به نفس بالا')
  }
  
  return indicators
}

// شناسایی عوامل خطر
function identifyRiskFactors(chatAnalysis: any, testAnalysis: any) {
  const riskFactors: string[] = []
  
  if (chatAnalysis.anxietyLevel === 'high') riskFactors.push('اضطراب بالا')
  if (testAnalysis.trends === 'declining') riskFactors.push('روند نزولی')
  if (chatAnalysis.emotions.sad > chatAnalysis.emotions.happy) riskFactors.push('احساسات منفی')
  
  return riskFactors
}

// شناسایی عوامل محافظتی
function identifyProtectiveFactors(chatAnalysis: any, testAnalysis: any) {
  const protectiveFactors: string[] = []
  
  if (chatAnalysis.confidenceLevel === 'high') protectiveFactors.push('اعتماد به نفس')
  if (testAnalysis.trends === 'improving') protectiveFactors.push('روند بهبودی')
  if (chatAnalysis.emotions.happy > chatAnalysis.emotions.sad) protectiveFactors.push('احساسات مثبت')
  
  return protectiveFactors
}

// تولید اقدامات پیشنهادی
function generateRecommendedActions(chatAnalysis: any, testAnalysis: any) {
  const actions: string[] = []
  
  if (chatAnalysis.anxietyLevel === 'high') {
    actions.push('تمرینات تنفسی و مدیتیشن')
    actions.push('مشاوره تخصصی')
  }
  
  if (testAnalysis.trends === 'declining') {
    actions.push('بررسی مجدد تست‌ها')
    actions.push('مشاوره روانشناختی')
  }
  
  if (chatAnalysis.confidenceLevel === 'low') {
    actions.push('تمرینات تقویت اعتماد به نفس')
    actions.push('تست‌های مهارت‌های اجتماعی')
  }
  
  return actions
}

// تولید بینش‌های کلیدی
function generateKeyInsights(chatAnalysis: any, testAnalysis: any) {
  const insights: string[] = []
  
  if (chatAnalysis.anxietyLevel === 'high') {
    insights.push('سطح اضطراب شما بالا است و نیاز به توجه دارد.')
  }
  
  if (chatAnalysis.confidenceLevel === 'low') {
    insights.push('سطح اعتماد به نفس شما پایین است و نیاز به تقویت دارد.')
  }
  
  if (testAnalysis.trends === 'declining') {
    insights.push('روند نزولی در نتایج تست‌ها مشاهده می‌شود.')
  }
  
  if (chatAnalysis.emotions.sad > chatAnalysis.emotions.happy) {
    insights.push('احساسات منفی بیشتر از مثبت در گفتگوهای شما دیده می‌شود.')
  }
  
  return insights
}

// تولید بینش‌ها
function generateInsights(combinedAnalysis: any) {
  const insights: string[] = []
  
  if (combinedAnalysis.overallMood === 'positive') {
    insights.push('خلق کلی شما مثبت است و این نشان‌دهنده سلامت روانی خوبی است.')
  }
  
  if (combinedAnalysis.mentalHealthIndicators.riskLevel === 'high') {
    insights.push('بر اساس تحلیل‌ها، توصیه می‌شود با متخصص روانشناس مشورت کنید.')
  }
  
  if (combinedAnalysis.personalityTraits.includes('اعتماد به نفس بالا')) {
    insights.push('سطح اعتماد به نفس شما بالا است که یک نقطه قوت محسوب می‌شود.')
  }
  
  return insights
}

// تولید توصیه‌ها
function generateRecommendations(chatAnalysis: any, testAnalysis: any) {
  const recommendations: string[] = []
  
  if (chatAnalysis.anxietyLevel === 'high') {
    recommendations.push('تمرینات تنفسی و مدیتیشن برای کاهش اضطراب')
    recommendations.push('مشاوره تخصصی برای مدیریت اضطراب')
  }
  
  if (chatAnalysis.confidenceLevel === 'low') {
    recommendations.push('تمرینات تقویت اعتماد به نفس')
    recommendations.push('تست‌های مهارت‌های اجتماعی')
  }
  
  if (testAnalysis.trends === 'declining') {
    recommendations.push('بررسی مجدد تست‌ها')
    recommendations.push('مشاوره روانشناختی')
  }
  
  if (chatAnalysis.emotions.sad > chatAnalysis.emotions.happy) {
    recommendations.push('فعالیت‌های مثبت و شاد')
    recommendations.push('حمایت اجتماعی و دوستیابی')
  }
  
  return recommendations
}
