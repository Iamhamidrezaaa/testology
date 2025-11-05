'use client'
import { useEffect, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface StepProgress {
  stepTitle: string
  stepIndex: number
  usersHere: number
  stuckUsers: number
  percentage: number
  stuckPercentage: number
}

interface PathInsight {
  pathId: string
  pathTitle: string
  totalUsers: number
  stepProgress: StepProgress[]
  completionRate: number
}

export default function GrowthPathInsights() {
  const [insights, setInsights] = useState<PathInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/insights/growth-path')
      if (!response.ok) {
        throw new Error('خطا در دریافت اطلاعات')
      }
      const data = await response.json()
      setInsights(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت اطلاعات')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📈 تحلیل مسیرهای رشد کاربران</h1>
      
      {insights.map((path, idx) => (
        <div key={path.pathId} className="mb-12 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{path.pathTitle}</h2>
            <div className="text-sm text-gray-500">
              تعداد کل کاربران: {path.totalUsers}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">نرخ تکمیل مسیر</span>
              <span className="text-sm font-medium text-blue-600">{path.completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${path.completionRate}%` }}
              ></div>
            </div>
          </div>

          <Bar
            data={{
              labels: path.stepProgress.map(s => s.stepTitle),
              datasets: [
                {
                  label: 'درصد تکمیل شده',
                  data: path.stepProgress.map(s => s.percentage),
                  backgroundColor: 'rgba(59, 130, 246, 0.6)',
                },
                {
                  label: 'درصد گیر کرده',
                  data: path.stepProgress.map(s => s.stuckPercentage),
                  backgroundColor: 'rgba(239, 68, 68, 0.6)',
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: 'پیشرفت مراحل'
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  title: {
                    display: true,
                    text: 'درصد'
                  }
                }
              }
            }}
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {path.stepProgress.map((step, stepIdx) => (
              <div key={stepIdx} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">{step.stepTitle}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">تکمیل شده:</span>
                    <span className="text-blue-600">{step.usersHere} کاربر ({step.percentage}%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">گیر کرده:</span>
                    <span className="text-red-600">{step.stuckUsers} کاربر ({step.stuckPercentage}%)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
} 