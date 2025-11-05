'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import ResponsiveContainer from '@/components/responsive/ResponsiveContainer'
import ResponsiveGrid from '@/components/responsive/ResponsiveGrid'
import MobileOptimizedCard from '@/components/responsive/MobileOptimizedCard'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Dynamic import برای نمودار
const ChartMood = dynamic(() => import('@/components/charts/ChartMood'), { 
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full" />
})

interface MentalHealthData {
  combinedReport: string
  chartData: any[]
  riskLevel: string
  recommendations: string
  stats: {
    totalTests: number
    totalMoodEntries: number
    lastTestDate: string
    lastMoodDate: string
  }
}

export default function MentalHealthPage() {
  const [data, setData] = useState<MentalHealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMentalHealthData()
  }, [])

  const fetchMentalHealthData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/analyze/combined', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'خطا در دریافت داده‌ها')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته')
    } finally {
      setLoading(false)
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
      <div className="p-4 sm:p-6 lg:p-8 max-w-full md:max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-full md:max-w-4xl mx-auto">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2 text-red-800">خطا در دریافت داده‌ها</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={fetchMentalHealthData} className="bg-red-500 hover:bg-red-600">
                تلاش مجدد
              </Button>
              <div className="text-sm text-red-500">
                <Link href="/tests" className="underline">
                  ابتدا تست‌های روان‌شناسی انجام دهید
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-full md:max-w-4xl mx-auto">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">🧠</div>
            <h2 className="text-xl font-semibold mb-2 text-blue-800">تحلیل روان‌شناسی</h2>
            <p className="text-blue-600 mb-4">
              برای دریافت تحلیل کامل، ابتدا تست‌های روان‌شناسی انجام دهید
            </p>
            <Link href="/tests">
              <Button className="bg-blue-500 hover:bg-blue-600">
                شروع تست‌ها
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ResponsiveContainer maxWidth="lg" padding="md" className="space-y-6">
      {/* هدر */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🧠 تحلیل روان‌شناسی شما
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          تحلیل جامع وضعیت روان‌شناختی شما بر اساس نتایج تست‌ها و ثبت احساسات
        </p>
      </div>

      {/* آمار کلی */}
      <ResponsiveGrid 
        cols={{ default: 2, sm: 2, md: 4 }} 
        gap="sm"
        className="mb-6"
      >
        <MobileOptimizedCard 
          title="تست انجام شده"
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
          title="ثبت احساس"
          icon="😊"
          gradient={true}
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {data.stats.totalMoodEntries}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">ثبت احساس</div>
          </div>
        </MobileOptimizedCard>

        <MobileOptimizedCard 
          title="سطح ریسک"
          icon="⚠️"
          gradient={true}
          className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
        >
          <div className="text-center">
            <Badge className={`${getRiskLevelColor(data.riskLevel)} text-xs sm:text-sm`}>
              ریسک {getRiskLevelText(data.riskLevel)}
            </Badge>
          </div>
        </MobileOptimizedCard>

        <MobileOptimizedCard 
          title="روز تحلیل"
          icon="📊"
          gradient={true}
          className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {data.chartData.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">روز تحلیل</div>
          </div>
        </MobileOptimizedCard>
      </ResponsiveGrid>

      {/* نمودار و تحلیل */}
      <ResponsiveGrid 
        cols={{ default: 1, lg: 2 }} 
        gap="md"
        className="mb-6"
      >
        {/* نمودار */}
        <MobileOptimizedCard 
          title="نمودار پیشرفت"
          icon="📊"
          className="bg-white shadow-lg"
        >
          <div className="h-64 sm:h-80">
            <ChartMood data={data.chartData} />
          </div>
        </MobileOptimizedCard>

        {/* سطح ریسک */}
        <MobileOptimizedCard 
          title="سطح ریسک"
          icon="⚠️"
          className="bg-white shadow-lg"
        >
          <div className="space-y-4">
            <div className="text-center">
              <Badge className={`${getRiskLevelColor(data.riskLevel)} text-sm sm:text-lg px-3 sm:px-4 py-2`}>
                {getRiskLevelText(data.riskLevel)}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span>سطح ریسک</span>
                <span>{getRiskLevelText(data.riskLevel)}</span>
              </div>
              <Progress 
                value={data.riskLevel === 'low' ? 25 : data.riskLevel === 'medium' ? 50 : 75} 
                className="h-2"
              />
            </div>

            <div className="text-xs sm:text-sm text-gray-600">
              {data.riskLevel === 'low' && 'وضعیت شما عالی است! ادامه دهید.'}
              {data.riskLevel === 'medium' && 'وضعیت شما قابل قبول است. مراقب باشید.'}
              {data.riskLevel === 'high' && 'توصیه می‌شود با متخصص مشورت کنید.'}
            </div>
          </div>
        </MobileOptimizedCard>
      </ResponsiveGrid>

      {/* تحلیل ترکیبی */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-100 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <span>تحلیل ترکیبی هوش مصنوعی</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {data.combinedReport}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* پیشنهادات */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <span>پیشنهادات شخصی‌سازی شده</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {data.recommendations}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* دکمه‌های عملیات */}
      <ResponsiveGrid 
        cols={{ default: 1, sm: 3 }} 
        gap="sm"
        className="justify-center"
      >
        <Button
          onClick={fetchMentalHealthData}
          className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto text-sm sm:text-base"
        >
          🔄 به‌روزرسانی تحلیل
        </Button>
        
        <Button
          onClick={() => window.open('/api/export/mental-pdf', '_blank')}
          className="bg-green-500 hover:bg-green-600 w-full sm:w-auto text-sm sm:text-base"
        >
          📄 دریافت PDF
        </Button>
        
        <Link href="/tests" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full text-sm sm:text-base">
            🧠 تست‌های جدید
          </Button>
        </Link>
      </ResponsiveGrid>
    </ResponsiveContainer>
  )
}
