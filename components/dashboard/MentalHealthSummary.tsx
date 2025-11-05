'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TestResult } from '@prisma/client'

interface MoodEntry {
  id: string
  createdAt: string
  moodScore: number
  summary: string
}

interface MentalHealthSummaryProps {
  tests: TestResult[]
  moodHistory: MoodEntry[]
}

export function MentalHealthSummary({ tests, moodHistory }: MentalHealthSummaryProps) {
  // محاسبه آمار کلی
  const totalTests = tests.length
  const completedTests = tests.filter(test => test.completed).length
  const averageScore = tests
    .filter(test => test.score !== null)
    .reduce((sum, test) => sum + (test.score || 0), 0) / tests.filter(test => test.score !== null).length

  const latestMood = moodHistory?.[0]
  const averageMoodScore = moodHistory.length > 0 
    ? moodHistory.reduce((sum, mood) => sum + mood.moodScore, 0) / moodHistory.length 
    : 0

  // دسته‌بندی تست‌ها بر اساس نوع
  const testCategories = {
    anxiety: tests.filter(test => ['gad7', 'hads'].includes(test.testSlug)),
    depression: tests.filter(test => ['phq9', 'hads'].includes(test.testSlug)),
    selfEsteem: tests.filter(test => ['rosenberg', 'rsei'].includes(test.testSlug)),
    lifeSatisfaction: tests.filter(test => ['swls'].includes(test.testSlug)),
    stress: tests.filter(test => ['pss'].includes(test.testSlug))
  }

  // محاسبه وضعیت کلی هر دسته
  const getCategoryStatus = (categoryTests: TestResult[]) => {
    if (categoryTests.length === 0) return { status: 'unknown', label: 'نامشخص', color: 'bg-gray-100 text-gray-600' }
    
    const avgScore = categoryTests
      .filter(test => test.score !== null)
      .reduce((sum, test) => sum + (test.score || 0), 0) / categoryTests.filter(test => test.score !== null).length

    const testSlug = categoryTests[0].testSlug
    
    if (['gad7', 'phq9', 'pss'].includes(testSlug)) {
      // برای تست‌های منفی (هرچه کمتر بهتر)
      if (avgScore <= 4) return { status: 'excellent', label: 'عالی', color: 'bg-green-100 text-green-800' }
      if (avgScore <= 9) return { status: 'good', label: 'خوب', color: 'bg-yellow-100 text-yellow-800' }
      return { status: 'needs_attention', label: 'نیاز به توجه', color: 'bg-red-100 text-red-800' }
    } else {
      // برای تست‌های مثبت (هرچه بیشتر بهتر)
      if (avgScore >= 30) return { status: 'excellent', label: 'عالی', color: 'bg-green-100 text-green-800' }
      if (avgScore >= 20) return { status: 'good', label: 'خوب', color: 'bg-yellow-100 text-yellow-800' }
      return { status: 'needs_attention', label: 'نیاز به بهبود', color: 'bg-red-100 text-red-800' }
    }
  }

  const getMoodStatus = (score: number) => {
    if (score >= 80) return { label: 'عالی', color: 'bg-green-100 text-green-800' }
    if (score >= 60) return { label: 'خوب', color: 'bg-blue-100 text-blue-800' }
    if (score >= 40) return { label: 'متوسط', color: 'bg-yellow-100 text-yellow-800' }
    return { label: 'نیاز به بهبود', color: 'bg-red-100 text-red-800' }
  }

  const categories = [
    { name: 'اضطراب', tests: testCategories.anxiety, icon: '😰' },
    { name: 'افسردگی', tests: testCategories.depression, icon: '😔' },
    { name: 'عزت نفس', tests: testCategories.selfEsteem, icon: '💪' },
    { name: 'رضایت از زندگی', tests: testCategories.lifeSatisfaction, icon: '😊' },
    { name: 'استرس', tests: testCategories.stress, icon: '😤' }
  ]

  return (
    <div className="space-y-6">
      {/* آمار کلی */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">📊 خلاصه وضعیت روان‌شناسی</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{totalTests}</div>
              <div className="text-sm text-blue-600">کل تست‌ها</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{completedTests}</div>
              <div className="text-sm text-green-600">تکمیل‌شده</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{averageScore.toFixed(1)}</div>
              <div className="text-sm text-purple-600">میانگین امتیاز</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{Math.round(averageMoodScore)}</div>
              <div className="text-sm text-orange-600">امتیاز خلق‌وخو</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* وضعیت فعلی خلق‌وخو */}
      {latestMood && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">🎭 وضعیت فعلی خلق‌وخو</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">
                  {latestMood.moodScore >= 80 ? '😊' : 
                   latestMood.moodScore >= 60 ? '🙂' : 
                   latestMood.moodScore >= 40 ? '😐' : '😔'}
                </div>
                <div>
                  <div className="text-2xl font-bold">{latestMood.summary}</div>
                  <div className="text-sm text-gray-600">
                    آخرین بروزرسانی: {new Date(latestMood.createdAt).toLocaleDateString('fa-IR')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{latestMood.moodScore}</div>
                <Badge className={getMoodStatus(latestMood.moodScore).color}>
                  {getMoodStatus(latestMood.moodScore).label}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* وضعیت دسته‌بندی شده */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🎯 وضعیت دسته‌بندی شده</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const status = getCategoryStatus(category.tests)
              return (
                <div key={category.name} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-semibold">{category.name}</span>
                    </div>
                    <Badge className={status.color}>
                      {status.label}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {category.tests.length} تست انجام‌شده
                  </div>
                  {category.tests.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      آخرین: {new Date(category.tests[0].createdAt).toLocaleDateString('fa-IR')}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* توصیه‌های کلی */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">💡 توصیه‌های کلی</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map((category) => {
              const status = getCategoryStatus(category.tests)
              if (status.status === 'needs_attention' && category.tests.length > 0) {
                return (
                  <div key={category.name} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-600">⚠️</span>
                      <span className="text-sm font-medium text-yellow-800">
                        {category.name} نیاز به توجه دارد
                      </span>
                    </div>
                    <div className="text-xs text-yellow-700 mt-1">
                      پیشنهاد می‌شود تست‌های مرتبط را تکرار کنید
                    </div>
                  </div>
                )
              }
              return null
            })}
            
            {categories.every(category => getCategoryStatus(category.tests).status !== 'needs_attention') && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✅</span>
                  <span className="text-sm font-medium text-green-800">
                    وضعیت کلی شما مطلوب است
                  </span>
                </div>
                <div className="text-xs text-green-700 mt-1">
                  ادامه تست‌ها برای حفظ وضعیت فعلی توصیه می‌شود
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

















