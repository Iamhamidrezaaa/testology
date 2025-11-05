'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import ResponsiveContainer from '@/components/responsive/ResponsiveContainer'
import ResponsiveGrid from '@/components/responsive/ResponsiveGrid'
import MobileOptimizedCard from '@/components/responsive/MobileOptimizedCard'

interface Assignment {
  id: string
  content: {
    id: string
    title: string
    description: string
    type: string
    category: string
    difficulty: string
    duration?: number
    imageUrl?: string
    price: number
  }
  therapist: {
    user: {
      id: string
      name: string
      email: string
    }
  }
  message?: string
  priority: number
  dueDate?: string
  status: string
  feedback?: string
  userNotes?: string
  createdAt: string
}

interface AssignmentsData {
  assignments: Assignment[]
  stats: {
    total: number
    assigned: number
    inProgress: number
    completed: number
    skipped: number
    highPriority: number
    overdue: number
  }
  groupedAssignments: {
    assigned: Assignment[]
    inProgress: Assignment[]
    completed: Assignment[]
    skipped: Assignment[]
  }
}

export default function UserAssignmentsPage() {
  const [data, setData] = useState<AssignmentsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/assignments')
      
      if (!response.ok) {
        throw new Error('خطا در دریافت تمرین‌ها')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته')
    } finally {
      setLoading(false)
    }
  }

  const updateAssignment = async (assignmentId: string, updates: Partial<Assignment>) => {
    try {
      const response = await fetch(`/api/user/assignments/${assignmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        alert('تمرین به‌روزرسانی شد!')
        setEditingAssignment(null)
        fetchAssignments() // به‌روزرسانی لیست
      } else {
        alert('خطا در به‌روزرسانی تمرین')
      }
    } catch (error) {
      console.error('Error updating assignment:', error)
      alert('خطا در به‌روزرسانی تمرین')
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'skipped': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'assigned': return 'اختصاص داده شده'
      case 'in_progress': return 'در حال انجام'
      case 'completed': return 'تکمیل شده'
      case 'skipped': return 'رد شده'
      default: return 'نامشخص'
    }
  }

  const getPriorityColor = (priority: number): string => {
    if (priority >= 4) return 'bg-red-100 text-red-800'
    if (priority === 3) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getPriorityText = (priority: number): string => {
    if (priority >= 4) return 'بالا'
    if (priority === 3) return 'متوسط'
    return 'پایین'
  }

  const isOverdue = (dueDate?: string): boolean => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  if (loading) {
    return (
      <ResponsiveContainer maxWidth="lg" padding="md" className="space-y-6">
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
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
            <h2 className="text-xl font-semibold mb-2 text-red-800">خطا در دریافت تمرین‌ها</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchAssignments} className="bg-red-500 hover:bg-red-600">
              تلاش مجدد
            </Button>
          </CardContent>
        </Card>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer maxWidth="lg" padding="md" className="space-y-6">
      {/* هدر */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          📋 تمرین‌های من
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          تمرین‌های اختصاصی از درمانگر شما
        </p>
      </div>

      {/* آمار کلی */}
      {data && (
        <ResponsiveGrid 
          cols={{ default: 2, sm: 2, md: 4 }} 
          gap="sm"
          className="mb-6"
        >
          <MobileOptimizedCard 
            title="کل تمرین‌ها"
            icon="📊"
            gradient={true}
            className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {data.stats.total}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">تمرین</div>
            </div>
          </MobileOptimizedCard>

          <MobileOptimizedCard 
            title="تکمیل شده"
            icon="✅"
            gradient={true}
            className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {data.stats.completed}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">تمرین</div>
            </div>
          </MobileOptimizedCard>

          <MobileOptimizedCard 
            title="در حال انجام"
            icon="⏳"
            gradient={true}
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {data.stats.inProgress}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">تمرین</div>
            </div>
          </MobileOptimizedCard>

          <MobileOptimizedCard 
            title="اولویت بالا"
            icon="🔥"
            gradient={true}
            className="bg-gradient-to-br from-red-50 to-red-100 border-red-200"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {data.stats.highPriority}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">تمرین</div>
            </div>
          </MobileOptimizedCard>
        </ResponsiveGrid>
      )}

      {/* لیست تمرین‌ها */}
      <div className="space-y-6">
        {data?.assignments?.length === 0 ? (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">هنوز تمرینی دریافت نکرده‌اید</h3>
              <p className="text-gray-600 text-sm mb-4">
                درمانگر شما تمرین‌های اختصاصی برای شما ارسال خواهد کرد
              </p>
            </CardContent>
          </Card>
        ) : (
          data?.assignments?.map((assignment) => (
            <Card key={assignment.id} className={`border hover:shadow-md transition-shadow ${
              isOverdue(assignment.dueDate) && assignment.status !== 'completed' 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-200'
            }`}>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* هدر تمرین */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {assignment.content.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {assignment.content.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>👨‍⚕️ {assignment.therapist.user.name}</span>
                        <span>•</span>
                        <span>📅 {new Date(assignment.createdAt).toLocaleDateString('fa-IR')}</span>
                        {assignment.dueDate && (
                          <>
                            <span>•</span>
                            <span className={isOverdue(assignment.dueDate) ? 'text-red-600 font-medium' : ''}>
                              ⏰ {new Date(assignment.dueDate).toLocaleDateString('fa-IR')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge className={`${getStatusColor(assignment.status)} text-xs`}>
                        {getStatusText(assignment.status)}
                      </Badge>
                      <Badge className={`${getPriorityColor(assignment.priority)} text-xs`}>
                        {getPriorityText(assignment.priority)}
                      </Badge>
                      {isOverdue(assignment.dueDate) && assignment.status !== 'completed' && (
                        <Badge className="bg-red-100 text-red-800 text-xs">
                          ⚠️ منقضی شده
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* جزئیات تمرین */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">نوع:</span>
                      <span className="text-gray-600 mr-2">{assignment.content.type}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">دسته‌بندی:</span>
                      <span className="text-gray-600 mr-2">{assignment.content.category}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">سطح:</span>
                      <span className="text-gray-600 mr-2">{assignment.content.difficulty}</span>
                    </div>
                  </div>

                  {/* پیام درمانگر */}
                  {assignment.message && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">پیام درمانگر:</span> {assignment.message}
                      </p>
                    </div>
                  )}

                  {/* بازخورد درمانگر */}
                  {assignment.feedback && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        <span className="font-medium">بازخورد درمانگر:</span> {assignment.feedback}
                      </p>
                    </div>
                  )}

                  {/* دکمه‌های عملیات */}
                  <div className="flex gap-2 justify-end">
                    {assignment.status === 'assigned' && (
                      <Button
                        size="sm"
                        onClick={() => updateAssignment(assignment.id, { status: 'in_progress' })}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs"
                      >
                        ⏳ شروع تمرین
                      </Button>
                    )}
                    
                    {assignment.status === 'in_progress' && (
                      <Button
                        size="sm"
                        onClick={() => updateAssignment(assignment.id, { status: 'completed' })}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs"
                      >
                        ✅ تکمیل تمرین
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingAssignment(assignment)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs"
                    >
                      ✏️ یادداشت
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* فرم ویرایش یادداشت */}
      {editingAssignment && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 fixed inset-4 z-50 overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">✏️</span>
              <span>یادداشت تمرین</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                یادداشت‌های شما
              </label>
              <Textarea
                value={editingAssignment.userNotes || ''}
                onChange={(e) => setEditingAssignment({ 
                  ...editingAssignment, 
                  userNotes: e.target.value 
                })}
                placeholder="نظرات و تجربیات خود از انجام این تمرین..."
                rows={4}
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setEditingAssignment(null)}
                className="text-sm"
              >
                لغو
              </Button>
              <Button
                onClick={() => updateAssignment(editingAssignment.id, {
                  userNotes: editingAssignment.userNotes
                })}
                className="bg-blue-500 hover:bg-blue-600 text-sm"
              >
                ذخیره یادداشت
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </ResponsiveContainer>
  )
}