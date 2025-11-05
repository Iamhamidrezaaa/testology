'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import type { MoodEntry, Suggestion } from '@/types/dashboard'

export default function DashboardInsights() {
  const { toast } = useToast()
  const [moodData, setMoodData] = useState<MoodEntry[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moodRes, suggestionsRes] = await Promise.all([
          fetch('/api/dashboard/mood'),
          fetch('/api/dashboard/suggestions')
        ])

        if (!moodRes.ok || !suggestionsRes.ok) {
          throw new Error('خطا در دریافت داده‌ها')
        }

        const mood = await moodRes.json()
        const sugg = await suggestionsRes.json()

        setMoodData(mood)
        setSuggestions(sugg)
      } catch (error) {
        console.error('خطا در دریافت داده‌های داشبورد:', error)
        toast({
          title: 'خطا',
          description: 'در دریافت داده‌های داشبورد مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const pendingCount = suggestions.filter(s => !s.completed).length
  const progress = suggestions.length > 0 
    ? Math.round(((suggestions.length - pendingCount) / suggestions.length) * 100) 
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="mr-2 text-sm text-muted-foreground">در حال بارگذاری...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold mb-2">نمودار وضعیت روانی شما</h2>
        <div className="bg-white rounded-lg p-4 shadow">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date: string) => new Date(date).toLocaleDateString('fa-IR')}
              />
              <YAxis domain={[0, 10]} />
              <Tooltip 
                labelFormatter={(date: string) => new Date(date).toLocaleDateString('fa-IR')}
                formatter={(value: number) => [`${value} از ۱۰`, 'وضعیت روانی']}
              />
              <Line 
                type="monotone" 
                dataKey="moodScore" 
                stroke="#8884d8" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">پیشنهادات برای ادامه مسیر</h2>
        <div className="space-y-4">
          {suggestions.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg p-4 flex justify-between items-center border shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={item.type === 'test' ? 'default' : item.type === 'exercise' ? 'outline' : 'secondary'}>
                    {item.type === 'test' ? 'تست' : item.type === 'exercise' ? 'تمرین' : 'ارجاع'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString('fa-IR')}
                  </span>
                </div>
              </div>
              <div>
                {item.completed ? (
                  <Badge variant="default">انجام‌شده ✅</Badge>
                ) : (
                  <Button size="sm" variant="default">شروع</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">پیگیری‌های عقب‌افتاده</h2>
        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {pendingCount > 0 
              ? `${pendingCount} مورد نیاز به پیگیری دارید.` 
              : 'همه پیگیری‌ها انجام شده ✅'}
          </p>
        </div>
      </section>
    </div>
  )
} 