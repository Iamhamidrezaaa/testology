'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  parentId: string | null
  createdAt: Date
  updatedAt: Date
}

interface CategoryWithRelations extends Category {
  parent?: Category | null
  children?: Category[]
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<CategoryWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    parentId: ''
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (!response.ok) throw new Error('خطا در دریافت دسته‌بندی‌ها')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      toast.error('خطا در دریافت دسته‌بندی‌ها')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'خطا در ذخیره دسته‌بندی')
      }

      await fetchCategories()
      resetForm()
      toast.success(editingId ? 'دسته‌بندی با موفقیت ویرایش شد' : 'دسته‌بندی با موفقیت ایجاد شد')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'خطا در ذخیره دسته‌بندی')
    }
  }

  const handleEdit = (category: CategoryWithRelations) => {
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '',
      parentId: category.parentId || ''
    })
    setEditingId(category.id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) return

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'خطا در حذف دسته‌بندی')
      }

      await fetchCategories()
      toast.success('دسته‌بندی با موفقیت حذف شد')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'خطا در حذف دسته‌بندی')
    }
  }

  const resetForm = () => {
    setForm({ name: '', slug: '', description: '', icon: '', parentId: '' })
    setEditingId(null)
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(search.toLowerCase()) ||
    category.slug.toLowerCase().includes(search.toLowerCase()) ||
    (category.description || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="p-4">در حال بارگذاری...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h1>
      </div>

      {/* جستجو */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="جستجو در نام، اسلاگ یا توضیحات..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* فرم افزودن/ویرایش دسته‌بندی */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">نام</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">اسلاگ</label>
            <input
              type="text"
              value={form.slug}
              onChange={e => setForm({ ...form, slug: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">توضیحات</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">آیکون</label>
            <input
              type="text"
              value={form.icon}
              onChange={e => setForm({ ...form, icon: e.target.value })}
              placeholder="emoji یا URL تصویر"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">دسته‌بندی والد</label>
            <select
              value={form.parentId}
              onChange={e => setForm({ ...form, parentId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">بدون والد</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              {editingId ? 'ویرایش' : 'افزودن'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                انصراف
              </button>
            )}
          </div>
        </form>
      </div>

      {/* جدول دسته‌بندی‌ها */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسلاگ</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">آیکون</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">والد</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCategories.map(category => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.slug}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category.icon?.startsWith('http') ? (
                    <img src={category.icon} alt={category.name} className="w-6 h-6" />
                  ) : (
                    category.icon
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category.parent?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:text-blue-900 ml-4"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 