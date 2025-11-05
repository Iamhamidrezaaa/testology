'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import ResponsiveContainer from '@/components/responsive/ResponsiveContainer'
import MobileOptimizedCard from '@/components/responsive/MobileOptimizedCard'
import Link from 'next/link'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  priority: string
  seen: boolean
  actionUrl?: string
  createdAt: string
}

interface NotificationData {
  notifications: Notification[]
  unreadCount: number
  total: number
}

export default function NotificationsPage() {
  const [data, setData] = useState<NotificationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications/user')
      
      if (!response.ok) {
        throw new Error('خطا در دریافت نوتیفیکیشن‌ها')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT'
      })
      
      if (response.ok) {
        // به‌روزرسانی محلی
        setData(prev => {
          if (!prev) return prev
          return {
            ...prev,
            notifications: prev.notifications.map(n => 
              n.id === notificationId ? { ...n, seen: true } : n
            ),
            unreadCount: prev.unreadCount - 1
          }
        })
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/user', {
        method: 'PUT'
      })
      
      if (response.ok) {
        // به‌روزرسانی محلی
        setData(prev => {
          if (!prev) return prev
          return {
            ...prev,
            notifications: prev.notifications.map(n => ({ ...n, seen: true })),
            unreadCount: 0
          }
        })
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // حذف محلی
        setData(prev => {
          if (!prev) return prev
          const notification = prev.notifications.find(n => n.id === notificationId)
          return {
            ...prev,
            notifications: prev.notifications.filter(n => n.id !== notificationId),
            unreadCount: notification && !notification.seen ? prev.unreadCount - 1 : prev.unreadCount,
            total: prev.total - 1
          }
        })
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'achievement': return '🏆'
      case 'reminder': return '⏰'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '📢'
    }
  }

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'achievement': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'reminder': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'warning': return 'bg-red-100 text-red-800 border-red-200'
      case 'info': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'normal': return 'bg-blue-500'
      case 'low': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <ResponsiveContainer maxWidth="lg" padding="md" className="space-y-6">
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </ResponsiveContainer>
    )
  }

  if (error) {
    return (
      <ResponsiveContainer maxWidth="lg" padding="md">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2 text-red-800">خطا در دریافت نوتیفیکیشن‌ها</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchNotifications} className="bg-red-500 hover:bg-red-600">
              تلاش مجدد
            </Button>
          </CardContent>
        </Card>
      </ResponsiveContainer>
    )
  }

  if (!data) {
    return (
      <ResponsiveContainer maxWidth="lg" padding="md">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">🔔</div>
            <h2 className="text-xl font-semibold mb-2 text-blue-800">نوتیفیکیشن‌ها</h2>
            <p className="text-blue-600 mb-4">
              نوتیفیکیشنی یافت نشد
            </p>
            <Link href="/dashboard">
              <Button className="bg-blue-500 hover:bg-blue-600">
                بازگشت به داشبورد
              </Button>
            </Link>
          </CardContent>
        </Card>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer maxWidth="lg" padding="md" className="space-y-6">
      {/* هدر */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🔔 نوتیفیکیشن‌های من
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          آخرین اطلاع‌رسانی‌ها و یادآوری‌های شخصی‌سازی شده
        </p>
      </div>

      {/* آمار کلی */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MobileOptimizedCard 
          title="کل نوتیفیکیشن‌ها"
          icon="📢"
          gradient={true}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {data.total}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">کل</div>
          </div>
        </MobileOptimizedCard>

        <MobileOptimizedCard 
          title="خوانده نشده"
          icon="🔴"
          gradient={true}
          className="bg-gradient-to-br from-red-50 to-red-100 border-red-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {data.unreadCount}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">خوانده نشده</div>
          </div>
        </MobileOptimizedCard>

        <MobileOptimizedCard 
          title="دستاوردها"
          icon="🏆"
          gradient={true}
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {data.notifications.filter(n => n.type === 'achievement').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">دستاورد</div>
          </div>
        </MobileOptimizedCard>

        <MobileOptimizedCard 
          title="یادآوری‌ها"
          icon="⏰"
          gradient={true}
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {data.notifications.filter(n => n.type === 'reminder').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">یادآوری</div>
          </div>
        </MobileOptimizedCard>
      </div>

      {/* دکمه‌های عملیات */}
      {data.unreadCount > 0 && (
        <div className="text-center mb-6">
          <Button
            onClick={markAllAsRead}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            ✅ همه را خوانده شده علامت‌گذاری کن
          </Button>
        </div>
      )}

      {/* لیست نوتیفیکیشن‌ها */}
      <div className="space-y-4">
        {data.notifications.length === 0 ? (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🔔</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">نوتیفیکیشنی وجود ندارد</h3>
              <p className="text-gray-600 text-sm">
                هنوز نوتیفیکیشنی برای شما ارسال نشده است
              </p>
            </CardContent>
          </Card>
        ) : (
          data.notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`border transition-all duration-200 hover:shadow-md ${
                !notification.seen ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* آیکون نوع */}
                  <div className="text-2xl flex-shrink-0">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  {/* محتوا */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`font-semibold text-sm sm:text-base ${
                        !notification.seen ? 'text-blue-800' : 'text-gray-800'
                      }`}>
                        {notification.title}
                      </h3>
                      
                      {/* نشانگر اولویت */}
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} />
                      
                      {/* نوع */}
                      <Badge className={`${getTypeColor(notification.type)} text-xs`}>
                        {notification.type}
                      </Badge>
                      
                      {/* نشانگر خوانده نشده */}
                      {!notification.seen && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                    
                    <p className="text-gray-700 text-sm sm:text-base mb-3 leading-relaxed">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString('fa-IR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      
                      <div className="flex gap-2">
                        {notification.actionUrl && (
                          <Link href={notification.actionUrl}>
                            <Button size="sm" variant="outline" className="text-xs">
                              مشاهده
                            </Button>
                          </Link>
                        )}
                        
                        {!notification.seen && (
                          <Button
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                          >
                            خوانده شد
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </ResponsiveContainer>
  )
}
















