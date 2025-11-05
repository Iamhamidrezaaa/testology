'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import axios from 'axios'

interface SmartProfileData {
  result: {
    moodTrend: number[]
    completedPractices: number
    totalPractices: number
    flaggedRisks: string[]
    summary: string
    recommendedTests: string[]
    recommendedPractices: string[]
    criticalAlert?: string
  }
}

export default function SmartProfileSummary() {
  const [data, setData] = useState<SmartProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/smart-profile')
        setData(res.data as any)
        setError(null)
      } catch (err) {
        console.error('خطا در دریافت پروفایل هوشمند:', err)
        setError('خطا در بارگذاری تحلیل هوشمند پروفایل')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-6 h-6 mx-auto animate-spin" />
        <p className="mt-2 font-[Vazirmatn]">در حال تحلیل وضعیت شما...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="font-[Vazirmatn]">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!data) return null

  const { 
    moodTrend, 
    completedPractices, 
    totalPractices, 
    flaggedRisks,
    summary,
    recommendedTests,
    recommendedPractices,
    criticalAlert 
  } = data.result

  // محاسبه درصد پیشرفت
  const progressPercentage = totalPractices > 0 
    ? Math.round((completedPractices / totalPractices) * 100) 
    : 0

  // محاسبه روند مود
  const moodStatus = moodTrend.length > 0
    ? moodTrend[moodTrend.length - 1] > moodTrend[0]
      ? 'بهبود'
      : 'کاهش'
    : 'ثابت'

  return (
    <Card className="bg-white shadow-md rounded-xl p-6 space-y-4 font-[Vazirmatn]">
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">📊 تحلیل کلی وضعیت روانی شما</h2>
          <Badge variant={moodStatus === 'بهبود' ? 'default' : 'secondary'}>
            روند مود: {moodStatus}
          </Badge>
        </div>

        <p className="text-gray-800 leading-relaxed">{summary}</p>

        {criticalAlert && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{criticalAlert}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">پیشرفت تمرین‌ها</h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{progressPercentage}%</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {completedPractices} از {totalPractices} تمرین انجام شده
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">روند مود</h3>
            <div className="flex items-center gap-2">
              {moodTrend.map((value, index) => (
                <div 
                  key={index}
                  className="h-8 bg-blue-100 rounded"
                  style={{ 
                    width: `${100 / moodTrend.length}%`,
                    height: `${value}%`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-md font-medium mb-2">🧪 تست‌های پیشنهادی:</h3>
          <div className="flex flex-wrap gap-2">
            {recommendedTests.map((test, idx) => (
              <Badge 
                key={idx} 
                variant="outline"
                className="bg-blue-100 text-blue-800 border border-blue-300"
              >
                {test}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-md font-medium mb-2">🧘 تمرین‌های مفید برای شما:</h3>
          <div className="flex flex-wrap gap-2">
            {recommendedPractices.map((practice, idx) => (
              <Badge 
                key={idx} 
                variant="outline"
                className="bg-green-100 text-green-800 border border-green-300"
              >
                {practice}
              </Badge>
            ))}
          </div>
        </div>

        {flaggedRisks.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">هشدارهای مهم</h3>
            {flaggedRisks.map((risk, index) => (
              <Alert key={index} variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{risk}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 