'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TestResult } from '@prisma/client'

interface UserMoodSummaryProps {
  tests: TestResult[]
}

export function UserMoodSummary({ tests }: UserMoodSummaryProps) {
  // محاسبه آمار کلی
  const totalTests = tests.length
  const completedTests = tests.filter((test: any) => test.completed).length
  const averageScore = tests
    .filter((test: any) => test.score !== null)
    .reduce((sum: any, test: any) => sum + (test.score || 0), 0) / tests.filter((test: any) => test.score !== null).length

  // دسته‌بندی تست‌ها بر اساس نوع
  const testCategories = {
    anxiety: tests.filter((test: any) => test.testSlug && ['gad7', 'hads'].includes(test.testSlug)),
    depression: tests.filter((test: any) => test.testSlug && ['phq9', 'hads'].includes(test.testSlug)),
    selfEsteem: tests.filter((test: any) => test.testSlug && ['rosenberg', 'rsei'].includes(test.testSlug)),
    lifeSatisfaction: tests.filter((test: any) => test.testSlug && ['swls'].includes(test.testSlug)),
    stress: tests.filter((test: any) => test.testSlug && ['pss'].includes(test.testSlug))
  }

  // محاسبه وضعیت کلی هر دسته
  const getCategoryStatus = (categoryTests: TestResult[]) => {
    if (categoryTests.length === 0) return { status: 'unknown', label: 'نامشخص', color: 'bg-gray-100 text-gray-600' }
    
    const avgScore = categoryTests
      .filter((test: any) => test.score !== null)
      .reduce((sum: any, test: any) => sum + (test.score || 0), 0) / categoryTests.filter((test: any) => test.score !== null).length

    // منطق ارزیابی بر اساس نوع تست
    const testSlug = categoryTests[0].testSlug
    
    if (testSlug && ['gad7', 'phq9', 'pss'].includes(testSlug)) {
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
          <CardTitle className="text-xl">📊 خلاصه وضعیت روان‌شناسی</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        </CardContent>
      </Card>

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
                <div key={category.name} className="p-4 border rounded-lg">
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

















