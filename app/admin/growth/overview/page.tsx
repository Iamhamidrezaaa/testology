'use client'
import { useEffect, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface PathStats {
  title: string
  totalUsers: number
  completedSteps: number[]
  averageCompletion: number
}

interface OverviewData {
  totalUsers: number
  totalPaths: number
  pathStats: Record<string, PathStats>
  totalCompletedSteps: number
  averageStepsPerUser: number
}

export default function GrowthOverview() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/growth/overview')
      if (!response.ok) {
        throw new Error('خطا در دریافت اطلاعات')
      }
      const data = await response.json()
      setData(data)
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

  if (!data) return null

  const chartData = {
    labels: Object.values(data.pathStats).map(stat => stat.title),
    datasets: [
      {
        label: 'میانگین مراحل تکمیل‌شده',
        data: Object.values(data.pathStats).map(stat => stat.averageCompletion),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      }
    ]
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📊 آمار کلی مسیرهای رشد</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">تعداد کل کاربران</h3>
          <p className="text-2xl font-bold text-gray-900">{data.totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">تعداد مسیرهای رشد</h3>
          <p className="text-2xl font-bold text-gray-900">{data.totalPaths}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">مراحل تکمیل‌شده کل</h3>
          <p className="text-2xl font-bold text-gray-900">{data.totalCompletedSteps}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">میانگین مراحل به ازای هر کاربر</h3>
          <p className="text-2xl font-bold text-gray-900">{data.averageStepsPerUser}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">میانگین پیشرفت در مسیرها</h2>
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
              title: {
                display: true,
                text: 'میانگین مراحل تکمیل‌شده در هر مسیر'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'تعداد مراحل'
                }
              }
            }
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data.pathStats).map(([pathId, stats]) => (
          <div key={pathId} className="bg-white rounded-lg shadow p-4">
            <h3 className="font-medium text-gray-900 mb-2">{stats.title}</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">تعداد کاربران:</span>
                <span className="text-blue-600">{stats.totalUsers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">میانگین پیشرفت:</span>
                <span className="text-green-600">{stats.averageCompletion} مرحله</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 