'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, AlertCircle } from 'lucide-react'
import MoodChart from './MoodChart'
import type { DashboardData } from '@/types/dashboard'

export default function UserDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/dashboard')
        if (!res.ok) {
          throw new Error('خطا در دریافت داده‌ها')
        }
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطای ناشناخته')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="mr-2 text-sm text-muted-foreground">در حال بارگذاری...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <AlertCircle className="mx-auto h-12 w-12 mb-4" />
        <p>{error}</p>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="p-6 space-y-8">
      {/* نمودار وضعیت روانی */}
      <Card>
        <CardContent>
          <h3 className="text-xl font-bold mb-4">وضعیت روانی شما در هفته‌های گذشته</h3>
          <MoodChart data={data.moodData} />
        </CardContent>
      </Card>

      {/* پیشنهادات پیگیری */}
      <Card>
        <CardContent>
          <h3 className="text-xl font-bold mb-4">پیشنهادات پیگیری شخصی‌شده</h3>
          <div className="space-y-4">
            {data.suggestions.map((item) => (
              <div key={item.id} className="flex items-center justify-between border rounded p-3">
                <div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.type === 'test' ? 'تست تکمیلی' : item.type === 'exercise' ? 'تمرین روزانه' : 'ارجاع درمانی'}
                  </p>
                </div>
                {item.completed ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <AlertCircle className="text-yellow-500 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* نوار پیشرفت */}
      <Card>
        <CardContent>
          <h3 className="text-xl font-bold mb-4">پیشرفت کلی</h3>
          <Progress 
            value={data.pendingCount > 0 
              ? Math.round(((data.suggestions.length - data.pendingCount) / data.suggestions.length) * 100) 
              : 100
            } 
            className="mb-2" 
          />
          <p className="text-sm text-muted-foreground">
            {data.pendingCount > 0 
              ? `${data.pendingCount} مورد نیاز به پیگیری دارید.` 
              : 'همه پیگیری‌ها انجام شده ✅'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 