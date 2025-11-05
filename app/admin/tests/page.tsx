'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Plus, ToggleLeft, ToggleRight } from 'lucide-react'
import EditTestModal from './components/EditTestModal'

interface Test {
  id: string
  testSlug: string
  testName: string
  description: string
  questionCount: number
  completionCount: number
  averageScore: number
  isActive: boolean
  createdAt: string
  category: string
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [editingTest, setEditingTest] = useState<Test | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const fetchTests = () => {
    setLoading(true)
    fetch('/api/admin/tests')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error('API Error:', data.error)
          setTests([])
        } else {
          setTests(data.tests || [])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching tests:', err)
        setTests([])
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchTests()
  }, [])

  const categories = ['all', 'anxiety', 'depression', 'self-esteem', 'stress', 'life-satisfaction']
  const categoryLabels = {
    'all': 'همه',
    'anxiety': 'اضطراب',
    'depression': 'افسردگی',
    'self-esteem': 'عزت نفس',
    'stress': 'استرس',
    'life-satisfaction': 'رضایت از زندگی'
  }

  const filteredTests = (tests || []).filter(test => {
    const matchesSearch = test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = filterCategory === 'all' || test.category === filterCategory
    
    return matchesSearch && matchesCategory
  })

  const toggleTestStatus = async (testId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/tests/${testId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })
      
      if (response.ok) {
        setTests(tests.map(test => 
          test.id === testId ? { ...test, isActive: !currentStatus } : test
        ))
        alert(`تست ${!currentStatus ? 'فعال' : 'غیرفعال'} شد`)
      } else {
        const errorData = await response.json()
        alert(`خطا در تغییر وضعیت تست: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error toggling test status:', error)
      alert('خطا در تغییر وضعیت تست')
    }
  }

  const handleDeleteTest = async (testId: string) => {
    if (!confirm('آیا از حذف این تست مطمئن هستید؟ تست به سطل زباله منتقل خواهد شد.')) return

    try {
      const response = await fetch(`/api/admin/tests/${testId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('تست به سطل زباله منتقل شد.')
        fetchTests() // Refresh the list
      } else {
        const errorData = await response.json()
        alert(`خطا در حذف تست: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error deleting test:', error)
      alert('خطا در حذف تست')
    }
  }

  const handleViewTest = (testSlug: string) => {
    // Open test page in new tab
    window.open(`/tests/${testSlug}`, '_blank')
  }

  const createSampleTests = async () => {
    if (!confirm('آیا می‌خواهید تست‌های نمونه ایجاد شوند؟ این کار ممکن است چند لحظه طول بکشد.')) return

    try {
      const response = await fetch('/api/admin/tests/create-sample', {
        method: 'POST',
      })

      if (response.ok) {
        alert('تست‌های نمونه با موفقیت ایجاد شدند!')
        fetchTests() // Refresh the list
      } else {
        const errorData = await response.json()
        alert(`خطا در ایجاد تست‌های نمونه: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error creating sample tests:', error)
      alert('خطا در ایجاد تست‌های نمونه')
    }
  }

  const handleEditTest = (test: Test) => {
    setEditingTest(test)
    setShowEditModal(true)
  }

  const handleSaveTest = async (testId: string, updatedTest: any) => {
    try {
      const response = await fetch(`/api/admin/tests/${testId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTest)
      })
      
      if (response.ok) {
        alert('تست با موفقیت به‌روزرسانی شد')
        // Refresh the tests list to show updated data
        fetchTests()
      } else {
        const errorData = await response.json()
        alert(`خطا در به‌روزرسانی تست: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error updating test:', error)
      alert('خطا در به‌روزرسانی تست')
    }
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setEditingTest(null)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* هدر */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">مدیریت تست‌ها</h1>
          <p className="text-gray-600">مدیریت و نظارت بر تست‌های روان‌شناسی</p>
        </div>
        <div className="flex space-x-2">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>تست جدید</span>
          </Button>
          <Button 
            variant="outline"
            onClick={createSampleTests}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>ایجاد تست‌های نمونه</span>
          </Button>
        </div>
      </div>

      {/* آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">🧪 کل تست‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">✅ تست‌های فعال</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.filter(t => t.isActive).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">📊 کل تکمیل‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.reduce((sum, t) => sum + t.completionCount, 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">📈 میانگین امتیاز</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tests.length > 0 ? Math.round(tests.reduce((sum, t) => sum + t.averageScore, 0) / tests.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* فیلترها و جستجو */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="جستجو در نام یا توضیحات تست..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={filterCategory === category ? 'default' : 'outline'}
                  onClick={() => setFilterCategory(category)}
                  size="sm"
                >
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* جدول تست‌ها */}
      <Card>
        <CardHeader>
          <CardTitle>📋 لیست کامل تست‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4">شماره</th>
                  <th className="text-right py-3 px-4">نام تست</th>
                  <th className="text-right py-3 px-4">تعداد انجام</th>
                  <th className="text-right py-3 px-4">میانگین امتیاز</th>
                  <th className="text-right py-3 px-4">اولین تست</th>
                  <th className="text-right py-3 px-4">آخرین تست</th>
                  <th className="text-right py-3 px-4">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map((test, index) => (
                  <tr key={test.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">{test.testName}</td>
                    <td className="py-3 px-4">{test.completionCount}</td>
                    <td className="py-3 px-4">{test.averageScore.toFixed(1)}</td>
                    <td className="py-3 px-4">
                      {test.firstTest ? new Date(test.firstTest).toLocaleDateString('fa-IR') : '—'}
                    </td>
                    <td className="py-3 px-4">
                      {test.lastTest ? new Date(test.lastTest).toLocaleDateString('fa-IR') : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={test.isActive ? 'default' : 'secondary'}>
                        {test.isActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* لیست تست‌ها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTests.map((test) => (
          <Card key={test.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{test.testName}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={test.isActive ? 'default' : 'secondary'}>
                    {test.isActive ? 'فعال' : 'غیرفعال'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleTestStatus(test.id, test.isActive)}
                  >
                    {test.isActive ? (
                      <ToggleRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">تعداد سوالات:</span>
                    <span className="font-medium mr-2">{test.questionCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">تکمیل‌ها:</span>
                    <span className="font-medium mr-2">{test.completionCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">میانگین امتیاز:</span>
                    <span className="font-medium mr-2">{test.averageScore.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">دسته‌بندی:</span>
                    <span className="font-medium mr-2">{categoryLabels[test.category as keyof typeof categoryLabels]}</span>
                  </div>
                  {test.firstTest && (
                    <div>
                      <span className="text-gray-600">اولین تست:</span>
                      <span className="font-medium mr-2">{new Date(test.firstTest).toLocaleDateString('fa-IR')}</span>
                    </div>
                  )}
                  {test.lastTest && (
                    <div>
                      <span className="text-gray-600">آخرین تست:</span>
                      <span className="font-medium mr-2">{new Date(test.lastTest).toLocaleDateString('fa-IR')}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="text-xs text-gray-500">
                    ایجاد شده: {new Date(test.createdAt).toLocaleDateString('fa-IR')}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewTest(test.testSlug)}
                      title="مشاهده تست"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditTest(test)}
                      title="ویرایش تست"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600"
                      onClick={() => handleDeleteTest(test.id)}
                      title="حذف تست"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTests.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-gray-500">هیچ تستی یافت نشد</div>
          </CardContent>
        </Card>
      )}

      {/* مودال ویرایش تست */}
      {editingTest && (
        <EditTestModal
          test={editingTest}
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          onSave={handleSaveTest}
        />
      )}
    </div>
  )
}
