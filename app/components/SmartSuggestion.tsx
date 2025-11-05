'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface TestSuggestion {
  testId: string
  title: string
  description: string
  reason: string
  priority: number
}

export function SmartSuggestion() {
  const [suggestions, setSuggestions] = useState<TestSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSuggestions()
  }, [])

  const fetchSuggestions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/suggest-tests', {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('خطا در دریافت پیشنهادات')
      }

      const data = await response.json()
      setSuggestions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت پیشنهادات')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mt-6 p-4 border rounded bg-gray-50">
        <p className="text-gray-600">🔍 در حال تحلیل رفتار شما...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-6 p-4 border rounded bg-red-50">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">✨ پیشنهادات هوشمند برای شما</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.testId}
            className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <h4 className="font-medium text-gray-900 mb-2">{suggestion.title}</h4>
            <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{suggestion.reason}</span>
              <Link
                href={`/tests/${suggestion.testId}`}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                مشاهده تست →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 