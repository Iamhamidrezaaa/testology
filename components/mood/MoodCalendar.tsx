'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface MoodEntry {
  id: string
  mood: string
  note?: string
  date: string
}

interface MoodStats {
  totalEntries: number
  moodDistribution: Record<string, number>
  averageMood: number
}

interface MoodCalendarProps {
  className?: string
}

export default function MoodCalendar({ className = "" }: MoodCalendarProps) {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [stats, setStats] = useState<MoodStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    fetchMoodData()
  }, [currentDate])

  const fetchMoodData = async () => {
    try {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      
      const response = await fetch(`/api/mood?year=${year}&month=${month}`)
      if (response.ok) {
        const data = await response.json()
        setMoodEntries(data.calendarData || [])
        setStats(data.stats || null)
      }
    } catch (error) {
      console.error('Error fetching mood data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMoodColor = (mood: string): string => {
    const colors: Record<string, string> = {
      '😊': 'bg-green-100 text-green-800',
      '😐': 'bg-gray-100 text-gray-800',
      '😢': 'bg-blue-100 text-blue-800',
      '😠': 'bg-red-100 text-red-800',
      '😴': 'bg-purple-100 text-purple-800'
    }
    return colors[mood] || 'bg-gray-100 text-gray-800'
  }

  const getMoodLabel = (mood: string): string => {
    const labels: Record<string, string> = {
      '😊': 'عالی',
      '😐': 'عادی',
      '😢': 'غمگین',
      '😠': 'عصبانی',
      '😴': 'خسته'
    }
    return labels[mood] || 'نامشخص'
  }

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const current = new Date(startDate)
    
    for (let i = 0; i < 42; i++) { // 6 weeks
      const dayMood = moodEntries.find(entry => 
        new Date(entry.date).toDateString() === current.toDateString()
      )
      
      days.push({
        date: new Date(current),
        mood: dayMood?.mood,
        note: dayMood?.note,
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === new Date().toDateString()
      })
      
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  if (loading) {
    return (
      <Card className={`bg-gradient-to-br from-indigo-50 to-purple-100 border-indigo-200 ${className}`}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  const calendarDays = generateCalendarDays()
  const monthNames = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ]

  return (
    <Card className={`bg-gradient-to-br from-indigo-50 to-purple-100 border-indigo-200 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="text-2xl">📊</span>
            <span>تقویم احساسات</span>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              ←
            </Button>
            <span className="font-medium min-w-[120px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              →
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* آمار ماهانه */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">
                {stats.totalEntries}
              </div>
              <div className="text-xs text-gray-600">روز ثبت شده</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.averageMood.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">میانگین احساس</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((stats.totalEntries / 30) * 100)}%
              </div>
              <div className="text-xs text-gray-600">نرخ ثبت</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(stats.moodDistribution).length}
              </div>
              <div className="text-xs text-gray-600">انواع احساس</div>
            </div>
          </div>
        )}

        {/* تقویم */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                aspect-square p-1 rounded-lg border transition-all duration-200
                ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                ${day.isToday ? 'ring-2 ring-indigo-500' : ''}
                ${day.mood ? 'hover:shadow-md cursor-pointer' : ''}
              `}
              title={day.mood ? `${getMoodLabel(day.mood)}${day.note ? ` - ${day.note}` : ''}` : ''}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-xs font-medium text-gray-600 mb-1">
                  {day.date.getDate()}
                </div>
                {day.mood && (
                  <div className={`text-lg ${getMoodColor(day.mood)} rounded-full w-6 h-6 flex items-center justify-center`}>
                    {day.mood}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* راهنمای رنگ‌ها */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {['😊', '😐', '😢', '😠', '😴'].map(mood => (
            <Badge key={mood} className={`${getMoodColor(mood)} text-xs`}>
              {mood} {getMoodLabel(mood)}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
















