'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TestFormProps {
  initialData?: {
    id?: string
    title: string
    description?: string | null
    category: string
    status: string
    timeLimit?: number | null
    isPublic: boolean
  }
}

export default function TestForm({ initialData }: TestFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'PSYCHOLOGICAL',
    status: initialData?.status || 'DRAFT',
    timeLimit: initialData?.timeLimit || null,
    isPublic: initialData?.isPublic || false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(
        initialData?.id
          ? `/api/admin/tests/${initialData.id}`
          : '/api/admin/tests',
        {
          method: initialData?.id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      )

      if (response.ok) {
        router.push('/admin-panel/tests')
        router.refresh()
      } else {
        throw new Error('خطا در ذخیره تست')
      }
    } catch (error) {
      console.error('خطا در ذخیره تست:', error)
      alert('خطا در ذخیره تست')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          عنوان تست
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          توضیحات
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description || ''}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          دسته‌بندی
        </label>
        <select
          id="category"
          required
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="PSYCHOLOGICAL">روانشناسی</option>
          <option value="HEALTH">سلامت</option>
          <option value="JOB_SATISFACTION">رضایت شغلی</option>
          <option value="PERSONALITY">شخصیت</option>
          <option value="OTHER">سایر</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          وضعیت
        </label>
        <select
          id="status"
          required
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="DRAFT">پیش‌نویس</option>
          <option value="PUBLISHED">منتشر شده</option>
          <option value="ARCHIVED">بایگانی شده</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="timeLimit"
          className="block text-sm font-medium text-gray-700"
        >
          محدودیت زمانی (دقیقه)
        </label>
        <input
          type="number"
          id="timeLimit"
          min="1"
          value={formData.timeLimit || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              timeLimit: e.target.value ? parseInt(e.target.value) : null
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPublic"
          checked={formData.isPublic}
          onChange={(e) =>
            setFormData({ ...formData, isPublic: e.target.checked })
          }
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label
          htmlFor="isPublic"
          className="mr-2 block text-sm text-gray-900"
        >
          تست عمومی
        </label>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'در حال ذخیره...' : 'ذخیره'}
        </button>
      </div>
    </form>
  )
} 