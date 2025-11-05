'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import ResponsiveContainer from '@/components/responsive/ResponsiveContainer'
import ResponsiveGrid from '@/components/responsive/ResponsiveGrid'
import MobileOptimizedCard from '@/components/responsive/MobileOptimizedCard'
import Link from 'next/link'

interface Session {
  id: string
  patientId: string
  date: string
  duration: number
  note?: string
  status: string
  meetingLink?: string
  createdAt: string
  patient: {
    id: string
    name: string
    email: string
    image?: string
  }
}

interface SessionsData {
  sessions: Session[]
  upcomingSessions: Session[]
  pastSessions: Session[]
  totalSessions: number
  upcomingCount: number
  pastCount: number
}

export default function TherapistSessionsPage() {
  const [data, setData] = useState<SessionsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState({
    patientId: '',
    date: '',
    duration: 60,
    note: '',
    meetingLink: ''
  })

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/therapist/sessions')
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('شما به عنوان درمانگر ثبت نشده‌اید')
        }
        throw new Error('خطا در دریافت جلسات')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته')
    } finally {
      setLoading(false)
    }
  }

  const createSession = async () => {
    try {
      const response = await fetch('/api/therapist/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createForm)
      })

      if (response.ok) {
        alert('جلسه با موفقیت ایجاد شد!')
        setShowCreateForm(false)
        setCreateForm({ patientId: '', date: '', duration: 60, note: '', meetingLink: '' })
        fetchSessions() // به‌روزرسانی لیست
      } else {
        const errorData = await response.json()
        alert(`خطا در ایجاد جلسه: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error creating session:', error)
      alert('خطا در ایجاد جلسه')
    }
  }

  const updateSessionStatus = async (sessionId: string, status: string) => {
    try {
      const response = await fetch(`/api/therapist/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        alert('وضعیت جلسه به‌روزرسانی شد!')
        fetchSessions() // به‌روزرسانی لیست
      } else {
        alert('خطا در به‌روزرسانی وضعیت جلسه')
      }
    } catch (error) {
      console.error('Error updating session status:', error)
      alert('خطا در به‌روزرسانی وضعیت جلسه')
    }
  }

  const deleteSession = async (sessionId: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این جلسه را حذف کنید؟')) {
      return
    }

    try {
      const response = await fetch(`/api/therapist/sessions/${sessionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('جلسه با موفقیت حذف شد!')
        fetchSessions() // به‌روزرسانی لیست
      } else {
        alert('خطا در حذف جلسه')
      }
    } catch (error) {
      console.error('Error deleting session:', error)
      alert('خطا در حذف جلسه')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'برنامه‌ریزی شده'
      case 'completed': return 'تکمیل شده'
      case 'cancelled': return 'لغو شده'
      case 'rescheduled': return 'مجدداً برنامه‌ریزی شده'
      default: return 'نامشخص'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return '📅'
      case 'completed': return '✅'
      case 'cancelled': return '❌'
      case 'rescheduled': return '🔄'
      default: return '❓'
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
            <h2 className="text-xl font-semibold mb-2 text-red-800">خطا در دسترسی</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchSessions} className="bg-red-500 hover:bg-red-600">
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
            <div className="text-4xl mb-4">📅</div>
            <h2 className="text-xl font-semibold mb-2 text-blue-800">جلسات درمانگر</h2>
            <p className="text-blue-600 mb-4">
              برای دسترسی به جلسات، ابتدا باید به عنوان درمانگر ثبت‌نام کنید
            </p>
            <Link href="/contact">
              <Button className="bg-blue-500 hover:bg-blue-600">
                تماس با ما
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
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          📅 جلسات درمانگر
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          مدیریت و برنامه‌ریزی جلسات با بیماران
        </p>
      </div>

      {/* آمار کلی */}
      <ResponsiveGrid 
        cols={{ default: 2, sm: 2, md: 4 }} 
        gap="sm"
        className="mb-6"
      >
        <MobileOptimizedCard 
          title="کل جلسات"
          icon="📊"
          gradient={true}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {data.totalSessions}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">کل جلسات</div>
          </div>
        </MobileOptimizedCard>

        <MobileOptimizedCard 
          title="جلسات آینده"
          icon="📅"
          gradient={true}
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {data.upcomingCount}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">جلسات آینده</div>
          </div>
        </MobileOptimizedCard>

        <MobileOptimizedCard 
          title="جلسات گذشته"
          icon="📋"
          gradient={true}
          className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {data.pastCount}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">جلسات گذشته</div>
          </div>
        </MobileOptimizedCard>

        <MobileOptimizedCard 
          title="جلسات تکمیل شده"
          icon="✅"
          gradient={true}
          className="bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {data.sessions.filter(s => s.status === 'completed').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">تکمیل شده</div>
          </div>
        </MobileOptimizedCard>
      </ResponsiveGrid>

      {/* دکمه ایجاد جلسه جدید */}
      <div className="text-center mb-6">
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          ➕ ایجاد جلسه جدید
        </Button>
      </div>

      {/* فرم ایجاد جلسه */}
      {showCreateForm && (
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-100 border-indigo-200 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">➕</span>
              <span>ایجاد جلسه جدید</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  شناسه بیمار
                </label>
                <Input
                  value={createForm.patientId}
                  onChange={(e) => setCreateForm({ ...createForm, patientId: e.target.value })}
                  placeholder="شناسه بیمار"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  تاریخ و زمان
                </label>
                <Input
                  type="datetime-local"
                  value={createForm.date}
                  onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  مدت جلسه (دقیقه)
                </label>
                <Input
                  type="number"
                  value={createForm.duration}
                  onChange={(e) => setCreateForm({ ...createForm, duration: parseInt(e.target.value) })}
                  placeholder="60"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  لینک جلسه آنلاین
                </label>
                <Input
                  value={createForm.meetingLink}
                  onChange={(e) => setCreateForm({ ...createForm, meetingLink: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                یادداشت
              </label>
              <Textarea
                value={createForm.note}
                onChange={(e) => setCreateForm({ ...createForm, note: e.target.value })}
                placeholder="یادداشت‌های جلسه..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                className="text-sm"
              >
                لغو
              </Button>
              <Button
                onClick={createSession}
                className="bg-indigo-500 hover:bg-indigo-600 text-sm"
              >
                ایجاد جلسه
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* جلسات آینده */}
      <MobileOptimizedCard 
        title="جلسات آینده"
        icon="📅"
        className="bg-white shadow-lg"
      >
        <div className="space-y-4">
          {data.upcomingSessions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📅</div>
              <p className="text-gray-600 mb-2">جلسه آینده‌ای برنامه‌ریزی نشده است</p>
              <p className="text-sm text-gray-500">جلسه جدیدی ایجاد کنید</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.upcomingSessions.map((session) => (
                <Card key={session.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {session.patient.name?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{session.patient.name}</h3>
                            <p className="text-sm text-gray-600">{session.patient.email}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="font-bold text-blue-600">
                              {new Date(session.date).toLocaleDateString('fa-IR')}
                            </div>
                            <div className="text-gray-600">تاریخ</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="font-bold text-green-600">{session.duration} دقیقه</div>
                            <div className="text-gray-600">مدت</div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <Badge className={`${getStatusColor(session.status)} text-xs`}>
                              {getStatusIcon(session.status)} {getStatusText(session.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        {session.status === 'scheduled' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateSessionStatus(session.id, 'completed')}
                              className="bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm"
                            >
                              ✅ تکمیل
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => updateSessionStatus(session.id, 'cancelled')}
                              className="bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm"
                            >
                              ❌ لغو
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteSession(session.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50 text-xs sm:text-sm"
                        >
                          🗑️ حذف
                        </Button>
                      </div>
                    </div>
                    
                    {session.note && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{session.note}</p>
                      </div>
                    )}
                    
                    {session.meetingLink && (
                      <div className="mt-2">
                        <a
                          href={session.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          🔗 لینک جلسه آنلاین
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </MobileOptimizedCard>

      {/* جلسات گذشته */}
      <MobileOptimizedCard 
        title="جلسات گذشته"
        icon="📋"
        className="bg-white shadow-lg"
      >
        <div className="space-y-4">
          {data.pastSessions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-gray-600 mb-2">جلسه گذشته‌ای وجود ندارد</p>
              <p className="text-sm text-gray-500">جلسات شما در اینجا نمایش داده می‌شوند</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.pastSessions.slice(0, 10).map((session) => (
                <Card key={session.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {session.patient.name?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{session.patient.name}</h4>
                          <p className="text-xs text-gray-600">
                            {new Date(session.date).toLocaleDateString('fa-IR')} - {session.duration} دقیقه
                          </p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(session.status)} text-xs`}>
                        {getStatusIcon(session.status)} {getStatusText(session.status)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </MobileOptimizedCard>
    </ResponsiveContainer>
  )
}
















