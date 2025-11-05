'use client'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import ProgressBar from './ProgressBar'
import StepCard from './StepCard'
import { UserPathWithSteps, StepStatus } from '@/types'
import { fetchUserPath } from '@/lib/api/userPath'

export default function UserGrowthPath() {
  const [path, setPath] = useState<UserPathWithSteps | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completingStep, setCompletingStep] = useState(false)

  useEffect(() => {
    loadPath()
  }, [])

  const loadPath = async () => {
    try {
      setLoading(true)
      const data = await fetchUserPath()
      setPath(data)
    } catch (err) {
      setError('خطا در بارگذاری مسیر رشد')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteStep = async (stepId: string) => {
    try {
      setCompletingStep(true)
      const response = await fetch('/api/user/path/complete-step', {
        method: 'POST'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'خطا در تکمیل مرحله')
      }

      const data = await response.json()
      setPath(data.path)
      toast.success(data.message)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطا در تکمیل مرحله')
    } finally {
      setCompletingStep(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  )

  if (error) return (
    <div className="text-center text-red-500 p-4">
      {error}
    </div>
  )

  if (!path) return (
    <div className="text-center text-gray-500 p-4">
      مسیر رشدی برای شما تعریف نشده است
    </div>
  )

  const totalSteps = path.steps.length
  const completed = path.steps.filter(s => s.status === 'DONE').length
  const progress = Math.round((completed / totalSteps) * 100)

  return (
    <div className="space-y-6 p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">مسیر رشد شخصی</h2>
        <p className="text-gray-600 mb-4">مسیر رشد شخصی شما بر اساس نتایج تست‌ها</p>
        <ProgressBar percent={progress} />
        <div className="mt-4 text-sm text-gray-500">
          {completed} از {totalSteps} مرحله تکمیل شده
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {path.steps.map(step => (
          <StepCard 
            key={step.id} 
            step={step} 
            onComplete={handleCompleteStep}
            disabled={completingStep}
          />
        ))}
      </div>
    </div>
  )
} 