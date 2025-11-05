'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { format } from 'date-fns-jalali'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { TestResult, Test } from '@prisma/client'

interface TestData {
  userTestResults: TestResult[]
  availableTests: Test[]
  totalUserTests: number
  totalAvailableTests: number
}

export default function TestsDashboardPage() {
  const { data: session, status } = useSession()
  const [testData, setTestData] = useState<TestData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/user/tests')
        .then((res) => res.json())
        .then((data) => {
          setTestData(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Error fetching tests:', err)
          setLoading(false)
        })
    }
  }, [status])

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-6">
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

  if (!testData) {
    return (
      <div className="text-center text-muted-foreground py-10">
        خطا در بارگذاری تست‌ها
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* آمار کلی */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              کل تست‌ها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testData.totalAvailableTests}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              تست‌های انجام شده
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testData.totalUserTests}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              تست‌های باقی‌مانده
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {testData.totalAvailableTests - testData.totalUserTests}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              درصد تکمیل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {testData.totalAvailableTests > 0 
                ? Math.round((testData.totalUserTests / testData.totalAvailableTests) * 100)
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* تست‌های انجام شده */}
      {testData.userTestResults.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">تست‌های انجام شده</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testData.userTestResults.map((test) => (
              <Card key={test.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-primary">
                    {test.testName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    🗓 تاریخ: {format(new Date(test.createdAt), 'yyyy/MM/dd')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    📊 امتیاز: {test.score ?? '—'}
                  </p>
                  <Link href={`/results/${test.id}`}>
                    <Button size="sm" className="mt-3 w-full">
                      مشاهده تحلیل
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* تست‌های موجود */}
      <div>
        <h2 className="text-xl font-semibold mb-4">تست‌های موجود</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testData.availableTests.map((test) => {
            const isCompleted = testData.userTestResults.some(
              userTest => userTest.testName === test.testName
            )
            
            return (
              <Card key={test.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold text-primary">
                      {test.testName}
                    </CardTitle>
                    {isCompleted && (
                      <Badge variant="secondary" className="text-xs">
                        انجام شده
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {test.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    📂 دسته: {test.category}
                  </p>
                  <Link href={`/tests/${test.testSlug}`}>
                    <Button 
                      size="sm" 
                      className="mt-3 w-full"
                      variant={isCompleted ? "outline" : "default"}
                    >
                      {isCompleted ? 'انجام مجدد' : 'شروع تست'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}