'use client'
import { useEffect, useState } from 'react'

interface User {
  id: string
  name: string | null
  phoneNumber: string
  email: string
}

interface RiskPattern {
  id: string
  name: string
  severity: string
}

interface UserRiskMatch {
  id: string
  user: User
  pattern: RiskPattern
  matchedAt: string
  resolved: boolean
}

export default function UserRiskMatchList() {
  const [matches, setMatches] = useState<UserRiskMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [severityFilter, setSeverityFilter] = useState('all')
  const [resolvedFilter, setResolvedFilter] = useState('all')

  useEffect(() => {
    fetch('/api/admin/risk-matches')
      .then(res => res.json())
      .then(data => {
        setMatches(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error:', error)
        setLoading(false)
      })
  }, [])

  const filtered = matches.filter((m) => {
    const severityOk = severityFilter === 'all' || m.pattern.severity === severityFilter
    const resolvedOk = resolvedFilter === 'all' || m.resolved?.toString() === resolvedFilter
    return severityOk && resolvedOk
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <select
          value={severityFilter}
          onChange={e => setSeverityFilter(e.target.value)}
          className="border rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">همه شدت‌ها</option>
          <option value="high">شدید</option>
          <option value="medium">متوسط</option>
          <option value="low">کم</option>
        </select>
        <select
          value={resolvedFilter}
          onChange={e => setResolvedFilter(e.target.value)}
          className="border rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="true">رسیدگی‌شده</option>
          <option value="false">در انتظار</option>
        </select>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 font-medium text-gray-500">کاربر</th>
              <th className="p-4 font-medium text-gray-500">الگو</th>
              <th className="p-4 font-medium text-gray-500">شدت</th>
              <th className="p-4 font-medium text-gray-500">زمان تشخیص</th>
              <th className="p-4 font-medium text-gray-500">وضعیت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium text-gray-900">{m.user.name}</div>
                  <div className="text-gray-500">{m.user.phoneNumber}</div>
                </td>
                <td className="p-4 font-medium text-gray-900">{m.pattern.name}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      m.pattern.severity === 'high'
                        ? 'bg-red-100 text-red-800'
                        : m.pattern.severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {m.pattern.severity === 'high'
                      ? 'شدید'
                      : m.pattern.severity === 'medium'
                      ? 'متوسط'
                      : 'کم'}
                  </span>
                </td>
                <td className="p-4 text-gray-500">
                  {new Date(m.matchedAt).toLocaleString('fa-IR')}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      m.resolved
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {m.resolved ? '✅ رسیدگی‌شده' : '🕒 در انتظار'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 