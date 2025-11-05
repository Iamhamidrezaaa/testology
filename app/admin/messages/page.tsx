'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageSquare, Reply, Trash2, Eye, Clock, Mail } from 'lucide-react'

interface Message {
  id: string
  senderName: string
  senderEmail: string
  content: string
  type: 'complaint' | 'feedback' | 'question' | 'support'
  status: 'unread' | 'read' | 'replied' | 'closed'
  createdAt: string
  reply?: string
  repliedAt?: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const sampleMessages: Message[] = [
        {
          id: '1',
          senderName: 'احمد محمدی',
          senderEmail: 'ahmad@example.com',
          content: 'سلام، من در انجام تست اضطراب مشکل دارم. لطفاً راهنمایی کنید.',
          type: 'question',
          status: 'unread',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          senderName: 'فاطمه احمدی',
          senderEmail: 'fatemeh@example.com',
          content: 'تست عزت نفس نتایج خوبی نداشت. آیا راهکاری پیشنهاد می‌کنید؟',
          type: 'support',
          status: 'read',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          senderName: 'علی رضایی',
          senderEmail: 'ali@example.com',
          content: 'سیستم خیلی عالی است. ممنون از خدمات شما.',
          type: 'feedback',
          status: 'replied',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          reply: 'سپاس از بازخورد مثبت شما',
          repliedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]
      
      setMessages(sampleMessages)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching messages:', error)
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'complaint': return 'bg-red-100 text-red-800'
      case 'feedback': return 'bg-green-100 text-green-800'
      case 'question': return 'bg-blue-100 text-blue-800'
      case 'support': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'complaint': return 'شکایت'
      case 'feedback': return 'بازخورد'
      case 'question': return 'سؤال'
      case 'support': return 'پشتیبانی'
      default: return 'نامشخص'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800'
      case 'read': return 'bg-blue-100 text-blue-800'
      case 'replied': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'unread': return 'خوانده نشده'
      case 'read': return 'خوانده شده'
      case 'replied': return 'پاسخ داده شده'
      case 'closed': return 'بسته شده'
      default: return 'نامشخص'
    }
  }

  const handleReply = async (messageId: string) => {
    if (!replyText.trim()) return

    try {
      console.log('Sending reply:', { messageId, reply: replyText })
      
      setMessages(messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'replied' as const, reply: replyText, repliedAt: new Date().toISOString() }
          : msg
      ))
      
      setReplyText('')
      setSelectedMessage(null)
    } catch (error) {
      console.error('Error sending reply:', error)
    }
  }

  const handleMarkAsRead = async (messageId: string) => {
    try {
      setMessages(messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'read' as const }
          : msg
      ))
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">مدیریت پیام‌ها</h1>
        <p className="text-gray-600">دریافت و پاسخ به پیام‌های کاربران</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">📬 کل پیام‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">🔔 خوانده نشده</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {messages.filter(m => m.status === 'unread').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">✅ پاسخ داده شده</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {messages.filter(m => m.status === 'replied').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">❓ سؤالات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {messages.filter(m => m.type === 'question').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">هنوز هیچ پیامی دریافت نشده است</p>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <Card key={message.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900">{message.senderName}</h3>
                      <Badge className={getTypeColor(message.type)}>
                        {getTypeLabel(message.type)}
                      </Badge>
                      <Badge className={getStatusColor(message.status)}>
                        {getStatusLabel(message.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{message.senderEmail}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(message.createdAt).toLocaleDateString('fa-IR')}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{message.content}</p>
                    
                    {message.reply && (
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Reply className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-800">پاسخ شما:</span>
                        </div>
                        <p className="text-blue-700">{message.reply}</p>
                        {message.repliedAt && (
                          <p className="text-xs text-blue-600 mt-2">
                            پاسخ داده شده در: {new Date(message.repliedAt).toLocaleDateString('fa-IR')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {message.status === 'unread' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsRead(message.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      علامت‌گذاری به عنوان خوانده شده
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMessage(message)}
                  >
                    <Reply className="h-4 w-4 mr-1" />
                    پاسخ
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {selectedMessage && (
        <Card>
          <CardHeader>
            <CardTitle>پاسخ به {selectedMessage.senderName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">متن پاسخ</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="پاسخ خود را بنویسید..."
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedMessage(null)
                    setReplyText('')
                  }}
                >
                  انصراف
                </Button>
                <Button
                  onClick={() => handleReply(selectedMessage.id)}
                  disabled={!replyText.trim()}
                >
                  ارسال پاسخ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


