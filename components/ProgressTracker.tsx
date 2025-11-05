'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Circle, Clock, MessageSquare, Stethoscope, TestTube2 } from 'lucide-react'
import { format } from 'date-fns-jalali'
import { cn } from '@/lib/utils'

interface ProgressStep {
  id: string
  title: string
  type: 'screening' | 'test' | 'exercise' | 'chat' | 'referral'
  status: 'completed' | 'in_progress' | 'pending'
  date?: string
  description?: string
}

interface ProgressData {
  steps: ProgressStep[]
  completionPercentage: number
  nextStep?: {
    title: string
    description: string
  }
}

const stepIcons = {
  screening: TestTube2,
  test: TestTube2,
  exercise: Circle,
  chat: MessageSquare,
  referral: Stethoscope,
}

const statusColors = {
  completed: 'text-green-500',
  in_progress: 'text-yellow-500',
  pending: 'text-gray-400',
}

export function ProgressTracker() {
  const [progressData, setProgressData] = useState<ProgressData | null>(null)

  useEffect(() => {
    const fetchProgress = async () => {
      const res = await fetch('/api/progress')
      const data = await res.json()
      setProgressData(data)
    }
    fetchProgress()
  }, [])

  if (!progressData) return null

  return (
    <div className="bg-white rounded-xl shadow p-6 font-vazir">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">مسیر پیشرفت شخصی</h2>
        <div className="flex items-center gap-2">
          <div className="w-16 h-16 relative">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#4ade80"
                strokeWidth="3"
                strokeDasharray={`${progressData.completionPercentage}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {progressData.completionPercentage}%
            </div>
          </div>
          <span className="text-sm text-gray-600">تکمیل شده</span>
        </div>
      </div>

      <div className="space-y-4">
        {progressData.steps.map((step, index) => {
          const Icon = stepIcons[step.type]
          return (
            <div
              key={step.id}
              className={cn(
                'flex items-start gap-4 p-4 rounded-lg border',
                step.status === 'completed' && 'bg-green-50 border-green-200',
                step.status === 'in_progress' && 'bg-yellow-50 border-yellow-200',
                step.status === 'pending' && 'bg-gray-50 border-gray-200'
              )}
            >
              <div className={cn('p-2 rounded-full', statusColors[step.status])}>
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : step.status === 'in_progress' ? (
                  <Clock className="w-6 h-6" />
                ) : (
                  <Icon className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{step.title}</h3>
                {step.description && (
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                )}
                {step.date && (
                  <p className="text-xs text-gray-500 mt-2">
                    {format(new Date(step.date), 'yyyy/MM/dd')}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {progressData.nextStep && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800">گام بعدی پیشنهادی</h3>
          <p className="text-sm text-blue-600 mt-1">{progressData.nextStep.description}</p>
        </div>
      )}
    </div>
  )
} 