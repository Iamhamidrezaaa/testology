'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import { Question, Option } from '@/types'

type OptionsModalProps = {
  question: Question
  onClose: () => void
}

export default function OptionsModal({ question, onClose }: OptionsModalProps) {
  const [options, setOptions] = useState<Option[]>([])
  const [newOption, setNewOption] = useState('')
  const [editingOption, setEditingOption] = useState<Option | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOptions()
  }, [question.id])

  const fetchOptions = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/admin/questions/${question.id}/options`)
      if (!res.ok) throw new Error('خطا در دریافت گزینه‌ها')
      const data = await res.json()
      setOptions(data)
    } catch (err) {
      console.error('Error fetching options:', err)
      setError('خطا در دریافت گزینه‌ها')
    } finally {
      setLoading(false)
    }
  }

  const handleAddOption = async () => {
    if (!newOption.trim()) return

    try {
      const res = await fetch(`/api/admin/questions/${question.id}/options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newOption })
      })

      if (!res.ok) throw new Error('خطا در افزودن گزینه')
      const option = await res.json()
      setOptions([...options, option])
      setNewOption('')
    } catch (err) {
      console.error('Error adding option:', err)
      setError('خطا در افزودن گزینه')
    }
  }

  const handleUpdateOption = async (id: string, text: string) => {
    try {
      const res = await fetch(`/api/admin/options/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (!res.ok) throw new Error('خطا در ویرایش گزینه')
      const updatedOption = await res.json()
      setOptions(options.map(o => o.id === id ? updatedOption : o))
      setEditingOption(null)
    } catch (err) {
      console.error('Error updating option:', err)
      setError('خطا در ویرایش گزینه')
    }
  }

  const handleDeleteOption = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/options/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('خطا در حذف گزینه')
      setOptions(options.filter(o => o.id !== id))
    } catch (err) {
      console.error('Error deleting option:', err)
      setError('خطا در حذف گزینه')
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
    <Dialog open={!!question} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>مدیریت گزینه‌ها: {question.text}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="گزینه جدید..."
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
            />
            <Button onClick={handleAddOption}>
              <Plus className="h-4 w-4 ml-2" />
              افزودن
            </Button>
          </div>

          <div className="space-y-2">
            {options.map((option) => (
              <div
                key={option.id}
                className="flex items-center gap-2 p-2 border rounded-lg"
              >
                {editingOption?.id === option.id ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={editingOption.text}
                      onChange={(e) =>
                        setEditingOption({
                          ...editingOption,
                          text: e.target.value
                        })
                      }
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        handleUpdateOption(option.id, editingOption.text)
                      }
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingOption(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">{option.text}</div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingOption(option)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteOption(option.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 