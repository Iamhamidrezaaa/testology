'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { getMissionIcon, getMissionColor, getMissionProgress } from '@/lib/services/missions'

interface Mission {
  id: string
  title: string
  description: string
  xpReward: number
  isCompleted: boolean
  date: string
}

interface DailyMissionsProps {
  className?: string
}

export default function DailyMissions({ className = "" }: DailyMissionsProps) {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [userStats, setUserStats] = useState({
    todayTests: 0,
    todayAnalyses: 0,
    todayProfileViews: 0,
    todayMoodEntry: false,
    todayMessages: 0,
    weekTests: 0,
    streakDays: 0,
    weekBadges: 0
  })

  useEffect(() => {
    fetchMissions()
    fetchUserStats()
  }, [])

  const fetchMissions = async () => {
    try {
      const response = await fetch('/api/missions')
      if (response.ok) {
        const data = await response.json()
        setMissions(data.missions || [])
      }
    } catch (error) {
      console.error('Error fetching missions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserStats = async () => {
    try {
      // اینجا می‌تونیم API جداگانه برای آمار کاربر بسازیم
      // فعلاً با مقادیر نمونه کار می‌کنیم
      setUserStats({
        todayTests: 0,
        todayAnalyses: 0,
        todayProfileViews: 0,
        todayMoodEntry: false,
        todayMessages: 0,
        weekTests: 0,
        streakDays: 0,
        weekBadges: 0
      })
    } catch (error) {
      console.error('Error fetching user stats:', error)
    }
  }

  const completeMission = async (missionId: string) => {
    try {
      const response = await fetch(`/api/missions/${missionId}/complete`, {
        method: 'POST'
      })
      
      if (response.ok) {
        setMissions(prev => 
          prev.map(mission => 
            mission.id === missionId 
              ? { ...mission, isCompleted: true }
              : mission
          )
        )
      }
    } catch (error) {
      console.error('Error completing mission:', error)
    }
  }

  if (loading) {
    return (
      <Card className={`bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 ${className}`}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-white rounded-lg">
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (missions.length === 0) {
    return (
      <Card className={`bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold mb-2">مأموریت‌های امروز</h3>
          <p className="text-gray-600 mb-4">
            هنوز مأموریتی برای امروز تعریف نشده است
          </p>
          <Button onClick={fetchMissions} className="bg-purple-500 hover:bg-purple-600">
            دریافت مأموریت‌ها
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">🎯</span>
          <span>مأموریت‌های امروز</span>
          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
            {missions.filter(m => m.isCompleted).length}/{missions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {missions.map((mission) => {
          const progress = getMissionProgress(mission, userStats)
          const isCompleted = mission.isCompleted || progress === 100
          const icon = getMissionIcon(mission.title)
          const colorClass = getMissionColor(progress)

          return (
            <div
              key={mission.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                isCompleted 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{icon}</div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {mission.title}
                    </h4>
                    {isCompleted && <span className="text-green-600">✅</span>}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {mission.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-3">
                      <Progress 
                        value={progress} 
                        className="h-2 bg-gray-200"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {progress}% تکمیل شده
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={colorClass}>
                        {isCompleted ? 'تکمیل شده' : `+${mission.xpReward} XP`}
                      </Badge>
                      
                      {!isCompleted && progress === 100 && (
                        <Button
                          size="sm"
                          onClick={() => completeMission(mission.id)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          تکمیل
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        
        {/* انگیزه‌بخشی */}
        <div className="mt-4 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🚀</span>
            <span className="text-sm font-medium text-blue-800">
              {missions.filter(m => m.isCompleted).length === missions.length 
                ? 'تبریک! همه مأموریت‌های امروز را تکمیل کردید! 🎉'
                : `${missions.length - missions.filter(m => m.isCompleted).length} مأموریت دیگر تا تکمیل همه!`
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
















