'use client'

import { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface TestData {
  testName: string
  count: number
  percentage: number
}

export default function PopularTestsPieChart() {
  const [data, setData] = useState<TestData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/reports-public?period=month')
      .then(res => res.json())
      .then(response => {
        // اطمینان از اینکه testPopularity یک آرایه است
        if (response && Array.isArray(response.testPopularity)) {
          setData(response.testPopularity)
        } else {
          console.error('Invalid data format:', response)
          setData([])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching popular tests:', err)
        setData([])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="p-4 bg-white rounded shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const colors = [
    '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6',
    '#8b5cf6', '#14b8a6', '#f97316', '#ec4899', '#06b6d4'
  ]

  // اگر داده‌ای وجود ندارد، پیام مناسب نمایش بده
  if (!data || data.length === 0) {
    return (
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-lg font-bold mb-4">محبوب‌ترین تست‌ها</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          داده‌ای برای نمایش وجود ندارد
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-4">محبوب‌ترین تست‌ها</h2>
      <div className="h-64">
        <Pie
          data={{
            labels: data.map(d => d.testName),
            datasets: [{
              data: data.map(d => d.count),
              backgroundColor: colors.slice(0, data.length),
              borderColor: colors.slice(0, data.length),
              borderWidth: 1,
            }],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'right' as const,
                labels: {
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    size: 12
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const dataIndex = context.dataIndex
                    const testData = data[dataIndex]
                    return [
                      `تست: ${testData.testName}`,
                      `تعداد انجام: ${testData.count}`,
                      `درصد: ${testData.percentage}%`
                    ]
                  }
                }
              }
            }
          }}
        />
      </div>
      
      {/* لیست جزئیات */}
      <div className="mt-4 space-y-2">
        <h3 className="font-semibold text-gray-700">جزئیات:</h3>
        {data.slice(0, 5).map((test, index) => (
          <div key={test.testName} className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: colors[index] }}
              ></div>
              <span>{test.testName}</span>
            </div>
            <div className="text-gray-600">
              {test.count} بار ({test.percentage}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

















