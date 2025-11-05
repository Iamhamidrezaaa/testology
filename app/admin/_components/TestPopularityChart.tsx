'use client'

import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

interface TestData {
  testName: string
  count: number
  percentage: number
}

export default function TestPopularityChart() {
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
        console.error('Error fetching test popularity:', err)
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
        <Bar
          data={{
            labels: data.map(d => d.testName),
            datasets: [
              {
                label: 'تعداد انجام',
                data: data.map(d => d.count),
                backgroundColor: '#10b981',
                borderColor: '#10b981',
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top' as const,
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const dataIndex = context.dataIndex
                    const testData = data[dataIndex]
                    return [
                      `تعداد انجام: ${context.parsed.y}`,
                      `درصد: ${testData.percentage}%`
                    ]
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }}
        />
      </div>
    </div>
  )
}

















