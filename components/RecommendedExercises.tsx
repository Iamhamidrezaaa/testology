import { useEffect, useState } from 'react'
import { format } from 'date-fns-jalali'
import { faIR } from 'date-fns-jalali/locale'
import { CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import axios from 'axios'

interface Exercise {
  id: string
  title: string
  description: string
  status: 'pending' | 'completed'
  dueDate: string
  createdAt: string
  suggestedBy?: 'ai' | 'therapist'
}

export default function RecommendedExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card')

  const fetchExercises = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/exercises/recommended')
      setExercises((res.data as any).exercises)
    } catch (error) {
      console.error('خطا در دریافت تمرین‌ها:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsDone = async (id: string) => {
    try {
      await axios.put(`/api/exercises/${id}/complete`)
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === id ? { ...ex, status: 'completed' } : ex
        )
      )
    } catch (error) {
      console.error('خطا در به‌روزرسانی تمرین:', error)
    }
  }

  useEffect(() => {
    fetchExercises()
  }, [])

  if (loading) {
    return (
      <div className="w-full p-4 bg-white rounded-xl shadow-md font-vazir">
        <p className="text-center text-gray-500">در حال بارگذاری تمرین‌ها...</p>
      </div>
    )
  }

  if (exercises.length === 0) {
    return (
      <div className="w-full p-4 bg-white rounded-xl shadow-md font-vazir">
        <p className="text-center text-gray-500">هیچ تمرینی در حال حاضر برای شما پیشنهاد نشده است.</p>
      </div>
    )
  }

  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-md font-vazir">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🧠 تمرین‌های پیشنهادی شما</h2>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            جدول
          </Button>
          <Button
            variant={viewMode === 'card' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('card')}
          >
            کارت
          </Button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right border">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="p-3 border">عنوان</th>
                <th className="p-3 border">توضیحات</th>
                <th className="p-3 border">موعد انجام</th>
                <th className="p-3 border">وضعیت</th>
                <th className="p-3 border">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((ex) => (
                <tr key={ex.id} className="hover:bg-gray-50">
                  <td className="p-3 border font-medium">{ex.title}</td>
                  <td className="p-3 border">{ex.description}</td>
                  <td className="p-3 border">
                    {format(new Date(ex.dueDate), 'yyyy/MM/dd', { locale: faIR })}
                  </td>
                  <td className="p-3 border">
                    {ex.status === 'completed' ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> انجام‌شده
                      </span>
                    ) : (
                      <span className="text-orange-500 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> در انتظار
                      </span>
                    )}
                  </td>
                  <td className="p-3 border">
                    {ex.status === 'pending' && (
                      <Button
                        onClick={() => markAsDone(ex.id)}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        انجام شد
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-4">
          {exercises.map((exercise) => (
            <Card
              key={exercise.id}
              className={cn(
                'rounded-xl shadow-sm transition-all border-2',
                exercise.status === 'completed'
                  ? 'border-green-500 bg-green-50'
                  : 'border-yellow-500 bg-yellow-50'
              )}
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {exercise.title}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {format(new Date(exercise.dueDate), 'yyyy/MM/dd', {
                      locale: faIR,
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {exercise.description}
                </p>
                <div className="text-xs text-gray-500">
                  پیشنهاد شده توسط: {exercise.suggestedBy === 'ai' ? 'مشاور هوشمند' : 'روان‌شناس'}
                </div>
                <div className="pt-2">
                  {exercise.status === 'pending' ? (
                    <Button
                      size="sm"
                      onClick={() => markAsDone(exercise.id)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      انجام تمرین
                    </Button>
                  ) : (
                    <Button size="sm" disabled>
                      انجام شده ✅
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 