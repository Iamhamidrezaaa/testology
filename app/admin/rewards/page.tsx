'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function RewardsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [rewards, setRewards] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user && !(session.user as any).isAdmin) {
      router.push('/')
      return
    }

    fetchRewards()
  }, [session])

  const fetchRewards = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/points')
      if (!response.ok) throw new Error('خطا در دریافت پاداش‌ها')
      
      const data = await response.json()
      setRewards(data.rewards || [])
    } catch (error) {
      console.error('Error fetching rewards:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="p-6">در حال بارگذاری...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">پاداش‌ها</h1>
      {rewards.length === 0 ? (
        <p>هیچ پاداشی یافت نشد</p>
      ) : (
        <div>
          {/* TODO: Display rewards */}
        </div>
      )}
    </div>
  )
}