'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import SendNotificationForm from '@/components/admin/SendNotificationForm'
import { Bell, Eye, EyeOff, Trash2, Clock, User } from 'lucide-react'

interface Notification {
  id: string
  title: string
  body: string
  type: string
  seen: boolean
  createdAt: string
  user?: {
    id: string
    name?: string
    email?: string
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      // در اینجا باید API مناسب برای دریافت همه نوتیفیکیشن‌ها فراخوانی شود
      // فعلاً یک آرایه خالی نمایش می‌دهیم
      setNotifications([])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'report': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'info': return 'اطلاع‌رسانی'
      case 'warning': return 'هشدار'
      case 'report': return 'گزارش'
      default: return 'نامشخص'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* هدر */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">مدیریت نوتیفیکیشن‌ها</h1>
          <p className="text-gray-600">ارسال و مدیریت پیام‌های سیستم</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center space-x-2">
          <Bell className="h-4 w-4" />
          <span>{showForm ? 'بستن فرم' : 'ارسال نوتیفیکیشن'}</span>
        </Button>
      </div>

      {/* فرم ارسال نوتیفیکیشن */}
      {showForm && (
        <SendNotificationForm />
      )}

      {/* آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">📱 کل نوتیفیکیشن‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">👁️ خوانده شده</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter(n => n.seen).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">🔔 خوانده نشده</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter(n => !n.seen).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">⚠️ هشدارها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notifications.filter(n => n.type === 'warning').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* لیست نوتیفیکیشن‌ها */}
      <Card>
        <CardHeader>
          <CardTitle>لیست نوتیفیکیشن‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">هنوز هیچ نوتیفیکیشنی ارسال نشده است</p>
                <Button onClick={() => setShowForm(true)} className="mt-4">
                  اولین نوتیفیکیشن را ارسال کنید
                </Button>
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      <Badge className={getTypeColor(notification.type)}>
                        {getTypeLabel(notification.type)}
                      </Badge>
                      {notification.seen ? (
                        <Badge variant="secondary">خوانده شده</Badge>
                      ) : (
                        <Badge variant="default">جدید</Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-2">{notification.body}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(notification.createdAt).toLocaleDateString('fa-IR')}</span>
                      </div>
                      {notification.user && (
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{notification.user.name || notification.user.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      {notification.seen ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}