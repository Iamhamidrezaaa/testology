'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { GripVertical, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Test {
  id: string
  title: string
  description: string
}

interface TestBundleTest {
  id: string
  testId: string
  order: number
  test: Test
}

interface TestBundle {
  id: string
  name: string
  description: string
  tests: TestBundleTest[]
}

interface TestBundleFormProps {
  bundle?: TestBundle
  mode: 'create' | 'edit'
}

export default function TestBundleForm({ bundle, mode }: TestBundleFormProps) {
  const [name, setName] = useState(bundle?.name || '')
  const [description, setDescription] = useState(bundle?.description || '')
  const [selectedTests, setSelectedTests] = useState<Test[]>([])
  const [availableTests, setAvailableTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchTests()
    if (bundle) {
      setSelectedTests(bundle.tests.map(t => t.test))
    }
  }, [bundle])

  const fetchTests = async () => {
    try {
      const response = await fetch('/api/admin/tests')
      if (!response.ok) throw new Error('خطا در دریافت تست‌ها')
      const data = await response.json()
      setAvailableTests(data)
    } catch (error) {
      console.error('Error fetching tests:', error)
      toast.error('خطا در دریافت تست‌ها')
    }
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(selectedTests)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSelectedTests(items)
  }

  const handleAddTest = (test: Test) => {
    if (!selectedTests.find(t => t.id === test.id)) {
      setSelectedTests([...selectedTests, test])
    }
  }

  const handleRemoveTest = (testId: string) => {
    setSelectedTests(selectedTests.filter(t => t.id !== testId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !description || selectedTests.length === 0) {
      toast.error('لطفاً تمام فیلدها را پر کنید')
      return
    }

    setLoading(true)
    try {
      const data = {
        name,
        description,
        testIds: selectedTests.map(t => t.id)
      }

      const url = mode === 'create' 
        ? '/api/admin/test-bundles'
        : `/api/admin/test-bundles/${bundle?.id}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('خطا در ذخیره باندل')

      toast.success(mode === 'create' ? 'باندل با موفقیت ایجاد شد' : 'باندل با موفقیت به‌روز شد')
      router.push('/admin-panel/test-bundles')
    } catch (error) {
      console.error('Error saving bundle:', error)
      toast.error('خطا در ذخیره باندل')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'ایجاد باندل جدید' : 'ویرایش باندل'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              نام باندل
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="نام باندل را وارد کنید"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              توضیحات
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات باندل را وارد کنید"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>تست‌های موجود</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {availableTests.map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <span>{test.title}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddTest(test)}
                    disabled={selectedTests.some(t => t.id === test.id)}
                  >
                    افزودن
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تست‌های انتخاب شده</CardTitle>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="selected-tests">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {selectedTests.map((test, index) => (
                      <Draggable
                        key={test.id}
                        draggableId={test.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center gap-2 p-2 border rounded-lg bg-background"
                          >
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <span className="flex-1">{test.title}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveTest(test.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin-panel/test-bundles')}
        >
          انصراف
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'در حال ذخیره...' : mode === 'create' ? 'ایجاد باندل' : 'به‌روزرسانی باندل'}
        </Button>
      </div>
    </form>
  )
} 