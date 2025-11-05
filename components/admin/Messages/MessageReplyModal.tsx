'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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

export default function MessageReplyModal({ message, onClose }: { message: Message, onClose: () => void }) {
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!reply.trim()) {
      toast.error('لطفا متن پاسخ را وارد کنید')
      return
    }

    try {
      setSending(true)
      const response = await fetch('/api/admin/messages/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messageId: message.id,
          reply: reply.trim()
        })
      })

      if (!response.ok) {
        throw new Error('خطا در ارسال پاسخ')
      }

      toast.success('پاسخ با موفقیت ارسال شد')
      onClose()
    } catch (error) {
      console.error('Error sending reply:', error)
      toast.error('خطا در ارسال پاسخ')
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>پاسخ به {message.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">پیام اصلی:</h4>
            <div className="p-3 bg-muted rounded-lg text-sm">
              {message.body}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">پاسخ شما:</h4>
            <Textarea
              placeholder="متن پاسخ خود را اینجا بنویسید..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={sending}
          >
            انصراف
          </Button>
          <Button
            onClick={handleSend}
            disabled={sending}
          >
            {sending ? 'در حال ارسال...' : 'ارسال پاسخ'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 