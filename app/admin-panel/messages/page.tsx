'use client'

import { useEffect, useState } from 'react'
import MessageList from '@/components/admin/Messages/MessageList'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

type Message = {
  id: string
  subject: string
  body: string
  email: string
  name: string
  phone: string
  type: 'CONTACT' | 'COMMENT' | 'FEEDBACK'
  status: 'UNREAD' | 'READ' | 'ARCHIVED'
  priority: 'LOW' | 'NORMAL' | 'HIGH'
  createdAt: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/messages')
      
      if (!response.ok) {
        throw new Error('خطا در دریافت پیام‌ها')
      }

      const data = await response.json()
      setMessages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleReply = async (message: Message) => {
    try {
      const response = await fetch(`/api/admin/messages/${message.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'READ'
        })
      })

      if (!response.ok) {
        throw new Error('خطا در به‌روزرسانی وضعیت پیام')
      }

      await fetchMessages()
      toast.success('وضعیت پیام با موفقیت به‌روز شد')
    } catch (err) {
      toast.error('خطا در به‌روزرسانی وضعیت پیام')
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطا</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTitle>پیامی موجود نیست</AlertTitle>
          <AlertDescription>
            هیچ پیامی در سیستم ثبت نشده است.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">پیام‌های کاربران</h1>
      <MessageList messages={messages} onReply={handleReply} />
    </div>
  )
} 