'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function TestAnalyticsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRecalculating, setIsRecalculating] = useState(false)

  useEffect(() => {
    if (session?.user && !(session.user as any).isAdmin) {
      router.push('/')
      return
    }

    fetchAnalytics()
  }, [session])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/test-analytics')
      if (!response.ok) throw new Error('خطا در دریافت آمار')
      
      const data = await response.json()
      setAnalytics(data.analytics)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecalculate = async () => {
    try {
      setIsRecalculating(true)
      const response = await fetch('/api/admin/test-analytics/recalculate', {
        method: 'POST'
      })
      if (!response.ok) throw new Error('خطا در محاسبه مجدد')
      
      await fetchAnalytics()
      alert('آمار با موفقیت محاسبه شد')
    } catch (error) {
      console.error('Error recalculating:', error)
      alert('خطا در محاسبه مجدد')
    } finally {
      setIsRecalculating(false)
    }
  }

  if (isLoading) {
    return <div className="p-6">در حال بارگذاری...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">آمار تست‌ها</h1>
      <button
        onClick={handleRecalculate}
        disabled={isRecalculating}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isRecalculating ? 'در حال محاسبه...' : 'محاسبه مجدد'}
      </button>
      
      {analytics && (
        <div className="mt-4">
          <pre>{JSON.stringify(analytics, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}