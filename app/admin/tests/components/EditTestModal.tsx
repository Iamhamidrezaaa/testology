'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { X, Plus, Trash2, Save } from 'lucide-react'

interface Option {
  id?: string // Optional for new options
  text: string
  isCorrect: boolean
  score: number
  order: number
  isDeleted?: boolean // For soft delete
}

interface Question {
  id?: string // Optional for new questions
  text: string
  order: number
  options: Option[]
  isDeleted?: boolean // For soft delete
}

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
  firstTest?: string
  lastTest?: string
  questions?: Question[] // Now includes actual questions
}

interface EditTestModalProps {
  test: Test
  isOpen: boolean
  onClose: () => void
  onSave: (testId: string, updatedTest: any) => void
}

export default function EditTestModal({ test, isOpen, onClose, onSave }: EditTestModalProps) {
  const [editedTest, setEditedTest] = useState<Test>(test)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && test.id) {
      setLoading(true)
      setError(null)
      // Fetch the full test details including questions and options
      fetch(`/api/admin/tests/${test.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setEditedTest(data.data)
          } else {
            setError(data.error || 'خطا در دریافت اطلاعات تست')
          }
        })
        .catch(err => {
          console.error('Error fetching test details:', err)
          setError('خطا در دریافت اطلاعات تست')
        })
        .finally(() => setLoading(false))
    }
  }, [isOpen, test.id])

  if (!isOpen) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedTest(prev => ({ ...prev, [name]: value }))
  }

  const handleQuestionChange = (questionId: string | undefined, field: keyof Question, value: any) => {
    setEditedTest(prev => ({
      ...prev,
      questions: prev.questions?.map(q =>
        (q.id === questionId || (!q.id && questionId !== undefined && q.order === Number(questionId))) // Handle new questions without ID
          ? { ...q, [field]: value }
          : q
      ),
    }))
  }

  const handleOptionChange = (questionId: string | undefined, optionId: string | undefined, field: keyof Option, value: any) => {
    setEditedTest(prev => ({
      ...prev,
      questions: prev.questions?.map(q =>
        (q.id === questionId || (!q.id && questionId !== undefined && q.order === Number(questionId)))
          ? {
              ...q,
              options: q.options.map(o =>
                (o.id === optionId || (!o.id && optionId !== undefined && o.order === Number(optionId))) // Handle new options without ID
                  ? { ...o, [field]: value }
                  : o
              ),
            }
          : q
      ),
    }))
  }

  const addQuestion = () => {
    setEditedTest(prev => ({
      ...prev,
      questions: [
        ...(prev.questions || []),
        {
          text: '',
          order: (prev.questions?.length || 0) + 1,
          options: [{ text: '', isCorrect: false, score: 0, order: 1 }],
        },
      ],
    }))
  }

  const removeQuestion = (questionId: string | undefined) => {
    setEditedTest(prev => ({
      ...prev,
      questions: prev.questions?.map(q =>
        (q.id === questionId || (!q.id && questionId !== undefined && q.order === Number(questionId)))
          ? { ...q, isDeleted: true } // Mark for soft delete
          : q
      ),
    }))
  }

  const addOption = (questionId: string | undefined) => {
    setEditedTest(prev => ({
      ...prev,
      questions: prev.questions?.map(q =>
        (q.id === questionId || (!q.id && questionId !== undefined && q.order === Number(questionId)))
          ? {
              ...q,
              options: [
                ...(q.options || []),
                { text: '', isCorrect: false, score: 0, order: (q.options?.length || 0) + 1 },
              ],
            }
          : q
      ),
    }))
  }

  const removeOption = (questionId: string | undefined, optionId: string | undefined) => {
    setEditedTest(prev => ({
      ...prev,
      questions: prev.questions?.map(q =>
        (q.id === questionId || (!q.id && questionId !== undefined && q.order === Number(questionId)))
          ? {
              ...q,
              options: q.options.map(o =>
                (o.id === optionId || (!o.id && optionId !== undefined && o.order === Number(optionId)))
                  ? { ...o, isDeleted: true } // Mark for soft delete
                  : o
              ),
            }
          : q
      ),
    }))
  }

  const handleSave = () => {
    // Filter out deleted questions and options before sending to API
    const questionsToSave = editedTest.questions
      ?.filter(q => !q.isDeleted)
      .map(q => ({
        ...q,
        options: q.options?.filter(o => !o.isDeleted),
      }))

    onSave(test.id, { ...editedTest, questions: questionsToSave })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="bg-white flex flex-row items-center justify-between">
          <CardTitle>ویرایش تست: {editedTest.testName}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 bg-white">
          {loading ? (
            <div className="text-center py-8">در حال بارگذاری...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="testName" className="block text-sm font-medium text-gray-700">نام تست</label>
                  <Input
                    id="testName"
                    name="testName"
                    value={editedTest.testName}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="testSlug" className="block text-sm font-medium text-gray-700">اسلاگ تست</label>
                  <Input
                    id="testSlug"
                    name="testSlug"
                    value={editedTest.testSlug}
                    onChange={handleInputChange}
                    className="mt-1"
                    disabled // Slug usually shouldn't be editable directly
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">دسته بندی</label>
                  <Input
                    id="category"
                    name="category"
                    value={editedTest.category || ''}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={editedTest.isActive}
                    onChange={(e) => setEditedTest(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">فعال</label>
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">توضیحات</label>
                <Textarea
                  id="description"
                  name="description"
                  value={editedTest.description || ''}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>

              <h3 className="text-lg font-semibold mt-6">سوالات</h3>
              <div className="space-y-4">
                {editedTest.questions?.filter(q => !q.isDeleted).map((question, qIndex) => (
                  <Card key={question.id || `new-q-${question.order}`} className="border-2 bg-white">
                    <CardHeader className="pb-3 bg-white flex flex-row items-center justify-between">
                      <CardTitle className="text-base">سوال {qIndex + 1}</CardTitle>
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => removeQuestion(question.id || question.order.toString())}>
                        <Trash2 className="h-4 w-4 ml-2" /> حذف سوال
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4 bg-white">
                      <Textarea
                        placeholder="متن سوال"
                        value={question.text}
                        onChange={(e) => handleQuestionChange(question.id || question.order.toString(), 'text', e.target.value)}
                      />
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">گزینه‌ها</h4>
                        {question.options?.filter(o => !o.isDeleted).map((option, oIndex) => (
                          <div key={option.id || `new-o-${option.order}`} className="flex items-center space-x-2">
                            <Input
                              placeholder={`گزینه ${oIndex + 1}`}
                              value={option.text}
                              onChange={(e) => handleOptionChange(question.id || question.order.toString(), option.id || option.order.toString(), 'text', e.target.value)}
                              className="flex-grow"
                            />
                            <Input
                              type="number"
                              placeholder="امتیاز"
                              value={option.score}
                              onChange={(e) => handleOptionChange(question.id || question.order.toString(), option.id || option.order.toString(), 'score', parseInt(e.target.value) || 0)}
                              className="w-20"
                            />
                            <input
                              type="checkbox"
                              checked={option.isCorrect}
                              onChange={(e) => handleOptionChange(question.id || question.order.toString(), option.id || option.order.toString(), 'isCorrect', e.target.checked)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label className="text-sm">صحیح</label>
                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => removeOption(question.id || question.order.toString(), option.id || option.order.toString())}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={() => addOption(question.id || question.order.toString())}>
                          <Plus className="h-4 w-4 ml-2" /> افزودن گزینه
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="outline" className="w-full" onClick={addQuestion}>
                  <Plus className="h-4 w-4 ml-2" /> افزودن سوال جدید
                </Button>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={onClose}>
                  انصراف
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 ml-2" /> ذخیره تغییرات
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}