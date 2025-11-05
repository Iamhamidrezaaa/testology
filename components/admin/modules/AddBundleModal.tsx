'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "react-hot-toast"

interface AddBundleModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddBundleModal({ open, onClose, onSuccess }: AddBundleModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('لطفاً نام باندل را وارد کنید')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/test-bundles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
        }),
      })

      if (!response.ok) throw new Error('خطا در ایجاد باندل')

      toast.success('باندل با موفقیت ایجاد شد')
      onSuccess()
      onClose()
      setName('')
      setDescription('')
    } catch (error) {
      console.error('Error creating bundle:', error)
      toast.error('خطا در ایجاد باندل')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ایجاد باندل جدید</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">نام باندل</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="نام باندل را وارد کنید"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">توضیحات</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات باندل را وارد کنید"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              انصراف
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'در حال ایجاد...' : 'ایجاد باندل'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 