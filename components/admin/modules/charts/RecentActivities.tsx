'use client'

import { Card } from '@/components/ui/card'
import { User, FileText, MessageSquare, Newspaper } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { faIR } from 'date-fns/locale'

interface Activity {
  id: string
  type: 'user' | 'test' | 'comment' | 'article'
  title: string
  description: string
  time: string
}

interface RecentActivitiesProps {
  activities: Activity[]
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'user':
        return <User className="w-5 h-5 text-blue-500" />
      case 'test':
        return <FileText className="w-5 h-5 text-green-500" />
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-purple-500" />
      case 'article':
        return <Newspaper className="w-5 h-5 text-orange-500" />
    }
  }

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'user':
        return 'bg-blue-50 border-blue-200'
      case 'test':
        return 'bg-green-50 border-green-200'
      case 'comment':
        return 'bg-purple-50 border-purple-200'
      case 'article':
        return 'bg-orange-50 border-orange-200'
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">فعالیت‌های اخیر</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`flex items-start p-4 rounded-lg border ${getActivityColor(activity.type)}`}
          >
            <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
            <div className="mr-3 flex-1">
              <h4 className="font-medium">{activity.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                {formatDistanceToNow(new Date(activity.time), {
                  addSuffix: true,
                  locale: faIR
                })}
              </p>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-center text-gray-500 py-4">هیچ فعالیتی در این بازه زمانی ثبت نشده است.</p>
        )}
      </div>
    </Card>
  )
} 