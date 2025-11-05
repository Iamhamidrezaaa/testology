'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import ResponsiveContainer from '@/components/responsive/ResponsiveContainer'
import ResponsiveGrid from '@/components/responsive/ResponsiveGrid'
import MobileOptimizedCard from '@/components/responsive/MobileOptimizedCard'
import Link from 'next/link'

interface PatientDetails {
  patient: {
    id: string
    user: {
      id: string
      name: string
      email: string
      image?: string
    }
    notes?: string
    status: string
    assignedContent: any[]
    createdAt: string
  }
  testResults: Array<{
    id: string
    testName: string
    testSlug: string
    score: number
    resultText: string
    createdAt: string
  }>
  moodEntries: Array<{
    id: string
    mood: string
    note?: string
    date: string
  }>
  mentalHealthProfile?: {
    combinedReport: string
    riskLevel: string
    recommendations: string
  }
  userProgress?: {
    level: number
    xp: number
    totalTests: number
    achievements: string[]
  }
  stats: {
    totalTests: number
    totalMoodEntries: number
    lastTestDate?: string
    lastMoodDate?: string
  }
}

export default function PatientDetailsPage({ params }: { params: { userId: string } }) {
  const [data, setData] = useState<PatientDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPatientDetails()
  }, [params.userId])

  const fetchPatientDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/therapist/patient/${params.userId}`)
      
      if (!response.ok) {
        throw new Error('خطا در دریافت اطلاعات بیمار')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته')
    } finally {
      setLoading(false)
    }
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case '😊': return '😊'
      case '😐': return '😐'
      case '😢': return '😢'
      case '😠': return '😠'
      case '😴': return '😴'
      default: return '❓'
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRiskLevelText = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'کم'
      case 'medium': return 'متوسط'
      case 'high': return 'بالا'
      default: return 'نامشخص'
    }
  }

  if (loading) {
    return (
      <ResponsiveContainer maxWidth="lg" padding="md" className="space-y-6">
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        
        <ResponsiveGrid cols={{ default: 1, md: 2 }} gap="md">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </ResponsiveGrid>
      </ResponsiveContainer>
    )
  }

  if (error) {
    return (
      <ResponsiveContainer maxWidth="lg" padding="md">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2 text-red-800">خطا در دریافت اطلاعات</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchPatientDetails} className="bg-red-500 hover:bg-red-600">
              تلاش مجدد
            </Button>
          </CardContent>
        </Card>
      </ResponsiveContainer>
    )
  }

  if (!data) {
    return (
      <ResponsiveContainer maxWidth="lg" padding="md">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">👤</div>
            <h2 className="text-xl font-semibold mb-2 text-blue-800">اطلاعات بیمار</h2>
            <p className="text-blue-600 mb-4">
              اطلاعات بیمار یافت نشد
            </p>
            <Link href="/therapist/dashboard">
              <Button className="bg-blue-500 hover:bg-blue-600">
                بازگشت به داشبورد
              </Button>
            </Link>
          </CardContent>
        </Card>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer maxWidth="lg" padding="md" className="space-y-6">
      {/* هدر */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          👤 اطلاعات بیمار: {data.patient.user.name}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          مشاهده جزئیات کامل بیمار و پیشرفت درمان
        </p>
      </div>

      {/* آمار کلی */}
      <ResponsiveGrid 
        cols={{ default: 2, sm: 2, md: 4 }} 
        gap="sm"
        className="mb-6"
      >
        <MobileOptimizedCard 
          title="تست‌های انجام شده"
          icon="🧠"
          gradient={true}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {data.stats.totalTests}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">تست انجام شده</div>
          </div>
        </MobileOptimizedCard>

        <MobileOptimizedCard 
          title="ورودی احساسات"
          icon="😊"
          gradient={true}
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {data.stats.totalMoodEntries}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">ورودی احساسات</div>
          </div>
        </MobileOptimizedCard>

        <MobileOptimizedCard 
          title="تمرینات اختصاصی"
          icon="📚"
          gradient={true}
          className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {data.patient.assignedContent.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">تمرین اختصاصی</div>
          </div>
        </MobileOptimizedCard>

        {data.mentalHealthProfile && (
          <MobileOptimizedCard 
            title="سطح ریسک"
            icon="⚠️"
            gradient={true}
            className="bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200"
          >
            <div className="text-center">
              <Badge className={`${getRiskLevelColor(data.mentalHealthProfile.riskLevel)} text-xs`}>
                {getRiskLevelText(data.mentalHealthProfile.riskLevel)}
              </Badge>
            </div>
          </MobileOptimizedCard>
        )}
      </ResponsiveGrid>

      {/* نتایج تست‌ها */}
      <MobileOptimizedCard 
        title="نتایج تست‌های انجام شده"
        icon="🧠"
        className="bg-white shadow-lg"
      >
        <div className="space-y-4">
          {data.testResults.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🧠</div>
              <p className="text-gray-600 mb-2">هنوز تستی انجام نشده است</p>
              <p className="text-sm text-gray-500">بیمار را تشویق کنید تا تست‌ها را انجام دهد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.testResults.map((test) => (
                <Card key={test.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{test.testName}</h3>
                        <p className="text-sm text-gray-600 mb-2">{test.resultText}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>امتیاز: {test.score}</span>
                          <span>تاریخ: {new Date(test.createdAt).toLocaleDateString('fa-IR')}</span>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {test.testSlug}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </MobileOptimizedCard>

      {/* ورودی‌های احساسات */}
      <MobileOptimizedCard 
        title="ورودی‌های احساسات"
        icon="😊"
        className="bg-white shadow-lg"
      >
        <div className="space-y-4">
          {data.moodEntries.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">😊</div>
              <p className="text-gray-600 mb-2">هنوز احساسی ثبت نشده است</p>
              <p className="text-sm text-gray-500">بیمار را تشویق کنید تا احساسات خود را ثبت کند</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.moodEntries.slice(0, 12).map((mood) => (
                <Card key={mood.id} className="border border-gray-200">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getMoodIcon(mood.mood)}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {new Date(mood.date).toLocaleDateString('fa-IR')}
                        </p>
                        {mood.note && (
                          <p className="text-xs text-gray-600 mt-1">{mood.note}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </MobileOptimizedCard>

      {/* تحلیل روان‌شناسی */}
      {data.mentalHealthProfile && (
        <MobileOptimizedCard 
          title="تحلیل روان‌شناسی"
          icon="🤖"
          className="bg-gradient-to-br from-indigo-50 to-purple-100 border-indigo-200"
        >
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {data.mentalHealthProfile.combinedReport}
              </div>
            </div>
            
            {data.mentalHealthProfile.recommendations && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-indigo-200">
                <h4 className="font-semibold text-gray-800 mb-2">💡 پیشنهادات:</h4>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {data.mentalHealthProfile.recommendations}
                  </div>
                </div>
              </div>
            )}
          </div>
        </MobileOptimizedCard>
      )}

      {/* پیشرفت کاربر */}
      {data.userProgress && (
        <MobileOptimizedCard 
          title="پیشرفت کاربر"
          icon="📊"
          className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {data.userProgress.level}
              </div>
              <div className="text-xs text-gray-600">سطح</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {data.userProgress.xp}
              </div>
              <div className="text-xs text-gray-600">XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {data.userProgress.totalTests}
              </div>
              <div className="text-xs text-gray-600">تست</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {data.userProgress.achievements.length}
              </div>
              <div className="text-xs text-gray-600">دستاورد</div>
            </div>
          </div>
        </MobileOptimizedCard>
      )}

      {/* دکمه بازگشت */}
      <div className="text-center">
        <Link href="/therapist/dashboard">
          <Button variant="outline" className="w-full sm:w-auto">
            ← بازگشت به داشبورد
          </Button>
        </Link>
      </div>
    </ResponsiveContainer>
  )
}
















