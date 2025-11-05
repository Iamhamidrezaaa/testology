'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface CriticalWindow {
  id: string
  userId: string
  user: {
    name: string
    email: string
  }
  dayOfWeek: number
  hourStart: number
  hourEnd: number
  moodScoreAvg: number | null
  testCount: number
  lastTestAt: string | null
  createdAt: string
  updatedAt: string
}

export default function CriticalTimesPage() {
  const [windows, setWindows] = useState<CriticalWindow[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    dayOfWeek: '',
    hourStart: '',
    hourEnd: '',
  })

  useEffect(() => {
    fetch('/api/admin/critical-times')
      .then(res => res.json())
      .then((data: CriticalWindow[]) => {
        setWindows(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error:', error)
        setLoading(false)
      })
  }, [])

  const filteredWindows = windows.filter(window => {
    if (filters.dayOfWeek && window.dayOfWeek !== parseInt(filters.dayOfWeek)) return false
    if (filters.hourStart && window.hourStart < parseInt(filters.hourStart)) return false
    if (filters.hourEnd && window.hourEnd > parseInt(filters.hourEnd)) return false
    return true
  })

  const chartData = {
    labels: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'],
    datasets: [
      {
        label: 'میانگین نمره خلق',
        data: [0, 1, 2, 3, 4, 5, 6].map(day => {
          const dayWindows = filteredWindows.filter(w => w.dayOfWeek === day)
          if (dayWindows.length === 0) return null
          const avg = dayWindows.reduce((sum, w) => sum + (w.moodScoreAvg || 0), 0) / dayWindows.length
          return avg
        }),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  const getDayName = (day: number) => {
    const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']
    return days[day]
  }

  const formatTime = (hour: number) => {
    return `${hour}:00`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">⏰ زمان‌های بحرانی</h1>
        
        <div className="mb-6 grid grid-cols-3 gap-4">
          <select
            value={filters.dayOfWeek}
            onChange={(e) => setFilters(prev => ({ ...prev, dayOfWeek: e.target.value }))}
            className="border rounded-md p-2"
          >
            <option value="">همه روزها</option>
            <option value="0">یکشنبه</option>
            <option value="1">دوشنبه</option>
            <option value="2">سه‌شنبه</option>
            <option value="3">چهارشنبه</option>
            <option value="4">پنج‌شنبه</option>
            <option value="5">جمعه</option>
            <option value="6">شنبه</option>
          </select>
          
          <input
            type="number"
            placeholder="ساعت شروع"
            value={filters.hourStart}
            onChange={(e) => setFilters(prev => ({ ...prev, hourStart: e.target.value }))}
            className="border rounded-md p-2"
            min="0"
            max="23"
          />
          
          <input
            type="number"
            placeholder="ساعت پایان"
            value={filters.hourEnd}
            onChange={(e) => setFilters(prev => ({ ...prev, hourEnd: e.target.value }))}
            className="border rounded-md p-2"
            min="0"
            max="23"
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <Line data={chartData} />
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 font-medium text-gray-500">روز هفته</th>
                <th className="p-4 font-medium text-gray-500">ساعت شروع</th>
                <th className="p-4 font-medium text-gray-500">ساعت پایان</th>
                <th className="p-4 font-medium text-gray-500">میانگین نمره خلق</th>
                <th className="p-4 font-medium text-gray-500">تعداد تست‌ها</th>
                <th className="p-4 font-medium text-gray-500">آخرین تست</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWindows.map((window) => (
                <tr key={window.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    {['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'][window.dayOfWeek]}
                  </td>
                  <td className="p-4">{window.hourStart}:00</td>
                  <td className="p-4">{window.hourEnd}:00</td>
                  <td className="p-4">
                    {window.moodScoreAvg !== null ? window.moodScoreAvg.toFixed(2) : '-'}
                  </td>
                  <td className="p-4">{window.testCount}</td>
                  <td className="p-4">
                    {window.lastTestAt ? new Date(window.lastTestAt).toLocaleDateString('fa-IR') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 