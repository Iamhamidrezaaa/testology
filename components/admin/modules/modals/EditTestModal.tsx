'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { MultiSelect } from '@/components/ui/multi-select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

type Test = {
  id: string
  title: string
  description: string
  tags: string[]
  priorityScore: number
  isActive: boolean
  targetAgeMin?: number | null
  targetAgeMax?: number | null
  targetGender?: string | null
  useCases: string[]
}

const TAG_OPTIONS = [
  { value: 'anxiety', label: 'اضطراب' },
  { value: 'depression', label: 'افسردگی' },
  { value: 'stress', label: 'استرس' },
  { value: 'personality', label: 'شخصیت' },
  { value: 'relationship', label: 'روابط' },
  { value: 'career', label: 'شغلی' },
  { value: 'education', label: 'تحصیلی' },
  { value: 'health', label: 'سلامت' },
]

const GENDER_OPTIONS = [
  { value: 'male', label: 'مرد' },
  { value: 'female', label: 'زن' },
  { value: 'any', label: 'هر دو' },
]

export default function EditTestModal({
  open,
  onClose,
  test,
  onSave
}: {
  open: boolean,
  onClose: () => void,
  test: Test,
  onSave: () => void
}) {
  const [formData, setFormData] = useState<Partial<Test>>({
    title: '',
    description: '',
    tags: [],
    priorityScore: 0,
    isActive: true,
    targetAgeMin: null,
    targetAgeMax: null,
    targetGender: null,
    useCases: []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (test) {
      setFormData({
        title: test.title,
        description: test.description,
        tags: test.tags,
        priorityScore: test.priorityScore,
        isActive: test.isActive,
        targetAgeMin: test.targetAgeMin,
        targetAgeMax: test.targetAgeMax,
        targetGender: test.targetGender,
        useCases: test.useCases
      })
    }
  }, [test])

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const res = await fetch(`/api/admin/tests/${test.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('خطا در ویرایش تست')
      }

      onSave()
      onClose()
    } catch (err) {
      console.error('Error updating test:', err)
      setError('خطا در ویرایش تست')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>ویرایش تست</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">عنوان تست</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">توضیحات</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>دسته‌بندی‌ها</Label>
            <MultiSelect
              options={TAG_OPTIONS}
              selectedValues={formData.tags?.map(tag => ({ value: tag, label: tag })) || []}
              onChange={(selected) => setFormData(prev => ({ 
                ...prev, 
                tags: selected.map(item => item.value)
              }))}
              placeholder="انتخاب دسته‌بندی‌ها"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priorityScore">امتیاز اولویت (1-10)</Label>
              <Input
                id="priorityScore"
                type="number"
                min={1}
                max={10}
                value={formData.priorityScore}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  priorityScore: parseInt(e.target.value) || 0
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label>جنسیت هدف</Label>
              <MultiSelect
                options={GENDER_OPTIONS}
                selectedValues={formData.targetGender ? [{ 
                  value: formData.targetGender, 
                  label: GENDER_OPTIONS.find(opt => opt.value === formData.targetGender)?.label || ''
                }] : []}
                onChange={(selected) => setFormData(prev => ({ 
                  ...prev, 
                  targetGender: selected[0]?.value || null
                }))}
                placeholder="انتخاب جنسیت"
                isSingle
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetAgeMin">حداقل سن</Label>
              <Input
                id="targetAgeMin"
                type="number"
                min={0}
                max={100}
                value={formData.targetAgeMin || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  targetAgeMin: parseInt(e.target.value) || null
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAgeMax">حداکثر سن</Label>
              <Input
                id="targetAgeMax"
                type="number"
                min={0}
                max={100}
                value={formData.targetAgeMax || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  targetAgeMax: parseInt(e.target.value) || null
                }))}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">فعال باشد</Label>
          </div>

          <Button 
            className="w-full mt-4" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 