'use client'

import { useEffect, useState } from 'react'
import BaseModule from './BaseModule'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import UserStatsChart from './charts/UserStatsChart'
import PopularTestsChart from './charts/PopularTestsChart'
import TestDistributionChart from './charts/TestDistributionChart'
import TimeFilter from './charts/TimeFilter'
import RecentActivities from './charts/RecentActivities'

interface DashboardStats {
  totalUsers: number
  totalTestsTaken: number
  totalFeedbacks: number
  totalArticles: number
  userStats: Array<{ date: string; count: number }>
  popularTests: Array<{ name: string; count: number }>
  testDistribution: Array<{ category: string; count: number }>
  recentActivities: Array<{
    id: string
    type: 'user' | 'test' | 'comment' | 'article'
    title: string
    description: string
    time: string
  }>
}

type TimeRange = 'day' | 'week' | 'month' | 'year'

export function DashboardModule() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>('month')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await fetch(`/api/admin/dashboard?timeRange=${timeRange}`)
        if (!res.ok) {
          throw new Error('خطا در دریافت اطلاعات')
        }
        const data = await res.json()
        setStats(data)
      } catch (err) {
        setError('خطا در دریافت اطلاعات داشبورد')
        console.error('Error fetching dashboard stats:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [timeRange])

  const handleExportData = () => {
    if (!stats) return

    const data = {
      userStats: stats.userStats,
      popularTests: stats.popularTests,
      testDistribution: stats.testDistribution
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard-stats-${timeRange}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>داشبورد</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* پیام خوش‌آمدگویی */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800">خوش آمدید!</h2>
            <p className="text-blue-600">به پنل مدیریت تستولوژی خوش آمدید. از اینجا می‌توانید تمام بخش‌های سایت را مدیریت کنید.</p>
          </div>

          {/* نمایش خطا */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* کارت‌های آماری */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              // نمایش اسکلتون در زمان لودینگ
              <>
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </>
            ) : (
              // نمایش کارت‌های آماری
              <>
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-gray-600 mb-2">کاربران</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats?.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-2">تعداد کل کاربران</p>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-gray-600 mb-2">تست‌های انجام‌شده</h3>
                  <p className="text-3xl font-bold text-green-600">{stats?.totalTestsTaken.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-2">تعداد کل تست‌های انجام شده</p>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-gray-600 mb-2">نظرات کاربران</h3>
                  <p className="text-3xl font-bold text-purple-600">{stats?.totalFeedbacks.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-2">تعداد کل نظرات</p>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-gray-600 mb-2">مقالات منتشرشده</h3>
                  <p className="text-3xl font-bold text-orange-600">{stats?.totalArticles.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-2">تعداد کل مقالات</p>
                </Card>
              </>
            )}
          </div>

          {/* فیلتر زمانی و دکمه صادرات */}
          <div className="flex justify-between items-center">
            <TimeFilter selectedRange={timeRange} onRangeChange={setTimeRange} />
            <Button onClick={handleExportData} variant="outline" size="sm">
              <Download className="w-4 h-4 ml-2" />
              صادرات داده‌ها
            </Button>
          </div>

          {/* نمودارها */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isLoading ? (
              <>
                <Skeleton className="h-[400px] w-full" />
                <Skeleton className="h-[400px] w-full" />
                <Skeleton className="h-[400px] w-full" />
              </>
            ) : (
              <>
                <UserStatsChart data={stats?.userStats || []} />
                <PopularTestsChart data={stats?.popularTests || []} />
                <div className="lg:col-span-2">
                  <TestDistributionChart data={stats?.testDistribution || []} />
                </div>
              </>
            )}
          </div>

          {/* فعالیت‌های اخیر */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : (
              <RecentActivities activities={stats?.recentActivities || []} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 