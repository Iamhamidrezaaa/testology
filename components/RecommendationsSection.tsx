'use client'

import { useEffect, useState } from 'react'
import { RecommendationBox } from './RecommendationBox'

interface Recommendation {
  id: string
  title: string
  description: string
  done: boolean
  link: string
  type: 'test' | 'practice' | 'referral'
}

export function RecommendationsSection() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  useEffect(() => {
    const fetchRecommendations = async () => {
      const res = await fetch('/api/recommendations')
      const data = await res.json()
      setRecommendations(data)
    }
    fetchRecommendations()
  }, [])

  if (recommendations.length === 0) return null

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">پیشنهادات هوشمند</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map((recommendation) => (
          <RecommendationBox
            key={recommendation.id}
            title={recommendation.title}
            description={recommendation.description}
            done={recommendation.done}
            link={recommendation.link}
            type={recommendation.type}
            status={recommendation.done ? 'completed' : 'pending'}
          />
        ))}
      </div>
    </div>
  )
} 