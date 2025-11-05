'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bell, Send, Users, User } from 'lucide-react'

export default function SendNotificationForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [type, setType] = useState('info')
  const [target, setTarget] = useState('all')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          body, 
          type,
          userId: target === 'specific' ? userId : undefined
        })
      })

      if (response.ok) {
        alert('نوتیفیکیشن ارسال شد')
        setTitle('')
        setBody('')
        setUserId('')
      } else {
        alert('خطا در ارسال نوتیفیکیشن')
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      alert('خطا در ارسال نوتیفیکیشن')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>ارسال نوتیفیکیشن</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">عنوان نوتیفیکیشن</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان نوتیفیکیشن"
              required
            />
          </div>

          <div>
            <Label htmlFor="body">متن پیام</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="متن کامل نوتیفیکیشن"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">نوع نوتیفیکیشن</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">اطلاع‌رسانی</SelectItem>
                  <SelectItem value="warning">هشدار</SelectItem>
                  <SelectItem value="report">گزارش</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="target">مخاطب</Label>
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه کاربران</SelectItem>
                  <SelectItem value="specific">کاربر خاص</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {target === 'specific' && (
            <div>
              <Label htmlFor="userId">شناسه کاربر</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="شناسه کاربر"
                required
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={loading} className="flex items-center space-x-2">
              {target === 'all' ? <Users className="h-4 w-4" /> : <User className="h-4 w-4" />}
              <Send className="h-4 w-4" />
              <span>{loading ? 'در حال ارسال...' : 'ارسال نوتیفیکیشن'}</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

















