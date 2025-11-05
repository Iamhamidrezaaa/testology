'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MailOpen, Archive, Loader2, Search, Flag, Mail } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  id: string
  subject: string
  body: string
  email: string
  name?: string
  phone?: string
  type: string
  status: string
  priority: string
  archived: boolean
  createdAt: string
}

export default function MessageModule() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    priority: '',
    search: ''
  })

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.type) params.append('type', filters.type)
      if (filters.priority) params.append('priority', filters.priority)
      if (filters.search) params.append('search', filters.search)

      const res = await fetch(`/api/admin/messages?${params.toString()}`)
      if (!res.ok) throw new Error('خطا در دریافت پیام‌ها')
      
      const data = await res.json()
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('خطا در دریافت پیام‌ها')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [filters])

  const archiveMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages/archive/${id}`, { method: 'POST' })
      if (!res.ok) throw new Error('خطا در آرشیو کردن پیام')
      
      toast.success('پیام با موفقیت آرشیو شد')
      fetchMessages()
    } catch (error) {
      console.error('Error archiving message:', error)
      toast.error('خطا در آرشیو کردن پیام')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800'
      case 'NORMAL': return 'bg-blue-100 text-blue-800'
      case 'LOW': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UNREAD': return 'bg-yellow-100 text-yellow-800'
      case 'READ': return 'bg-green-100 text-green-800'
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>مدیریت پیام‌ها</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* فیلترها */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="جستجو..."
                value={filters.search}
                onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-9"
              />
            </div>
            <Select
              value={filters.status}
              onValueChange={value => setFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">همه</SelectItem>
                <SelectItem value="UNREAD">خوانده نشده</SelectItem>
                <SelectItem value="READ">خوانده شده</SelectItem>
                <SelectItem value="ARCHIVED">آرشیو شده</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.type}
              onValueChange={value => setFilters(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="نوع پیام" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">همه</SelectItem>
                <SelectItem value="CONTACT">تماس</SelectItem>
                <SelectItem value="COMMENT">نظر</SelectItem>
                <SelectItem value="FEEDBACK">بازخورد</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.priority}
              onValueChange={value => setFilters(prev => ({ ...prev, priority: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="اولویت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">همه</SelectItem>
                <SelectItem value="HIGH">بالا</SelectItem>
                <SelectItem value="NORMAL">متوسط</SelectItem>
                <SelectItem value="LOW">پایین</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* لیست پیام‌ها */}
          <div className="space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{msg.subject}</h3>
                      <Badge variant="outline" className={getPriorityColor(msg.priority)}>
                        {msg.priority === 'HIGH' && <Flag className="w-3 h-3 mr-1" />}
                        {msg.priority}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(msg.status)}>
                        {msg.status === 'UNREAD' && <Mail className="w-3 h-3 mr-1" />}
                        {msg.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {msg.name && <span>{msg.name} - </span>}
                      {msg.email}
                      {msg.phone && <span> - {msg.phone}</span>}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(msg.createdAt).toLocaleString('fa-IR')}
                  </div>
                </div>
                <p className="text-gray-700 mt-2 line-clamp-2">{msg.body}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline">
                    <MailOpen className="w-4 h-4 ml-1" />
                    مشاهده کامل
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => archiveMessage(msg.id)}
                    disabled={msg.archived}
                  >
                    <Archive className="w-4 h-4 ml-1" />
                    آرشیو
                  </Button>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                پیامی یافت نشد
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 