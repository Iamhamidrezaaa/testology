'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { Question, QuestionType } from '@/types/test'

interface QuestionManagementPanelProps {
  testId: string
  initialQuestions: Question[]
}

export function QuestionManagementPanel({ testId, initialQuestions }: QuestionManagementPanelProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [loading, setLoading] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAddQuestion = () => {
    setEditingQuestion({
      id: '',
      text: '',
      type: 'SINGLE_CHOICE' as QuestionType,
      options: [],
      order: questions.length + 1,
      testId,
      required: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('آیا از حذف این سوال اطمینان دارید؟')) return

    try {
      setLoading(true)
      const response = await fetch(`/api/admin/tests/${testId}/questions/${questionId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('خطا در حذف سوال')

      setQuestions(questions.filter(q => q.id !== questionId))
    } catch (error) {
      setError('خطا در حذف سوال')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingQuestion) return

    try {
      setLoading(true)
      const isNew = !editingQuestion.id
      const url = isNew
        ? `/api/admin/tests/${testId}/questions`
        : `/api/admin/tests/${testId}/questions/${editingQuestion.id}`
      
      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingQuestion)
      })

      if (!response.ok) throw new Error('خطا در ذخیره سوال')

      const savedQuestion = await response.json()
      
      if (isNew) {
        setQuestions([...questions, savedQuestion])
      } else {
        setQuestions(questions.map(q => q.id === savedQuestion.id ? savedQuestion : q))
      }

      setEditingQuestion(null)
    } catch (error) {
      setError('خطا در ذخیره سوال')
    } finally {
      setLoading(false)
    }
  }

  const handleMoveQuestion = async (questionId: string, direction: 'up' | 'down') => {
    const questionIndex = questions.findIndex(q => q.id === questionId)
    if (
      (direction === 'up' && questionIndex === 0) ||
      (direction === 'down' && questionIndex === questions.length - 1)
    ) return

    const newIndex = direction === 'up' ? questionIndex - 1 : questionIndex + 1
    const updatedQuestions = [...questions]
    const [movedQuestion] = updatedQuestions.splice(questionIndex, 1)
    updatedQuestions.splice(newIndex, 0, movedQuestion)

    // به‌روزرسانی ترتیب سوالات
    const reorderedQuestions = updatedQuestions.map((q, index) => ({
      ...q,
      order: index + 1
    }))

    try {
      setLoading(true)
      await Promise.all(
        reorderedQuestions.map(q =>
          fetch(`/api/admin/tests/${testId}/questions/${q.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(q)
          })
        )
      )

      setQuestions(reorderedQuestions)
    } catch (error) {
      setError('خطا در تغییر ترتیب سوالات')
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
        <h2 className="text-2xl font-bold">مدیریت سوالات</h2>
        <Button onClick={handleAddQuestion} disabled={loading}>
          <Plus className="w-4 h-4 mr-2" />
          افزودن سوال
        </Button>
      </div>

      {editingQuestion && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingQuestion.id ? 'ویرایش سوال' : 'افزودن سوال جدید'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">متن سوال</label>
                <Textarea
                  value={editingQuestion.text}
                  onChange={e => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">نوع سوال</label>
                <Select
                  value={editingQuestion.type}
                  onValueChange={value => setEditingQuestion({ ...editingQuestion, type: value as QuestionType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SINGLE_CHOICE">تک گزینه‌ای</SelectItem>
                    <SelectItem value="MULTIPLE_CHOICE">چند گزینه‌ای</SelectItem>
                    <SelectItem value="TEXT">متنی</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(editingQuestion.type === 'SINGLE_CHOICE' || editingQuestion.type === 'MULTIPLE_CHOICE') && (
                <div>
                  <label className="block text-sm font-medium mb-1">گزینه‌ها</label>
                  {editingQuestion.options.map((option: string, i: number) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <Input
                        value={option}
                        onChange={e => {
                          const newOptions = [...editingQuestion.options]
                          newOptions[i] = e.target.value
                          setEditingQuestion({ ...editingQuestion, options: newOptions })
                        }}
                        placeholder={`گزینه ${i + 1}`}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          const newOptions = editingQuestion.options.filter((_: string, index: number) => index !== i)
                          setEditingQuestion({ ...editingQuestion, options: newOptions })
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingQuestion({
                        ...editingQuestion,
                        options: [...editingQuestion.options, '']
                      })
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    افزودن گزینه
                  </Button>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingQuestion(null)}
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
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium">{question.text}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    نوع: {question.type === 'SINGLE_CHOICE' ? 'تک گزینه‌ای' : 
                          question.type === 'MULTIPLE_CHOICE' ? 'چند گزینه‌ای' : 'متنی'}
                  </p>
                  {question.options.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">گزینه‌ها:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {question.options.map((option: string, i: number) => (
                          <li key={i}>{option}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleMoveQuestion(question.id, 'up')}
                    disabled={index === 0 || loading}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleMoveQuestion(question.id, 'down')}
                    disabled={index === questions.length - 1 || loading}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditQuestion(question)}
                    disabled={loading}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteQuestion(question.id)}
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