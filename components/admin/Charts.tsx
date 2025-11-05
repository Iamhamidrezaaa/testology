'use client'

import { Doughnut, Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface Stats {
  userLevels: {
    beginner: number
    intermediate: number
    advanced: number
  }
  weeklyTests: {
    labels: string[]
    data: number[]
  }
  alerts: {
    labels: string[]
    data: number[]
  }
  growthPaths: {
    labels: string[]
    data: number[]
  }
}

export default function Charts({ stats }: { stats: Stats }) {
  const userLevelsData = {
    labels: ['مبتدی', 'متوسط', 'پیشرفته'],
    datasets: [
      {
        data: [
          stats.userLevels.beginner,
          stats.userLevels.intermediate,
          stats.userLevels.advanced,
        ],
        backgroundColor: ['#60A5FA', '#34D399', '#F87171'],
      },
    ],
  }

  const weeklyTestsData = {
    labels: stats.weeklyTests.labels,
    datasets: [
      {
        label: 'تست‌های هفته',
        data: stats.weeklyTests.data,
        backgroundColor: '#60A5FA',
      },
    ],
  }

  const alertsData = {
    labels: stats.alerts.labels,
    datasets: [
      {
        label: 'هشدارها',
        data: stats.alerts.data,
        borderColor: '#F87171',
        tension: 0.1,
      },
    ],
  }

  const growthPathsData = {
    labels: stats.growthPaths.labels,
    datasets: [
      {
        label: 'پیشرفت',
        data: stats.growthPaths.data,
        backgroundColor: '#34D399',
      },
    ],
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">سطح کاربران</h3>
        <div className="h-64">
          <Doughnut data={userLevelsData} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">تست‌های هفته اخیر</h3>
        <div className="h-64">
          <Bar data={weeklyTestsData} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">هشدارهای ایجادشده</h3>
        <div className="h-64">
          <Line data={alertsData} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">مسیرهای رشد کاربران</h3>
        <div className="h-64">
          <Bar data={growthPathsData} />
        </div>
      </div>
    </div>
  )
} 