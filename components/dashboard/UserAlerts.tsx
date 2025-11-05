'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

type AlertData = {
  critical: boolean
  message: string
  testName?: string
  score?: number
  category?: string
}

export default function UserAlerts() {
  const [alert, setAlert] = useState<AlertData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        const res = await axios.get<{ data: AlertData }>('/api/user/alerts')
        setAlert(res.data.data)
      } catch (err) {
        console.error('Error fetching alerts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAlert()
  }, [])

  if (loading || !alert?.critical) return null

  return (
    <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 mb-4 rounded-lg shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-2xl">🚨</span>
        </div>
        <div className="mr-3">
          <h3 className="font-bold text-lg mb-1">هشدار روانی!</h3>
          <p className="text-sm mb-2">{alert.message}</p>
          {alert.testName && (
            <p className="text-sm mb-2">
              تست: {alert.testName} - امتیاز: {alert.score}
            </p>
          )}
          <div className="mt-3">
            <Link
              href="/dashboard/growth-path"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              مشاهده مسیر رشد
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 