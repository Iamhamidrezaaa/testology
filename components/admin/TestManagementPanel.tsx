'use client'

import { useState } from 'react'
import { Test, TestCategory, TestStatus } from '@/types/test'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react'

interface TestManagementPanelProps {
  initialTests: Test[]
}

export default function TestManagementPanel({ initialTests }: TestManagementPanelProps) {
  const [tests, setTests] = useState<Test[]>(initialTests)
  const [editingTest, setEditingTest] = useState<Test | null>(null)
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEdit = (test: Test) => {
    setEditingTest(test)
  }

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingTest) return

    try {
      setLoading(true)
      const response = await fetch(`/api/admin/tests/${editingTest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingTest)
      })

      if (response.ok) {
        const updatedTest = await response.json()
        setTests(tests.map(test => 
          test.id === updatedTest.id ? updatedTest : test
        ))
        setEditingTest(null)
      } else {
        throw new Error('خطا در به‌روزرسانی تست')
      }
    } catch (error) {
      console.error('خطا در به‌روزرسانی تست:', error)
      alert('خطا در به‌روزرسانی تست')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newTest = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as TestCategory,
      timeLimit: parseInt(formData.get('timeLimit') as string) || null,
      isPublic: formData.get('isPublic') === 'true',
      questions: JSON.parse(formData.get('questions') as string)
    }

    try {
      setLoading(true)
      const response = await fetch('/api/admin/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTest)
      })

      if (response.ok) {
        const createdTest = await response.json()
        setTests([...tests, createdTest])
        setShowCreateForm(false)
        e.currentTarget.reset()
      } else {
        throw new Error('خطا در ایجاد تست جدید')
      }
    } catch (error) {
      console.error('خطا در ایجاد تست جدید:', error)
      alert('خطا در ایجاد تست جدید')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">مدیریت تست‌ها</h2>
        <Button onClick={() => setShowCreateForm(true)} disabled={loading}>
          <Plus className="w-4 h-4 mr-2" />
          افزودن تست
        </Button>
      </div>

      {editingTest && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTest.id ? 'ویرایش تست' : 'افزودن تست جدید'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">عنوان</label>
                <Input
                  value={editingTest.title}
                  onChange={e => setEditingTest({ ...editingTest, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">توضیحات</label>
                <Textarea
                  value={editingTest.description || ''}
                  onChange={e => setEditingTest({ ...editingTest, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">دسته‌بندی</label>
                <Select
                  value={editingTest.category}
                  onValueChange={(value: TestCategory) => setEditingTest({ ...editingTest, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PSYCHOLOGICAL">روانشناسی</SelectItem>
                    <SelectItem value="HEALTH">سلامت</SelectItem>
                    <SelectItem value="JOB_SATISFACTION">رضایت شغلی</SelectItem>
                    <SelectItem value="PERSONALITY">شخصیت</SelectItem>
                    <SelectItem value="OTHER">سایر</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">وضعیت</label>
                <Select
                  value={editingTest.status}
                  onValueChange={(value: TestStatus) => setEditingTest({ ...editingTest, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">پیش‌نویس</SelectItem>
                    <SelectItem value="PUBLISHED">منتشر شده</SelectItem>
                    <SelectItem value="ARCHIVED">بایگانی شده</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingTest(null)}
                  disabled={loading}
                >
                  انصراف
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  ذخیره
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {tests.map(test => (
          <Card key={test.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{test.title}</h3>
                  {test.description && (
                    <p className="text-gray-600 mt-1">{test.description}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      test.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-800'
                        : test.status === 'DRAFT'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {test.status}
                    </span>
                    <span className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {test.category}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(test)}
                    disabled={loading}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(test.id)}
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 