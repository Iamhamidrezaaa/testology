'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, Pie } from 'react-chartjs-2'
import 'chart.js/auto'

export function ReportsModule() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/admin/reports')
      if (!res.ok) throw new Error('خطا در دریافت آمار')
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error('Error fetching stats:', err)
      setError('خطا در دریافت آمار')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <p>در حال بارگذاری...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader><CardTitle>کاربران</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{stats.totalUsers}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>تست‌ها</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{stats.totalTests}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>نتایج ثبت‌شده</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{stats.totalResults}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>تحلیل‌شده‌ها</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{stats.analyzedResults}</CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader><CardTitle>رشد ماهانه کاربران</CardTitle></CardHeader>
          <CardContent>
            <Bar 
              data={stats.userGrowthChart} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'تعداد کاربران جدید در هر ماه'
                  }
                }
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>پراستفاده‌ترین تست‌ها</CardTitle></CardHeader>
          <CardContent>
            <Pie 
              data={stats.topTestsChart}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  title: {
                    display: true,
                    text: 'تعداد اجرای هر تست'
                  }
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 