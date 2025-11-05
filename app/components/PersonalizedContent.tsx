'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Recommendation {
  id: string
  blogPostId: string | null
  type: string
  customText: string | null
  reason: string | null
  blogPost?: {
    title: string
    slug: string
  }
}

export function PersonalizedContent() {
  const { data: session } = useSession()
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.user?.id) return

    const fetchRecommendation = async () => {
      try {
        const response = await fetch('/api/suggest-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('خطا در دریافت پیشنهادات')
        }

        const data = await response.json()
        setRecommendation(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطای ناشناخته')
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendation()
  }, [session?.user?.id])

  if (loading) {
    return (
      <div className="p-4 mt-6 border rounded bg-slate-50 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 mt-6 border rounded bg-red-50 text-red-600">
        <p>خطا در دریافت پیشنهادات: {error}</p>
      </div>
    )
  }

  if (!recommendation) {
    return null
  }

  return (
    <div className="p-4 mt-6 border rounded bg-slate-50">
      <h3 className="font-bold text-lg mb-4">📚 پیشنهاد ویژه برای شما:</h3>
      
      {recommendation.blogPostId && recommendation.blogPost && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">مقاله پیشنهادی:</h4>
          <a 
            href={`/blog/${recommendation.blogPost.slug}`}
            className="text-blue-600 hover:text-blue-800 underline"
            onClick={() => {
              // ثبت کلیک
              fetch('/api/recommendations/interact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  recommendationId: recommendation.id,
                  type: 'click'
                })
              })
            }}
          >
            {recommendation.blogPost.title}
          </a>
        </div>
      )}

      {recommendation.customText && (
        <div className="space-y-4">
          {recommendation.customText.split('\n\n').map((text, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-2">
                {index === 0 ? 'تمرین فردی:' : 'نکته کاربردی:'}
              </h4>
              <p className="text-gray-700">{text}</p>
            </div>
          ))}
        </div>
      )}

      {recommendation.reason && (
        <div className="mt-4 text-sm text-gray-500">
          <p>دلیل پیشنهاد: {recommendation.reason}</p>
        </div>
      )}
    </div>
  )
} 