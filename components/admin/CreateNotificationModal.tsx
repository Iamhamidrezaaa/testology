'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Loader2, Bell, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  isRead: boolean
  targetUser: string | null
  createdAt: string
  user?: {
    id: string
    name: string
    email: string
  }
}

interface CreateNotificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  notification?: Notification
}

export default function CreateNotificationModal({
  open,
  onOpenChange,
  onSuccess,
  notification
}: CreateNotificationModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<{
    title: string
    message: string
    type: 'info' | 'warning' | 'success' | 'error'
    targetUser: string
  }>({
    title: '',
    message: '',
    type: 'info',
    targetUser: ''
  })

  useEffect(() => {
    if (notification) {
      setFormData({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        targetUser: notification.targetUser || ''
      })
    } else {
      setFormData({
        title: '',
        message: '',
        type: 'info',
        targetUser: ''
      })
    }
  }, [notification])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const url = notification
        ? `/api/admin/notifications/${notification.id}`
        : '/api/admin/notifications'
      
      const res = await fetch(url, {
        method: notification ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('خطا در ثبت اعلان')
      
      toast.success(notification ? 'اعلان با موفقیت ویرایش شد' : 'اعلان با موفقیت ثبت شد')
      onOpenChange(false)
      setFormData({ title: '', message: '', type: 'info', targetUser: '' })
      onSuccess?.()
    } catch (error) {
      toast.error(notification ? 'خطا در ویرایش اعلان' : 'خطا در ثبت اعلان')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Bell className="w-4 h-4 text-blue-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Bell className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTypeIcon(formData.type)}
            {notification ? 'ویرایش اعلان' : 'افزودن اعلان جدید'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان اعلان</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="عنوان اعلان را وارد کنید"
              maxLength={80}
            />
            <p className="text-xs text-muted-foreground text-left">
              {formData.title.length}/80 کاراکتر
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">پیام اعلان</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="پیام اعلان را وارد کنید"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">نوع اعلان</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as 'info' | 'warning' | 'success' | 'error' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="نوع اعلان را انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info" className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-500" />
                  اطلاع‌رسانی
                </SelectItem>
                <SelectItem value="warning" className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  هشدار
                </SelectItem>
                <SelectItem value="success" className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  موفقیت
                </SelectItem>
                <SelectItem value="error" className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  خطا
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetUser">کاربر هدف (اختیاری)</Label>
            <Input
              id="targetUser"
              value={formData.targetUser}
              onChange={(e) => setFormData({ ...formData, targetUser: e.target.value })}
              placeholder="آیدی یا ایمیل کاربر را وارد کنید"
            />
            <p className="text-xs text-muted-foreground">
              در صورت خالی بودن، اعلان برای همه کاربران ارسال می‌شود
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            انصراف
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !formData.title || !formData.message}
          >
            {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
            {notification ? 'ویرایش اعلان' : 'ثبت اعلان'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 