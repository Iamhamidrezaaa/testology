'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function IntegrationsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [integrations, setIntegrations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user && !(session.user as any).isAdmin) {
      router.push('/')
      return
    }

    fetchIntegrations()
  }, [session])

  const fetchIntegrations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/integrations')
      if (!response.ok) throw new Error('خطا در دریافت ادغام‌ها')
      
      const data = await response.json()
      setIntegrations(data.integrations || [])
    } catch (error) {
      console.error('Error fetching integrations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="p-6">در حال بارگذاری...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ادغام‌ها</h1>
      {integrations.length === 0 ? (
        <p>هیچ ادغامی یافت نشد</p>
      ) : (
        <div>
          {/* TODO: Display integrations */}
        </div>
      )}
    </div>
  )
}