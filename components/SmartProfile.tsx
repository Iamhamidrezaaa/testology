import { useEffect, useState } from 'react'
import { AlertTriangle, NotebookText, TestTubes, TrendingUp, Activity } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'

interface SmartProfileData {
  analysis: string
  nextTests: string[]
  recommendedPractices: string[]
  urgentReferral: string | null
  moodTrend: number[]
  practiceStats: {
    completed: number
    total: number
  }
  flaggedRisks: string[]
}

export default function SmartProfile() {
  const [data, setData] = useState<SmartProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/smart-profile')
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error('خطا در بارگیری پروفایل هوشمند:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  if (!data) return <p className="text-red-500">پروفایل بارگیری نشد.</p>

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">تحلیل کلی وضعیت شما</h2>
          <p className="text-gray-800 leading-relaxed">{data.analysis}</p>
        </CardContent>
      </Card>

      {data.urgentReferral && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 mt-1" />
          <div>
            <p className="font-semibold">ارجاع فوری:</p>
            <p>{data.urgentReferral}</p>
          </div>
        </div>
      )}

      {data.flaggedRisks.length > 0 && (
        <Card className="border-yellow-400">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold">نکات مهم</h3>
            </div>
            <ul className="list-disc list-inside space-y-1">
              {data.flaggedRisks.map((risk, index) => (
                <li key={index} className="text-yellow-700">{risk}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">روند تغییرات خلق‌وخو</h3>
          </div>
          <div className="h-24 flex items-end gap-1">
            {data.moodTrend.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-purple-200 rounded-t"
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">پیشرفت تمرین‌ها</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>تکمیل شده: {data.practiceStats.completed}</span>
              <span>کل: {data.practiceStats.total}</span>
            </div>
            <Progress value={(data.practiceStats.completed / data.practiceStats.total) * 100} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TestTubes className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">تست‌های پیشنهادی</h3>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {data.nextTests.map((test, index) => (
              <li key={index}>
                {test}{' '}
                <Button
                  size="sm"
                  variant="link"
                  className="text-blue-600"
                  onClick={() => window.location.href = `/tests/${test.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  شروع تست
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <NotebookText className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold">تمرین‌های توصیه‌شده</h3>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {data.recommendedPractices.map((practice, index) => (
              <li key={index}>
                {practice}{' '}
                <Button
                  size="sm"
                  variant="link"
                  className="text-green-600"
                  onClick={() => window.location.href = `/dashboard/practices/${practice.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  مشاهده تمرین
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Separator />
    </div>
  )
} 