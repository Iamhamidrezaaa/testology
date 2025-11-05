'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDistanceToNow } from 'date-fns'
import { faIR } from 'date-fns/locale'
import MessageReplyModal from './MessageReplyModal'

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

type MessageType = 'all' | 'CONTACT' | 'COMMENT' | 'FEEDBACK'
type MessageStatus = 'all' | 'UNREAD' | 'READ' | 'ARCHIVED'
type MessagePriority = 'all' | 'LOW' | 'NORMAL' | 'HIGH'

export default function MessageList({ messages, onReply }: { messages: Message[], onReply: (msg: Message) => void }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<MessageType>('all')
  const [statusFilter, setStatusFilter] = useState<MessageStatus>('all')
  const [priorityFilter, setPriorityFilter] = useState<MessagePriority>('all')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase()) ||
      msg.subject.toLowerCase().includes(search.toLowerCase()) ||
      msg.body.toLowerCase().includes(search.toLowerCase())
    
    const matchesType = typeFilter === 'all' || msg.type === typeFilter
    const matchesStatus = statusFilter === 'all' || msg.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || msg.priority === priorityFilter

    return matchesSearch && matchesType && matchesStatus && matchesPriority
  })

  const getStatusBadge = (status: Message['status']) => {
    const variants: Record<Message['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
      UNREAD: 'default',
      READ: 'secondary',
      ARCHIVED: 'outline'
    }

    const labels: Record<Message['status'], string> = {
      UNREAD: 'خوانده نشده',
      READ: 'خوانده شده',
      ARCHIVED: 'آرشیو شده'
    }

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: Message['priority']) => {
    const variants: Record<Message['priority'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
      LOW: 'outline',
      NORMAL: 'default',
      HIGH: 'destructive'
    }

    const labels: Record<Message['priority'], string> = {
      LOW: 'کم',
      NORMAL: 'متوسط',
      HIGH: 'زیاد'
    }

    return (
      <Badge variant={variants[priority]}>
        {labels[priority]}
      </Badge>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          placeholder="جستجو در نام، ایمیل، موضوع یا متن پیام..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={typeFilter} onValueChange={(value: MessageType) => setTypeFilter(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="نوع پیام" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه انواع</SelectItem>
            <SelectItem value="CONTACT">تماس با ما</SelectItem>
            <SelectItem value="COMMENT">نظرات</SelectItem>
            <SelectItem value="FEEDBACK">بازخورد</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(value: MessageStatus) => setStatusFilter(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="وضعیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه وضعیت‌ها</SelectItem>
            <SelectItem value="UNREAD">خوانده نشده</SelectItem>
            <SelectItem value="READ">خوانده شده</SelectItem>
            <SelectItem value="ARCHIVED">آرشیو شده</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(value: MessagePriority) => setPriorityFilter(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="اولویت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه اولویت‌ها</SelectItem>
            <SelectItem value="LOW">کم</SelectItem>
            <SelectItem value="NORMAL">متوسط</SelectItem>
            <SelectItem value="HIGH">زیاد</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredMessages.map((msg) => (
          <div key={msg.id} className="p-4 border rounded-lg bg-card hover:bg-muted/50">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{msg.subject}</h3>
                  {getStatusBadge(msg.status)}
                  {getPriorityBadge(msg.priority)}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>فرستنده: {msg.name} ({msg.email})</p>
                  {msg.phone && <p>تلفن: {msg.phone}</p>}
                </div>
                <p className="mt-2">{msg.body}</p>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(msg.createdAt), {
                    addSuffix: true,
                    locale: faIR
                  })}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMessage(msg)}
                >
                  پاسخ
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReply(msg)}
                >
                  مشاهده
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMessage && (
        <MessageReplyModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </Card>
  )
} 