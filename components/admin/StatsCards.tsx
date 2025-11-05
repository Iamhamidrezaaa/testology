'use client'

import { Users, Brain, TrendingUp, AlertTriangle } from 'lucide-react'

interface Stats {
  activeUsers: number
  todayTests: number
  activeAlerts: number
  recentFeedbacks: number
}

export default function StatsCards({ stats }: { stats: Stats }) {
  const cards = [
    {
      title: 'کاربران فعال',
      value: stats.activeUsers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'تست‌های امروز',
      value: stats.todayTests,
      icon: Brain,
      color: 'bg-green-500',
    },
    {
      title: 'هشدارهای فعال',
      value: stats.activeAlerts,
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
    {
      title: 'بازخوردهای اخیر',
      value: stats.recentFeedbacks,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="bg-white rounded-lg shadow p-6 flex items-center gap-4"
          >
            <div className={`${card.color} p-3 rounded-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {card.value.toLocaleString('fa-IR')}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
} 