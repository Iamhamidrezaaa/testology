'use client'

import { useState, useEffect } from 'react'
import { TestAnalytics } from '@/types/test'

interface TestAnalyticsPanelProps {
  testId: string
}

interface AnalyticsData {
  totalAttempts: number
  averageScore: number
  completionRate: number
  scoreDistribution: {
    range: string
    count: number
  }[]
  recentResults: {
    date: string
    count: number
  }[]
}

export default function TestAnalyticsPanel({ testId }: TestAnalyticsPanelProps) {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/tests/${testId}/analytics`)
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        } else {
          throw new Error('خطا در دریافت اطلاعات آماری')
        }
      } catch (error) {
        console.error('خطا در دریافت اطلاعات آماری:', error)
        alert('خطا در دریافت اطلاعات آماری')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [testId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center text-gray-600 py-8">
        اطلاعات آماری در دسترس نیست
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* کارت‌های آماری */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            تعداد کل شرکت‌کنندگان
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {analytics.totalAttempts}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            میانگین امتیاز
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {analytics.averageScore.toFixed(1)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            نرخ تکمیل تست
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {(analytics.completionRate * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* نمودار توزیع امتیازات */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          توزیع امتیازات
        </h3>
        <div className="h-64">
          <div className="flex items-end h-48 space-x-2">
            {analytics.scoreDistribution.map((item, index) => (
              <div key={index} className="flex-1">
                <div
                  className="bg-blue-600 rounded-t"
                  style={{
                    height: `${(item.count / Math.max(...analytics.scoreDistribution.map(d => d.count))) * 100}%`
                  }}
                ></div>
                <div className="text-center text-sm text-gray-600 mt-2">
                  {item.range}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* نمودار نتایج اخیر */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          نتایج اخیر
        </h3>
        <div className="h-64">
          <div className="flex items-end h-48 space-x-2">
            {analytics.recentResults.map((item, index) => (
              <div key={index} className="flex-1">
                <div
                  className="bg-green-600 rounded-t"
                  style={{
                    height: `${(item.count / Math.max(...analytics.recentResults.map(d => d.count))) * 100}%`
                  }}
                ></div>
                <div className="text-center text-sm text-gray-600 mt-2">
                  {new Date(item.date).toLocaleDateString('fa-IR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 