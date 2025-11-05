'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface RiskPattern {
  id: string
  name: string
  keywords: string[]
  severity: string
  message: string
  createdAt: string
  _count: {
    matches: number
  }
}

export default function RiskPatternList() {
  const [patterns, setPatterns] = useState<RiskPattern[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/risk-patterns')
      .then(res => res.json())
      .then(data => {
        setPatterns(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link
          href="/admin-panel/risk-patterns/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          افزودن الگوی جدید
        </Link>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 font-medium text-gray-500">نام</th>
              <th className="p-4 font-medium text-gray-500">کلمات کلیدی</th>
              <th className="p-4 font-medium text-gray-500">شدت</th>
              <th className="p-4 font-medium text-gray-500">پیام هشدار</th>
              <th className="p-4 font-medium text-gray-500">تعداد تطبیق‌ها</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {patterns.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{p.name}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {p.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      p.severity === 'high'
                        ? 'bg-red-100 text-red-800'
                        : p.severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {p.severity === 'high'
                      ? 'شدید'
                      : p.severity === 'medium'
                      ? 'متوسط'
                      : 'کم'}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{p.message}</td>
                <td className="p-4 text-gray-500">{p._count.matches}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 