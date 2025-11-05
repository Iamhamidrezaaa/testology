'use client'

import { useState } from 'react'
// import { UserPoint } from '@/types/user' // Commented out as UserPoint type is not available

interface RewardsPanelProps {
  initialPoints: any[] // Changed from UserPoint[] to any[]
}

export default function RewardsPanel({ initialPoints }: RewardsPanelProps) {
  const [points, setPoints] = useState(initialPoints)
  const [loading, setLoading] = useState(false)
  const [newPoint, setNewPoint] = useState({
    userId: '',
    points: 0,
    description: '',
    source: 'ADMIN_GIFT'
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await fetch('/api/admin/points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPoint)
      })

      if (response.ok) {
        const result = await response.json()
        setPoints([result, ...points])
        setNewPoint({
          userId: '',
          points: 0,
          description: '',
          source: 'ADMIN_GIFT'
        })
      } else {
        throw new Error('خطا در ثبت امتیاز')
      }
    } catch (error) {
      console.error('خطا در ثبت امتیاز:', error)
      alert('خطا در ثبت امتیاز')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* فرم افزودن امتیاز جدید */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">افزودن امتیاز جدید</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">شناسه کاربر</label>
            <input
              type="text"
              value={newPoint.userId}
              onChange={e => setNewPoint({...newPoint, userId: e.target.value})}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">امتیاز</label>
            <input
              type="number"
              value={newPoint.points}
              onChange={e => setNewPoint({...newPoint, points: parseInt(e.target.value)})}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">دلیل</label>
            <input
              type="text"
              value={newPoint.description}
              onChange={e => setNewPoint({...newPoint, description: e.target.value})}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">منبع</label>
            <select
              value={newPoint.source}
              onChange={e => setNewPoint({...newPoint, source: e.target.value})}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="TEST_COMPLETION">تکمیل آزمون</option>
              <option value="DAILY_LOGIN">ورود روزانه</option>
              <option value="SHARING">اشتراک‌گذاری</option>
              <option value="INVITE">دعوت دوستان</option>
              <option value="ADMIN_GIFT">هدیه ادمین</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'در حال ثبت...' : 'افزودن امتیاز'}
          </button>
        </form>
      </div>

      {/* جدول امتیازها */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">لیست امتیازها</h2>
        <div className="overflow-x-auto">
          <table className="w-full border text-right">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">کاربر</th>
                <th className="p-2">امتیاز</th>
                <th className="p-2">دلیل</th>
                <th className="p-2">منبع</th>
                <th className="p-2">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {points.map(point => (
                <tr key={point.id} className="border-t">
                  <td className="p-2">{point.user?.name || point.user?.email || 'نامشخص'}</td>
                  <td className="p-2">{point.points}</td>
                  <td className="p-2">{point.description}</td>
                  <td className="p-2">{point.source}</td>
                  <td className="p-2">{new Date(point.createdAt).toLocaleDateString('fa-IR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 