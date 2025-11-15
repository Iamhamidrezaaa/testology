/**
 * صفحه داشبورد تست‌ها - نسخه به‌روزرسانی شده
 * استفاده از API جدید /api/user/tests
 */

'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { format } from 'date-fns-jalali'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { getUserTestResults } from '@/lib/api-tests'

interface TestResultRecord {
  id: string
  userId: string | null
  testId: string
  testName: string | null
  testSlug: string | null
  score: number | null
  result: string | null
  severity: string | null
  interpretation: any[] | null
  subscales: any[] | null
  createdAt: string
  updatedAt: string
}

export default function TestsDashboardPage() {
  const { data: session, status } = useSession()
  const [results, setResults] = useState<TestResultRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<TestResultRecord | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      if (status !== 'authenticated' || !session?.user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // گرفتن userId از session یا localStorage (موقت)
        const userId = (session.user as any)?.id || 
                      localStorage.getItem('testology_userId') || 
                      'demo-user'

        const data = await getUserTestResults(userId)
        
        if (data.success) {
          setResults(data.results)
        } else {
          setError('خطا در دریافت نتایج')
        }
      } catch (e: any) {
        console.error('Error fetching test results:', e)
        setError(e.message || 'خطای ناشناخته')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [status, session])

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">داشبورد تست‌ها</h1>
        <Link href="/tests">
          <Button>مشاهده همه تست‌ها</Button>
        </Link>
      </div>

      {/* آمار کلی */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              کل تست‌های انجام شده
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* لیست نتایج */}
      {results.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            هنوز تستی در حساب شما ثبت نشده است.
            <Link href="/tests" className="block mt-4">
              <Button>شروع تست جدید</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">نتایج تست‌های شما</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result) => (
              <Card key={result.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-primary">
                    {result.testName || result.testId}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    🗓 تاریخ: {format(new Date(result.createdAt), 'yyyy/MM/dd')}
                  </p>
                  {result.score !== null && (
                    <p className="text-sm text-muted-foreground">
                      📊 امتیاز: {result.score.toFixed(2)}
                    </p>
                  )}
                  {result.result && (
                    <p className="text-sm text-muted-foreground">
                      📈 سطح: {result.result}
                    </p>
                  )}
                  <Button 
                    size="sm" 
                    className="mt-3 w-full"
                    onClick={() => setSelected(result)}
                  >
                    مشاهده جزئیات
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal نمایش جزئیات */}
      {selected && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">
                  جزئیات تست: {selected.testName || selected.testId}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelected(null)}
                >
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                {selected.score !== null && (
                  <div>
                    <p className="text-sm text-muted-foreground">نمره کلی</p>
                    <p className="text-2xl font-bold">{selected.score.toFixed(2)}</p>
                  </div>
                )}

                {selected.result && (
                  <div>
                    <p className="text-sm text-muted-foreground">سطح</p>
                    <Badge variant="secondary">{selected.result}</Badge>
                  </div>
                )}

                {selected.subscales && selected.subscales.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">زیرمقیاس‌ها</h3>
                    <ul className="space-y-1">
                      {selected.subscales.map((s: any) => (
                        <li key={s.id} className="flex justify-between">
                          <span>{s.label}:</span>
                          <strong>
                            {typeof s.score === 'number'
                              ? s.score.toFixed(2)
                              : s.score}
                          </strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selected.interpretation && selected.interpretation.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">تحلیل تست</h3>
                    <div className="space-y-3">
                      {selected.interpretation.map((chunk: any) => (
                        <div key={chunk.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          {chunk.title && (
                            <h4 className="font-semibold mb-1">{chunk.title}</h4>
                          )}
                          <p className="text-sm">{chunk.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  تاریخ: {format(new Date(selected.createdAt), 'yyyy/MM/dd HH:mm')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

