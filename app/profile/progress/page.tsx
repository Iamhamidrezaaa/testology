'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import ResponsiveContainer from '@/components/responsive/ResponsiveContainer'
import ResponsiveGrid from '@/components/responsive/ResponsiveGrid'
import MobileOptimizedCard from '@/components/responsive/MobileOptimizedCard'
import Link from 'next/link'

interface UserProgress {
  id: string
  xp: number
  level: number
  totalTests: number
  achievements: string[]
  streakDays: number
  lastActivity: string
  progressToNext: number
  xpNeeded: number
  progressPercentage: number
}

export default function ProgressPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/progress')
      
      if (!response.ok) {
        throw new Error('خطا در دریافت داده‌ها')
      }

      const data = await response.json()
      setProgress(data.progress)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته')
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async () => {
    try {
      const response = await fetch('/api/user/progress/update', {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        setProgress(data.progress)
      }
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const getLevelTitle = (level: number): string => {
    if (level >= 50) return 'استاد روان‌شناسی'
    if (level >= 40) return 'کارشناس ارشد'
    if (level >= 30) return 'کارشناس'
    if (level >= 20) return 'دانش‌آموز پیشرفته'
    if (level >= 10) return 'دانش‌آموز'
    if (level >= 5) return 'مبتدی'
    return 'تازه‌کار'
  }

  const getLevelColor = (level: number): string => {
    if (level >= 50) return 'text-purple-600'
    if (level >= 40) return 'text-red-600'
    if (level >= 30) return 'text-orange-600'
    if (level >= 20) return 'text-blue-600'
    if (level >= 10) return 'text-green-600'
    if (level >= 5) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getLevelIcon = (level: number): string => {
    if (level >= 50) return '👑'
    if (level >= 40) return '🏆'
    if (level >= 30) return '🥇'
    if (level >= 20) return '🥈'
    if (level >= 10) return '🥉'
    if (level >= 5) return '⭐'
    return '🌱'
  }

  if (loading) {
    return (
      <ResponsiveContainer maxWidth="lg" padding="md" className="space-y-6">
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        
        <ResponsiveGrid cols={{ default: 1, md: 2 }} gap="md">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
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
            <h2 className="text-xl font-semibold mb-2 text-red-800">خطا در دریافت داده‌ها</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchProgress} className="bg-red-500 hover:bg-red-600">
              تلاش مجدد
            </Button>
          </CardContent>
        </Card>
      </ResponsiveContainer>
    )
  }

  if (!progress) {
    return (
      <ResponsiveContainer maxWidth="lg" padding="md">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-xl font-semibold mb-2 text-blue-800">مسیر پیشرفت</h2>
            <p className="text-blue-600 mb-4">
              برای شروع مسیر پیشرفت، ابتدا تست‌های روان‌شناسی انجام دهید
            </p>
            <Link href="/tests">
              <Button className="bg-blue-500 hover:bg-blue-600">
                شروع تست‌ها
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
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          📊 مسیر پیشرفت من
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          پیشرفت خود را در مسیر رشد روان‌شناسی دنبال کنید
        </p>
      </div>

      {/* آمار کلی */}
      <ResponsiveGrid 
        cols={{ default: 2, sm: 2, md: 4 }} 
        gap="sm"
        className="mb-6"
      >
        <MobileOptimizedCard 
          title="سطح فعلی"
          icon={getLevelIcon(progress.level)}
          gradient={true}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
        >
          <div className="text-center">
            <div className={`text-2xl font-bold ${getLevelColor(progress.level)} mb-1`}>
              {progress.level}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">{getLevelTitle(progress.level)}</div>
          </div>
        </MobileOptimizedCard>

        <MobileOptimizedCard 
          title="امتیاز XP"
          icon="⭐"
          gradient={true}
          className="bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {progress.xp.toLocaleString('fa-IR')}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">امتیاز کل</div>
          </div>
        </MobileOptimizedCard>

        <MobileOptimizedCard 
          title="تست انجام شده"
          icon="🧠"
          gradient={true}
          className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {progress.totalTests}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">تست انجام شده</div>
          </div>
        </MobileOptimizedCard>

        <MobileOptimizedCard 
          title="دستاوردها"
          icon="🏆"
          gradient={true}
          className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {progress.achievements.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">دستاورد کسب شده</div>
          </div>
        </MobileOptimizedCard>
      </ResponsiveGrid>

      {/* پیشرفت به سطح بعدی */}
      <MobileOptimizedCard 
        title="پیشرفت به سطح بعدی"
        icon="📈"
        className="bg-gradient-to-br from-indigo-50 to-purple-100 border-indigo-200"
      >
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>پیشرفت فعلی</span>
            <span>{progress.progressToNext} / {progress.xpNeeded} XP</span>
          </div>
          
          <Progress 
            value={progress.progressPercentage} 
            className="h-3 bg-gray-200"
          />
          
          <div className="text-center">
            <div className="text-sm text-gray-600">
              {progress.xpNeeded - progress.progressToNext} XP تا سطح بعدی
            </div>
          </div>
        </div>
      </MobileOptimizedCard>

      {/* دستاوردها */}
      <MobileOptimizedCard 
        title="دستاوردهای شما"
        icon="🏅"
        className="bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200"
      >
        <div className="space-y-3">
          {progress.achievements.length === 0 ? (
            <div className="text-center py-4">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-gray-600 text-sm">هنوز دستاوردی کسب نکرده‌اید</p>
              <p className="text-xs text-gray-500 mt-1">تست‌ها را انجام دهید تا اولین دستاورد خود را کسب کنید!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {progress.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-yellow-200"
                >
                  <div className="text-2xl">🏆</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{achievement}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </MobileOptimizedCard>

      {/* دکمه‌های عملیات */}
      <ResponsiveGrid 
        cols={{ default: 1, sm: 2 }} 
        gap="sm"
        className="justify-center"
      >
        <Button
          onClick={updateProgress}
          className="bg-green-500 hover:bg-green-600 w-full text-sm sm:text-base"
        >
          🎯 به‌روزرسانی پیشرفت
        </Button>
        
        <Link href="/tests" className="w-full">
          <Button variant="outline" className="w-full text-sm sm:text-base">
            🧠 انجام تست جدید
          </Button>
        </Link>
      </ResponsiveGrid>
    </ResponsiveContainer>
  )
}