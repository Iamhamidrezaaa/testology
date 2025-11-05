'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
  isActive: boolean
  tests: TestBundleTest[]
}

interface EditBundleModalProps {
  open: boolean
  onClose: () => void
  bundle: TestBundle | null
  onSave: (bundle: TestBundle) => Promise<void>
}

export function EditBundleModal({ open, onClose, bundle, onSave }: EditBundleModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (bundle) {
      setName(bundle.name)
      setDescription(bundle.description)
      setIsActive(bundle.isActive)
    }
  }, [bundle])

  const handleSubmit = async () => {
    if (!bundle) return
    if (!name.trim()) {
      toast.error('لطفاً نام باندل را وارد کنید')
      return
    }

    setLoading(true)
    try {
      await onSave({
        ...bundle,
        name: name.trim(),
        description: description.trim(),
        isActive
      })
      onClose()
    } catch (error) {
      console.error('Error updating bundle:', error)
      toast.error('خطا در بروزرسانی باندل')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>ویرایش باندل تست</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">نام باندل</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="نام باندل را وارد کنید"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">توضیحات</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="توضیحات باندل را وارد کنید"
              rows={4}
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="isActive">فعال باشد</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              انصراف
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 