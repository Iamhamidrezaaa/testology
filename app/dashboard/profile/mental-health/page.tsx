'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TestResult } from '@prisma/client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface MoodEntry {
  id: string
  createdAt: string
  moodScore: number
  summary: string
}

interface MentalHealthData {
  date: string
  score: number
  testName: string
  category: string
}

export default function MentalHealthProfilePage() {
  const { data: session, status } = useSession()
  const [tests, setTests] = useState<TestResult[] | null>(null)
  const [moodHistory, setMoodHistory] = useState<MoodEntry[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState<string>('')

  useEffect(() => {
    if (status === 'authenticated') {
      // دریافت تست‌ها
      fetch('/api/user/tests')
        .then((res) => res.json())
        .then((data) => {
          setTests(data.tests)
        })
        .catch((err) => {
          console.error('Error fetching tests:', err)
        })

      // دریافت تاریخچه خلق‌وخو
      fetch('/api/user/mood-profile')
        .then((res) => res.json())
        .then((data) => {
          setMoodHistory(data.moods)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Error fetching mood profile:', err)
          setLoading(false)
        })
    }
  }, [status])

  useEffect(() => {
    if (tests && tests.length > 0) {
      // تحلیل کلی وضعیت روان‌شناسی
      fetch('/api/analyze-mental-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tests })
      })
      .then(res => res.json())
      .then(data => setAnalysis(data.analysis))
      .catch(err => console.error('Error analyzing mental health:', err))
    }
  }, [tests])

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    )
  }

  if (!tests || tests.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        برای نمایش پروفایل روان‌شناسی، ابتدا چند تست انجام دهید.
      </div>
    )
  }

  // آماده‌سازی داده‌ها برای نمودار تست‌ها
  const testChartData: MentalHealthData[] = tests
    .filter((test: any) => test.score !== null && test.category)
    .map((test: any) => ({
      date: new Date(test.createdAt).toLocaleDateString('fa-IR'),
      score: test.score!,
      testName: test.testName || 'نامشخص',
      category: test.testSlug
    }))
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // آماده‌سازی داده‌ها برای نمودار خلق‌وخو
  const moodChartData = moodHistory?.map((entry: any) => ({
    date: new Date(entry.createdAt).toLocaleDateString('fa-IR'),
    score: entry.moodScore,
    summary: entry.summary
  })).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()) || []

  // محاسبه آمار کلی
  const totalTests = tests.length
  const averageScore = tests
    .filter((test: any) => test.score !== null)
    .reduce((sum: any, test: any) => sum + (test.score || 0), 0) / tests.filter((test: any) => test.score !== null).length

  const latestMood = moodHistory?.[0]

  return (
    <div className="space-y-6">
      {/* خلاصه وضعیت روانی */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">🧠 خلاصه وضعیت روانی شما</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalTests}</div>
              <div className="text-sm text-blue-600">تست انجام‌شده</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{averageScore.toFixed(1)}</div>
              <div className="text-sm text-green-600">میانگین امتیاز</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {latestMood?.moodScore ?? '—'}
              </div>
              <div className="text-sm text-purple-600">امتیاز خلق‌وخو</div>
            </div>
          </div>
          
          {latestMood && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">وضعیت فعلی:</p>
              <p className="font-semibold text-gray-800">{latestMood.summary}</p>
              <p className="text-xs text-gray-500 mt-1">
                آخرین بروزرسانی: {new Date(latestMood.createdAt).toLocaleDateString('fa-IR')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* نمودار تغییرات خلق‌وخو */}
      {moodChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📈 نمودار تغییرات خلق‌وخو</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={moodChartData}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => `تاریخ: ${value}`}
                    formatter={(value, name) => [`امتیاز خلق‌وخو: ${value}`, 'خلق‌وخو']}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorMood)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* نمودار پیشرفت تست‌ها */}
      {testChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📊 نمودار پیشرفت تست‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={testChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => `تاریخ: ${value}`}
                    formatter={(value, name) => [`امتیاز: ${value}`, 'نمره']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* تحلیل کلی */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>💬 تحلیل ترکیبی وضعیت روان‌شناسی</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{analysis}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* کارت خلاصه وضعیت روانی */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 خلاصه وضعیت روانی فعلی</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* وضعیت کلی */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">وضعیت کلی</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">تست‌های انجام‌شده:</span>
                  <span className="font-medium">{totalTests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">میانگین امتیاز:</span>
                  <span className="font-medium">{averageScore.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">آخرین تست:</span>
                  <span className="font-medium">
                    {new Date(tests[0].createdAt).toLocaleDateString('fa-IR')}
                  </span>
                </div>
              </div>
            </div>

            {/* توصیه‌ها */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">توصیه‌های کلی</h4>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-green-50 rounded text-green-800">
                  ✅ تست‌های منظم انجام دهید
                </div>
                <div className="p-2 bg-blue-50 rounded text-blue-800">
                  💡 نتایج را با متخصص در میان بگذارید
                </div>
                <div className="p-2 bg-purple-50 rounded text-purple-800">
                  🎯 روی نقاط قوت خود تمرکز کنید
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* لیست تست‌های اخیر */}
      <Card>
        <CardHeader>
          <CardTitle>📋 تست‌های اخیر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tests.slice(0, 5).map((test) => (
              <div key={test.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <div className="font-medium">{test.testName}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(test.createdAt).toLocaleDateString('fa-IR')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{test.score ?? '—'}</div>
                  <div className="text-sm text-gray-500">امتیاز</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
