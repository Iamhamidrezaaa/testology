'use client'

import { useState } from 'react'
import { UserLevel } from '@/types/user'

interface LevelManagementPanelProps {
  initialLevels: UserLevel[]
}

export default function LevelManagementPanel({ initialLevels }: LevelManagementPanelProps) {
  const [levels, setLevels] = useState(initialLevels)
  const [editingLevel, setEditingLevel] = useState<UserLevel | null>(null)
  const [loading, setLoading] = useState(false)

  const handleEdit = (level: UserLevel) => {
    setEditingLevel(level)
  }

  const handleDelete = async (levelId: string) => {
    if (!confirm('آیا از حذف این سطح اطمینان دارید؟')) return

    try {
      setLoading(true)
      const response = await fetch(`/api/admin/levels/${levelId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setLevels(levels.filter(level => level.id !== levelId))
      } else {
        throw new Error('خطا در حذف سطح')
      }
    } catch (error) {
      console.error('خطا در حذف سطح:', error)
      alert('خطا در حذف سطح')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingLevel) return

    try {
      setLoading(true)
      const response = await fetch(`/api/admin/levels/${editingLevel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingLevel)
      })

      if (response.ok) {
        const updatedLevel = await response.json()
        setLevels(levels.map(level => 
          level.id === updatedLevel.id ? updatedLevel : level
        ))
        setEditingLevel(null)
      } else {
        throw new Error('خطا در به‌روزرسانی سطح')
      }
    } catch (error) {
      console.error('خطا در به‌روزرسانی سطح:', error)
      alert('خطا در به‌روزرسانی سطح')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newLevel = {
      level: parseInt(formData.get('level') as string),
      title: formData.get('title') as string,
      minPoints: parseInt(formData.get('minPoints') as string),
      badgeUrl: formData.get('badgeUrl') as string,
      benefits: (formData.get('benefits') as string).split('\n').filter(Boolean)
    }

    try {
      setLoading(true)
      const response = await fetch('/api/admin/levels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLevel)
      })

      if (response.ok) {
        const createdLevel = await response.json()
        setLevels([...levels, createdLevel])
        e.currentTarget.reset()
      } else {
        throw new Error('خطا در ایجاد سطح جدید')
      }
    } catch (error) {
      console.error('خطا در ایجاد سطح جدید:', error)
      alert('خطا در ایجاد سطح جدید')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* فرم ایجاد سطح جدید */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">افزودن سطح جدید</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">سطح</label>
            <input
              type="number"
              name="level"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">عنوان</label>
            <input
              type="text"
              name="title"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">حداقل امتیاز</label>
            <input
              type="number"
              name="minPoints"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">آدرس نشان</label>
            <input
              type="url"
              name="badgeUrl"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">مزایا (هر خط یک مورد)</label>
            <textarea
              name="benefits"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'در حال ثبت...' : 'افزودن سطح جدید'}
          </button>
        </form>
      </div>

      {/* لیست سطوح */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">سطوح موجود</h2>
        <div className="space-y-4">
          {levels.map(level => (
            <div key={level.id} className="border rounded-lg p-4">
              {editingLevel?.id === level.id ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">سطح</label>
                    <input
                      type="number"
                      value={editingLevel.level}
                      onChange={e => setEditingLevel({...editingLevel, level: parseInt(e.target.value)})}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">عنوان</label>
                    <input
                      type="text"
                      value={editingLevel.title}
                      onChange={e => setEditingLevel({...editingLevel, title: e.target.value})}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">حداقل امتیاز</label>
                    <input
                      type="number"
                      value={editingLevel.minPoints}
                      onChange={e => setEditingLevel({...editingLevel, minPoints: parseInt(e.target.value)})}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">آدرس نشان</label>
                    <input
                      type="url"
                      value={editingLevel.badgeUrl || ''}
                      onChange={e => setEditingLevel({...editingLevel, badgeUrl: e.target.value})}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">مزایا (هر خط یک مورد)</label>
                    <textarea
                      value={editingLevel.benefits || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setEditingLevel({
                          ...editingLevel,
                          benefits: e.target.value || undefined
                        });
                      }}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingLevel(null)}
                      className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                    >
                      انصراف
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{level.title}</h3>
                      <p className="text-gray-600">سطح {level.level}</p>
                      <p className="text-gray-600">حداقل امتیاز: {level.minPoints}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(level)}
                        className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleDelete(level.id)}
                        disabled={loading}
                        className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                  {level.benefits && level.benefits.split('\n').length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-medium text-gray-700">مزایا:</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {level.benefits.split('\n').map((benefit: string, index: number) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 