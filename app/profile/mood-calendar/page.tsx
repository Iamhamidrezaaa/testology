'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import ResponsiveContainer from '@/components/responsive/ResponsiveContainer'
import ResponsiveGrid from '@/components/responsive/ResponsiveGrid'
import MobileOptimizedCard from '@/components/responsive/MobileOptimizedCard'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

interface MoodLog {
  id: string
  date: string
  mood: string
  sleepHour?: number
  energy?: number
  stress?: number
  note?: string
  activities: string[]
  weather?: string
  social?: number
  exercise: boolean
  meditation: boolean
}

interface MoodData {
  moodLogs: MoodLog[]
  stats: {
    totalEntries: number
    averageEnergy: number
    averageStress: number
    averageSleep: number
    exerciseDays: number
    meditationDays: number
    moodCounts: Record<string, number>
  }
  monthlyData: Record<string, MoodLog[]>
}

export default function MoodCalendarPage() {
  const [data, setData] = useState<MoodData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showMoodForm, setShowMoodForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [moodMap, setMoodMap] = useState<Record<string, string>>({})

  // فرم mood
  const [moodForm, setMoodForm] = useState({
    mood: '',
    sleepHour: '',
    energy: '',
    stress: '',
    note: '',
    activities: '',
    weather: '',
    social: '',
    exercise: false,
    meditation: false
  })

  useEffect(() => {
    fetchMoodData()
  }, [])

  const fetchMoodData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/mood-log/all')
      
      if (!response.ok) {
        throw new Error('خطا در دریافت اطلاعات تقویم')
      }

      const result = await response.json()
      setData(result)

      // ایجاد نقشه mood برای تقویم
      const moodMapping: Record<string, string> = {}
      result.moodLogs.forEach((log: MoodLog) => {
        const dateKey = new Date(log.date).toISOString().split('T')[0]
        moodMapping[dateKey] = log.mood
      })
      setMoodMap(moodMapping)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته')
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    const dateKey = date.toISOString().split('T')[0]
    
    // بررسی اینکه آیا برای این تاریخ mood ثبت شده یا نه
    const existingMood = data?.moodLogs?.find(log => 
      new Date(log.date).toISOString().split('T')[0] === dateKey
    )

    if (existingMood) {
      setMoodForm({
        mood: existingMood.mood,
        sleepHour: existingMood.sleepHour?.toString() || '',
        energy: existingMood.energy?.toString() || '',
        stress: existingMood.stress?.toString() || '',
        note: existingMood.note || '',
        activities: existingMood.activities.join(', '),
        weather: existingMood.weather || '',
        social: existingMood.social?.toString() || '',
        exercise: existingMood.exercise,
        meditation: existingMood.meditation
      })
    } else {
      setMoodForm({
        mood: '',
        sleepHour: '',
        energy: '',
        stress: '',
        note: '',
        activities: '',
        weather: '',
        social: '',
        exercise: false,
        meditation: false
      })
    }
    
    setShowMoodForm(true)
  }

  const handleMoodSubmit = async () => {
    try {
      setSaving(true)
      
      const response = await fetch('/api/mood-log/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...moodForm,
          sleepHour: moodForm.sleepHour ? parseInt(moodForm.sleepHour) : null,
          energy: moodForm.energy ? parseInt(moodForm.energy) : null,
          stress: moodForm.stress ? parseInt(moodForm.stress) : null,
          social: moodForm.social ? parseInt(moodForm.social) : null,
          activities: moodForm.activities ? moodForm.activities.split(',').map((a: any) => a.trim()) : []
        })
      })

      if (response.ok) {
        alert('احساس روزانه با موفقیت ثبت شد!')
        setShowMoodForm(false)
        fetchMoodData() // به‌روزرسانی داده‌ها
      } else {
        const errorData = await response.json()
        alert(`خطا در ثبت: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error submitting mood:', error)
      alert('خطا در ثبت احساس')
    } finally {
      setSaving(false)
    }
  }

  const getMoodIcon = (mood: string): string => {
    switch (mood) {
      case '😊': return '😊'
      case '😐': return '😐'
      case '😢': return '😢'
      case '😠': return '😠'
      case '😴': return '😴'
      case '😌': return '😌'
      case '🤔': return '🤔'
      case '😤': return '😤'
      default: return '❓'
    }
  }

  const getMoodColor = (mood: string): string => {
    switch (mood) {
      case '😊': return 'bg-green-100 text-green-800'
      case '😐': return 'bg-gray-100 text-gray-800'
      case '😢': return 'bg-blue-100 text-blue-800'
      case '😠': return 'bg-red-100 text-red-800'
      case '😴': return 'bg-purple-100 text-purple-800'
      case '😌': return 'bg-yellow-100 text-yellow-800'
      case '🤔': return 'bg-indigo-100 text-indigo-800'
      case '😤': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <ResponsiveContainer maxWidth="lg" padding="md" className="space-y-6">
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <Skeleton className="h-96 w-full" />
      </ResponsiveContainer>
    )
  }

  if (error) {
    return (
      <ResponsiveContainer maxWidth="lg" padding="md">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2 text-red-800">خطا در دریافت تقویم</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchMoodData} className="bg-red-500 hover:bg-red-600">
              تلاش مجدد
            </Button>
          </CardContent>
        </Card>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer maxWidth="lg" padding="md" className="space-y-6">
      {/* هدر */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          📅 تقویم روان‌شناسی من
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          ثبت روزانه احساسات، خواب، انرژی و فعالیت‌های خود
        </p>
      </div>

      {/* آمار کلی */}
      {data && (
        <ResponsiveGrid 
          cols={{ default: 2, sm: 2, md: 4 }} 
          gap="sm"
          className="mb-6"
        >
          <MobileOptimizedCard 
          title="کل ثبت‌ها"
          icon="📊"
          gradient={true}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {data.stats.totalEntries}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">روز</div>
            </div>
          </MobileOptimizedCard>

          <MobileOptimizedCard 
            title="میانگین انرژی"
            icon="⚡"
            gradient={true}
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {data.stats.averageEnergy.toFixed(1)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">از 10</div>
            </div>
          </MobileOptimizedCard>

          <MobileOptimizedCard 
            title="روزهای ورزش"
            icon="💪"
            gradient={true}
            className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {data.stats.exerciseDays}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">روز</div>
            </div>
          </MobileOptimizedCard>

          <MobileOptimizedCard 
            title="روزهای مدیتیشن"
            icon="🧘"
            gradient={true}
            className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {data.stats.meditationDays}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">روز</div>
            </div>
          </MobileOptimizedCard>
        </ResponsiveGrid>
      )}

      {/* تقویم */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">📅</span>
            <span>تقویم احساسات</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Calendar
              value={selectedDate}
              onChange={(value) => {
                if (value instanceof Date) {
                  handleDateSelect(value);
                }
              }}
              tileContent={({ date }) => {
                const dateKey = date.toISOString().split('T')[0]
                const mood = moodMap[dateKey]
                
                if (mood) {
                  return (
                    <div className="flex justify-center items-center h-full">
                      <span className="text-lg">{getMoodIcon(mood)}</span>
                    </div>
                  )
                }
                return null
              }}
              className="w-full max-w-md"
            />
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">روی هر روز کلیک کنید تا احساس آن روز را ثبت یا ویرایش کنید</p>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(data?.stats?.moodCounts || {}).map(([mood, count]) => (
                <Badge key={mood} className={`${getMoodColor(mood)} text-xs`}>
                  {getMoodIcon(mood)} {count} بار
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* فرم ثبت mood */}
      {showMoodForm && (
        <Card className="bg-gradient-to-br from-pink-50 to-purple-100 border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">😊</span>
              <span>ثبت احساس {selectedDate.toLocaleDateString('fa-IR')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['😊', '😐', '😢', '😠', '😴', '😌', '🤔', '😤'].map((mood: any) => (
                <button
                  key={mood}
                  onClick={() => setMoodForm({ ...moodForm, mood })}
                  className={`p-3 rounded-lg text-2xl ${
                    moodForm.mood === mood ? 'bg-pink-200' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  ساعت خواب شب قبل
                </label>
                <Input
                  type="number"
                  value={moodForm.sleepHour}
                  onChange={(e) => setMoodForm({ ...moodForm, sleepHour: e.target.value })}
                  placeholder="مثال: 8"
                  min="0"
                  max="12"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  سطح انرژی (1-10)
                </label>
                <Input
                  type="number"
                  value={moodForm.energy}
                  onChange={(e) => setMoodForm({ ...moodForm, energy: e.target.value })}
                  placeholder="مثال: 7"
                  min="1"
                  max="10"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  سطح استرس (1-10)
                </label>
                <Input
                  type="number"
                  value={moodForm.stress}
                  onChange={(e) => setMoodForm({ ...moodForm, stress: e.target.value })}
                  placeholder="مثال: 3"
                  min="1"
                  max="10"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  تعامل اجتماعی (1-10)
                </label>
                <Input
                  type="number"
                  value={moodForm.social}
                  onChange={(e) => setMoodForm({ ...moodForm, social: e.target.value })}
                  placeholder="مثال: 6"
                  min="1"
                  max="10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                فعالیت‌های انجام شده (با کاما جدا کنید)
              </label>
              <Input
                value={moodForm.activities}
                onChange={(e) => setMoodForm({ ...moodForm, activities: e.target.value })}
                placeholder="مثال: مطالعه, ورزش, کار"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                یادداشت روزانه
              </label>
              <Textarea
                value={moodForm.note}
                onChange={(e) => setMoodForm({ ...moodForm, note: e.target.value })}
                placeholder="احساسات و تجربیات امروز..."
                rows={3}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={moodForm.exercise}
                  onChange={(e) => setMoodForm({ ...moodForm, exercise: e.target.checked })}
                />
                <span className="text-sm text-gray-700">💪 ورزش کردم</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={moodForm.meditation}
                  onChange={(e) => setMoodForm({ ...moodForm, meditation: e.target.checked })}
                />
                <span className="text-sm text-gray-700">🧘 مدیتیشن کردم</span>
              </label>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowMoodForm(false)}
                className="text-sm"
                disabled={saving}
              >
                لغو
              </Button>
              <Button
                onClick={handleMoodSubmit}
                disabled={saving || !moodForm.mood}
                className="bg-pink-500 hover:bg-pink-600 text-sm"
              >
                {saving ? 'در حال ذخیره...' : 'ذخیره احساس'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </ResponsiveContainer>
  )
}






















