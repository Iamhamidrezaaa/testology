'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Pencil, Save, X, GripVertical } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import OptionsModal from './OptionsModal'
import { Question, Option } from '@/types'

type QuestionsModalProps = {
  testId: string
  onClose: () => void
}

export default function QuestionsModal({ testId, onClose }: QuestionsModalProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)

  useEffect(() => {
    fetchQuestions()
  }, [testId])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/admin/tests/${testId}/questions`)
      if (!res.ok) throw new Error('خطا در دریافت سوالات')
      const data = await res.json()
      setQuestions(data)
    } catch (err) {
      console.error('Error fetching questions:', err)
      setError('خطا در دریافت سوالات')
    } finally {
      setLoading(false)
    }
  }

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) return

    try {
      const res = await fetch(`/api/admin/tests/${testId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newQuestion })
      })

      if (!res.ok) throw new Error('خطا در افزودن سوال')
      const question = await res.json()
      setQuestions([...questions, question])
      setNewQuestion('')
    } catch (err) {
      console.error('Error adding question:', err)
      setError('خطا در افزودن سوال')
    }
  }

  const handleUpdateQuestion = async (id: string, text: string) => {
    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (!res.ok) throw new Error('خطا در ویرایش سوال')
      const updatedQuestion = await res.json()
      setQuestions(questions.map(q => q.id === id ? updatedQuestion : q))
      setEditingQuestion(null)
    } catch (err) {
      console.error('Error updating question:', err)
      setError('خطا در ویرایش سوال')
    }
  }

  const handleDeleteQuestion = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('خطا در حذف سوال')
      setQuestions(questions.filter(q => q.id !== id))
    } catch (err) {
      console.error('Error deleting question:', err)
      setError('خطا در حذف سوال')
    }
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setQuestions(items)

    try {
      const res = await fetch(`/api/admin/questions/${reorderedItem.id}/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: result.destination.index })
      })

      if (!res.ok) throw new Error('خطا در تغییر ترتیب سوالات')
    } catch (err) {
      console.error('Error reordering questions:', err)
      setError('خطا در تغییر ترتیب سوالات')
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <p>در حال بارگذاری...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <Dialog open={!!testId} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>مدیریت سوالات</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="سوال جدید..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
            />
            <Button onClick={handleAddQuestion}>
              <Plus className="h-4 w-4 ml-2" />
              افزودن
            </Button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {questions.map((question, index) => (
                    <Draggable
                      key={question.id}
                      draggableId={question.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center gap-2 p-2 border rounded-lg"
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab"
                          >
                            <GripVertical className="h-5 w-5 text-gray-500" />
                          </div>

                          {editingQuestion?.id === question.id ? (
                            <div className="flex-1 flex gap-2">
                              <Input
                                value={editingQuestion.text}
                                onChange={(e) =>
                                  setEditingQuestion({
                                    ...editingQuestion,
                                    text: e.target.value
                                  })
                                }
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  handleUpdateQuestion(
                                    question.id,
                                    editingQuestion.text
                                  )
                                }
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setEditingQuestion(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="flex-1">{question.text}</div>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setEditingQuestion(question)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setSelectedQuestion(question)}
                              >
                                گزینه‌ها
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDeleteQuestion(question.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </DialogContent>

      {selectedQuestion && (
        <OptionsModal
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
        />
      )}
    </Dialog>
  )
} 