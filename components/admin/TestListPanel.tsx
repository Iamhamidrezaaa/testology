'use client'

import { useState } from 'react'
import { Test, TestCategory, TestStatus } from '@/types/test'
import Link from 'next/link'

interface TestListPanelProps {
  initialTests: Test[]
}

export default function TestListPanel({ initialTests }: TestListPanelProps) {
  const [tests, setTests] = useState(initialTests)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || test.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(tests.map(test => test.category)))

  const handleDelete = async (testId: string) => {
    if (!confirm('آیا از حذف این تست اطمینان دارید؟')) return

    try {
      setLoading(true)
      const response = await fetch(`/api/admin/tests/${testId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTests(tests.filter(test => test.id !== testId))
      } else {
        throw new Error('خطا در حذف تست')
      }
    } catch (error) {
      console.error('خطا در حذف تست:', error)
      alert('خطا در حذف تست')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* فیلترها */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="جستجو در عنوان و توضیحات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">همه دسته‌بندی‌ها</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* لیست تست‌ها */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                عنوان
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                دسته‌بندی
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                وضعیت
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTests.map(test => (
              <tr key={test.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {test.title}
                  </div>
                  {test.description && (
                    <div className="text-sm text-gray-500">
                      {test.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{test.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    test.status === 'PUBLISHED'
                      ? 'bg-green-100 text-green-800'
                      : test.status === 'DRAFT'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {test.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin-panel/tests/${test.id}/questions`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      سوالات
                    </Link>
                    <Link
                      href={`/admin-panel/tests/${test.id}/results`}
                      className="text-green-600 hover:text-green-900"
                    >
                      نتایج
                    </Link>
                    <Link
                      href={`/admin-panel/tests/${test.id}/analytics`}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      آمار
                    </Link>
                    <button
                      onClick={() => handleDelete(test.id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 