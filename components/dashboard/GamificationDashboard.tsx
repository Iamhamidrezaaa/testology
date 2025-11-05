'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import UserProgress from './UserProgress'
import UserBadges from './UserBadges'
import LevelUpAnimation from './LevelUpAnimation'

interface GamificationStats {
  level: number
  xp: number
  totalPoints: number
  badges: number
  totalTests: number
  recentBadges: Array<{
    name: string
    icon: string
    rarity: string
    earnedAt: string
  }>
}

export default function GamificationDashboard() {
  const [stats, setStats] = useState<GamificationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [previousLevel, setPreviousLevel] = useState(0)

  useEffect(() => {
    fetchGamificationStats()
  }, [])

  const fetchGamificationStats = async () => {
    try {
      const response = await fetch('/api/user/gamification')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
        
        // بررسی ارتقاء سطح
        if (data.level > previousLevel && previousLevel > 0) {
          setShowLevelUp(true)
        }
        setPreviousLevel(data.level)
      }
    } catch (error) {
      console.error('Error fetching gamification stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🎯</div>
        <h3 className="text-xl font-semibold mb-2">شروع کنید!</h3>
        <p className="text-gray-600 mb-4">
          اولین تست روان‌شناسی خود را انجام دهید تا وارد سیستم گیمیفیکیشن شوید
        </p>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          شروع تست
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* انیمیشن ارتقاء سطح */}
      {showLevelUp && (
        <LevelUpAnimation 
          newLevel={stats.level} 
          onComplete={() => setShowLevelUp(false)} 
        />
      )}

      {/* آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {stats.level}
            </div>
            <div className="text-sm text-gray-600">سطح</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {stats.xp.toLocaleString('fa-IR')}
            </div>
            <div className="text-sm text-gray-600">XP</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {stats.badges}
            </div>
            <div className="text-sm text-gray-600">دستاورد</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {stats.totalTests}
            </div>
            <div className="text-sm text-gray-600">تست</div>
          </CardContent>
        </Card>
      </div>

      {/* پیشرفت و دستاوردها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserProgress 
          xp={stats.xp}
          level={stats.level}
          totalPoints={stats.totalPoints}
        />
        
        <UserBadges 
          badges={stats.recentBadges}
        />
      </div>

      {/* انگیزه‌بخشی */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-100 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🚀</div>
            <div>
              <h3 className="text-lg font-semibold mb-2">ادامه دهید!</h3>
              <p className="text-gray-600 mb-3">
                شما در مسیر رشد روان‌شناسی خود پیشرفت خوبی داشته‌اید. 
                تست‌های بیشتری انجام دهید تا دستاوردهای جدید کسب کنید.
              </p>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span>🎯</span>
                  <span>تست انجام دهید</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span>XP کسب کنید</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🏆</span>
                  <span>دستاورد بگیرید</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
















