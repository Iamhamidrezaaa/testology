'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import DataTable from '@/components/admin/modules/DataTable'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface Question {
  id?: string
  text: string
  type: 'single' | 'multiple' | 'text'
  options?: {
    id: string
    text: string
    isCorrect?: boolean
  }[]
  order: number
  required: boolean
}

interface Test {
  id: string
  title: string
  description: string
}

export default function TestQuestionsPage() {
  const params = useParams<{ id: string }>()
  const [test, setTest] = useState<Test | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newOption, setNewOption] = useState('')

  const fetchTest = async () => {
    if (!params?.id) return

    try {
      const response = await fetch(`/api/admin/tests/${params.id}`)
      if (!response.ok) throw new Error('خطا در دریافت اطلاعات تست')
      
      const data = await response.json()
      setTest(data.test)
    } catch (error) {
      console.error('Error fetching test:', error)
      toast.error('خطا در دریافت اطلاعات تست')
    }
  }

  const fetchQuestions = async () => {
    if (!params?.id) return

    try {
      setLoading(true)
      const response = await fetch(`/api/admin/tests/${params.id}/questions`)
      if (!response.ok) throw new Error('خطا در دریافت سوالات')
      
      const data = await response.json()
      setQuestions(data.questions)
    } catch (error) {
      console.error('Error fetching questions:', error)
      toast.error('خطا در دریافت سوالات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTest()
    fetchQuestions()
  }, [params?.id])

  const handleEdit = async () => {
    if (!selectedQuestion || !params?.id) return

    try {
      const response = await fetch(`/api/admin/tests/${params.id}/questions/${selectedQuestion.id || ''}`, {
        method: selectedQuestion.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedQuestion)
      })

      if (!response.ok) throw new Error('خطا در ذخیره سوال')
      
      toast.success('سوال با موفقیت ذخیره شد')
      setShowEditDialog(false)
      fetchQuestions()
    } catch (error) {
      console.error('Error saving question:', error)
      toast.error('خطا در ذخیره سوال')
    }
  }

  const handleDelete = async (questionId: string) => {
    if (!params?.id) return

    try {
      const response = await fetch(`/api/admin/tests/${params.id}/questions/${questionId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('خطا در حذف سوال')
      
      toast.success('سوال با موفقیت حذف شد')
      fetchQuestions()
    } catch (error) {
      console.error('Error deleting question:', error)
      toast.error('خطا در حذف سوال')
    }
  }

  const handleAddOption = () => {
    if (!newOption.trim()) return

    setSelectedQuestion(prev => ({
      ...prev!,
      options: [
        ...(prev?.options || []),
        { id: crypto.randomUUID(), text: newOption }
      ]
    }))
    setNewOption('')
  }

  const handleRemoveOption = (optionId: string) => {
    setSelectedQuestion(prev => ({
      ...prev!,
      options: prev?.options?.filter(opt => opt.id !== optionId) || []
    }))
  }

  const handleToggleCorrect = (optionId: string) => {
    if (selectedQuestion?.type === 'single') {
      setSelectedQuestion(prev => ({
        ...prev!,
        options: prev?.options?.map(opt => ({
          ...opt,
          isCorrect: opt.id === optionId
        })) || []
      }))
    } else {
      setSelectedQuestion(prev => ({
        ...prev!,
        options: prev?.options?.map(opt => ({
          ...opt,
          isCorrect: opt.id === optionId ? !opt.isCorrect : opt.isCorrect
        })) || []
      }))
    }
  }

  const columns = [
    {
      key: 'text',
      label: 'سوال',
      render: (value: string, row: Question) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">
            {row.type === 'single' ? 'تک گزینه‌ای' : row.type === 'multiple' ? 'چند گزینه‌ای' : 'متنی'}
          </div>
        </div>
      )
    },
    {
      key: 'options',
      label: 'گزینه‌ها',
      render: (value: Question['options']) => (
        <div className="space-y-1">
          {value?.map(option => (
            <div key={option.id} className="flex items-center gap-2">
              <Badge variant={option.isCorrect ? 'default' : 'outline'}>
                {option.text}
              </Badge>
            </div>
          ))}
        </div>
      )
    },
    {
      key: 'required',
      label: 'اجباری',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'outline'}>
          {value ? 'بله' : 'خیر'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'عملیات',
      render: (_: any, row: Question) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedQuestion(row)
              setShowEditDialog(true)
            }}
          >
            ویرایش
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.id!)}
          >
            حذف
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">❓ مدیریت سوالات</h1>
          {test && (
            <p className="text-muted-foreground mt-1">
              {test.title}
            </p>
          )}
        </div>
        <Button onClick={() => {
          setSelectedQuestion({
            text: '',
            type: 'single',
            options: [],
            order: questions.length + 1,
            required: true
          })
          setShowEditDialog(true)
        }}>
          افزودن سوال جدید
        </Button>
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={questions}
          loading={loading}
        />
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedQuestion?.id ? 'ویرایش سوال' : 'افزودن سوال جدید'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>متن سوال</Label>
              <Textarea
                value={selectedQuestion?.text || ''}
                onChange={(e) => setSelectedQuestion(prev => ({ ...prev!, text: e.target.value }))}
                rows={3}
              />
            </div>
            <div>
              <Label>نوع سوال</Label>
              <Select
                value={selectedQuestion?.type || 'single'}
                onValueChange={(value) => setSelectedQuestion(prev => ({ ...prev!, type: value as Question['type'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب نوع سوال" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">تک گزینه‌ای</SelectItem>
                  <SelectItem value="multiple">چند گزینه‌ای</SelectItem>
                  <SelectItem value="text">متنی</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedQuestion?.type !== 'text' && (
              <div className="space-y-4">
                <div>
                  <Label>گزینه‌ها</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="افزودن گزینه جدید"
                    />
                    <Button onClick={handleAddOption}>
                      افزودن
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {selectedQuestion?.options?.map(option => (
                    <div key={option.id} className="flex items-center gap-2">
                      <Input
                        value={option.text}
                        onChange={(e) => setSelectedQuestion(prev => ({
                          ...prev!,
                          options: prev?.options?.map(opt =>
                            opt.id === option.id ? { ...opt, text: e.target.value } : opt
                          ) || []
                        }))}
                      />
                      <Button
                        variant={option.isCorrect ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleToggleCorrect(option.id)}
                      >
                        {option.isCorrect ? 'صحیح' : 'غلط'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveOption(option.id)}
                      >
                        حذف
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Label>سوال اجباری</Label>
              <Select
                value={selectedQuestion?.required ? 'true' : 'false'}
                onValueChange={(value) => setSelectedQuestion(prev => ({ ...prev!, required: value === 'true' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">بله</SelectItem>
                  <SelectItem value="false">خیر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              انصراف
            </Button>
            <Button onClick={handleEdit}>
              {selectedQuestion?.id ? 'ذخیره تغییرات' : 'افزودن سوال'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 