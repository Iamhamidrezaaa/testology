'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LevelsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [levels, setLevels] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user && !(session.user as any).isAdmin) {
      router.push('/')
      return
    }

    fetchLevels()
  }, [session])

  const fetchLevels = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/levels')
      if (!response.ok) throw new Error('خطا در دریافت سطوح')
      
      const data = await response.json()
      setLevels(data.levels || [])
    } catch (error) {
      console.error('Error fetching levels:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="p-6">در حال بارگذاری...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">سطوح کاربری</h1>
      {levels.length === 0 ? (
        <p>هیچ سطحی یافت نشد</p>
      ) : (
        <div>
          {/* TODO: Display levels */}
        </div>
      )}
    </div>
  )
}