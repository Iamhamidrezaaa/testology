'use client'

import { useEffect, useState } from 'react'
import DataTable from '@/components/admin/modules/DataTable'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

const ACTION_COLORS = {
  view_test: 'blue',
  start_bundle: 'green',
  login: 'purple',
  logout: 'gray',
  complete_test: 'yellow',
  update_profile: 'indigo'
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    action: '',
    startDate: '',
    endDate: ''
  })

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      if (filters.action) queryParams.append('action', filters.action)
      if (filters.startDate) queryParams.append('startDate', filters.startDate)
      if (filters.endDate) queryParams.append('endDate', filters.endDate)

      const response = await fetch(`/api/admin/activities?${queryParams}`)
      if (!response.ok) throw new Error('خطا در دریافت فعالیت‌ها')
      
      const data = await response.json()
      setActivities(data.activities)
    } catch (error) {
      console.error('Error fetching activities:', error)
      toast.error('خطا در دریافت فعالیت‌ها')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [filters])

  const columns = [
    {
      key: 'user',
      label: 'کاربر',
      render: (value: any) => (
        <div>
          <div className="font-medium">{value.name}</div>
          <div className="text-sm text-muted-foreground">{value.email}</div>
        </div>
      )
    },
    {
      key: 'action',
      label: 'نوع فعالیت',
      render: (value: string) => {
        const color = ACTION_COLORS[value as keyof typeof ACTION_COLORS] || 'default';
        const variant = (color === 'default' || color === 'outline' || color === 'destructive' || color === 'secondary') 
          ? color 
          : 'default';
        return (
          <Badge variant={variant as "default" | "outline" | "destructive" | "secondary"}>
            {value}
          </Badge>
        );
      }
    },
    {
      key: 'metadata',
      label: 'توضیحات',
      render: (value: any) => (
        <div className="max-w-md">
          {value ? (
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(value, null, 2)}
            </pre>
          ) : (
            <span className="text-muted-foreground">بدون توضیحات</span>
          )}
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (value: string) => new Date(value).toLocaleString('fa-IR')
    }
  ]

  const filterOptions = [
    {
      key: 'action',
      label: 'نوع فعالیت',
      options: [
        { value: '', label: 'همه' },
        { value: 'view_test', label: 'مشاهده تست' },
        { value: 'start_bundle', label: 'شروع باندل' },
        { value: 'login', label: 'ورود' },
        { value: 'logout', label: 'خروج' },
        { value: 'complete_test', label: 'تکمیل تست' },
        { value: 'update_profile', label: 'به‌روزرسانی پروفایل' }
      ]
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📊 فعالیت‌های کاربران</h1>
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={activities}
          loading={loading}
          searchable
          filterable
          filters={filterOptions}
          onFilter={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        />
      </Card>
    </div>
  )
} 