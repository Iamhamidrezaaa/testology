'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { TestResult } from '@prisma/client'
import { format } from 'date-fns-jalali'
import Link from 'next/link'
import { PDFDownload } from '@/components/ui/pdf-download'
import { ChatBot } from '@/components/ui/chat-bot'

export default function ResultPage() {
  const { id } = useParams()
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [combinedAnalysis, setCombinedAnalysis] = useState<string>('')
  const [showChatBot, setShowChatBot] = useState(false)

  useEffect(() => {
    if (id) {
      fetch(`/api/test-result/${id}`)
        .then(res => res.json())
        .then(data => {
          setResult(data.test)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching result:', err)
          setLoading(false)
        })
    }
  }, [id])

  useEffect(() => {
    if (result) {
      // دریافت تحلیل ترکیبی
      fetch('/api/analyze/combined', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId: result.id })
      })
      .then(res => res.json())
      .then(data => setCombinedAnalysis(data.analysis))
      .catch(err => console.error('Error fetching combined analysis:', err))
    }
  }, [result])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    )
  }

  if (!result) {
    return (
      <div className="text-center py-10">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">نتیجه تست یافت نشد</h2>
        <p className="text-gray-600 mb-4">احتمالاً این تست وجود ندارد یا شما دسترسی لازم را ندارید.</p>
        <Link href="/dashboard/tests">
          <Button>بازگشت به داشبورد</Button>
        </Link>
      </div>
    )
  }

  const getScoreColor = (score: number | null, testSlug: string) => {
    if (score === null) return 'bg-gray-100 text-gray-600'
    
    switch (testSlug) {
      case 'rosenberg':
        if (score >= 30) return 'bg-green-100 text-green-800'
        if (score >= 20) return 'bg-yellow-100 text-yellow-800'
        return 'bg-red-100 text-red-800'
      
      case 'gad7':
      case 'phq9':
        if (score <= 4) return 'bg-green-100 text-green-800'
        if (score <= 9) return 'bg-yellow-100 text-yellow-800'
        return 'bg-red-100 text-red-800'
      
      case 'swls':
        if (score >= 25) return 'bg-green-100 text-green-800'
        if (score >= 15) return 'bg-yellow-100 text-yellow-800'
        return 'bg-red-100 text-red-800'
      
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getScoreLabel = (score: number | null, testSlug: string) => {
    if (score === null) return 'نامشخص'
    
    switch (testSlug) {
      case 'rosenberg':
        if (score >= 30) return 'عزت نفس بالا'
        if (score >= 20) return 'عزت نفس متوسط'
        return 'عزت نفس پایین'
      
      case 'gad7':
        if (score <= 4) return 'اضطراب کم'
        if (score <= 9) return 'اضطراب متوسط'
        return 'اضطراب بالا'
      
      case 'phq9':
        if (score <= 4) return 'افسردگی کم'
        if (score <= 9) return 'افسردگی متوسط'
        return 'افسردگی بالا'
      
      case 'swls':
        if (score >= 25) return 'رضایت بالا'
        if (score >= 15) return 'رضایت متوسط'
        return 'رضایت پایین'
      
      default:
        return 'طبیعی'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* هدر */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{result.testName}</h1>
          <p className="text-gray-600">
            انجام‌شده در {format(new Date(result.createdAt), 'yyyy/MM/dd - HH:mm')}
          </p>
        </div>
        <Badge className={getScoreColor(result.score, result.testSlug)}>
          {getScoreLabel(result.score, result.testSlug)}
        </Badge>
      </div>

      {/* امتیاز و وضعیت */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">📊 نتایج تست</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-blue-600">{result.score ?? '—'}</div>
              <div className="text-sm text-blue-600">امتیاز نهایی</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-4xl font-bold text-green-600">
                {result.completed ? '✅' : '⏳'}
              </div>
              <div className="text-sm text-green-600">
                {result.completed ? 'تکمیل‌شده' : 'در حال انجام'}
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-4xl font-bold text-purple-600">
                {result.testSlug}
              </div>
              <div className="text-sm text-purple-600">نوع تست</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* تحلیل اصلی */}
      {result.resultText && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">🧠 تحلیل روان‌شناسی</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {result.resultText}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* تحلیل ترکیبی */}
      {combinedAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">🔬 تحلیل ترکیبی مرحله‌ای</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {combinedAnalysis}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* پاسخ‌های خام */}
      {result.rawAnswers && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">📝 پاسخ‌های شما</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.isArray(result.rawAnswers) ? (
                result.rawAnswers.map((answer, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">سوال {index + 1}</span>
                    <span className="font-medium">{answer}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-4">
                  پاسخ‌ها در دسترس نیست
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* دکمه‌های عملیات */}
      <div className="flex justify-between items-center">
        <Link href="/dashboard/tests">
          <Button variant="outline">بازگشت به لیست تست‌ها</Button>
        </Link>
        <div className="space-x-2">
          <PDFDownload 
            testName={result.testName || ''}
            score={result.score || 0}
            analysis={result.resultText || ''}
            combinedAnalysis={combinedAnalysis}
          />
          <Button 
            variant="outline" 
            onClick={() => setShowChatBot(!showChatBot)}
          >
            💬 چت با روانشناس
          </Button>
        </div>
      </div>

      {/* چت‌بات */}
      {showChatBot && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">🤖 چت‌بات روانشناس</CardTitle>
          </CardHeader>
          <CardContent>
            <ChatBot 
              testResult={result}
              combinedAnalysis={combinedAnalysis}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}