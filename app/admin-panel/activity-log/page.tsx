'use client'

import { useEffect, useState } from 'react'
import ActivityTable from '@/components/admin/Activity/UserActivityTable'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

type Activity = {
  id: string
  userId: string
  user: {
    name: string
    email: string
  }
  action: string
  metadata: any
  createdAt: string
  ip: string
}

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/activity')
        
        if (!response.ok) {
          throw new Error('خطا در دریافت اطلاعات')
        }

        const data = await response.json()
        setActivities(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطای ناشناخته')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطا</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTitle>اطلاعاتی موجود نیست</AlertTitle>
          <AlertDescription>
            هیچ فعالیتی در سیستم ثبت نشده است.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">لیست فعالیت کاربران</h1>
      <ActivityTable data={activities} />
    </div>
  )
} 