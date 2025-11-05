import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { faIR } from 'date-fns/locale'
import { Send, Trash2, Check } from 'lucide-react'

interface Message {
  id: string
  content: string
  createdAt: string
  read: boolean
  sender: {
    name: string | null
    image: string | null
  }
  receiver: {
    name: string | null
    image: string | null
  }
}

interface PaginationInfo {
  total: number
  pages: number
  currentPage: number
  limit: number
}

export default function PrivateMessages() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [recipient, setRecipient] = useState('')
  const [messageContent, setMessageContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('received')
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: 20
  })
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchMessages = async (page = 1) => {
    try {
      const res = await axios.get('/api/messages/inbox', {
        params: {
          type: activeTab,
          page,
          limit: pagination.limit
        }
      })
      setMessages((res.data as any).messages)
      setPagination((res.data as any).pagination)
      setUnreadCount((res.data as any).unreadCount)
    } catch (error) {
      console.error('خطا در دریافت پیام‌ها:', error)
      toast.error('خطا در دریافت پیام‌ها')
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchMessages()
    }
  }, [session, activeTab])

  const handleSendMessage = async () => {
    if (!recipient.trim() || !messageContent.trim()) {
      toast.error('لطفا گیرنده و متن پیام را وارد کنید')
      return
    }

    setIsLoading(true)
    try {
      await axios.post('/api/messages/send', {
        receiverId: recipient,
        content: messageContent,
      })
      setMessageContent('')
      setRecipient('')
      toast.success('پیام با موفقیت ارسال شد')
      fetchMessages()
    } catch (error: any) {
      console.error('خطا در ارسال پیام:', error)
      toast.error(error.response?.data?.error || 'خطا در ارسال پیام')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await axios.put(`/api/messages/${messageId}/read`)
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('خطا در به‌روزرسانی وضعیت پیام:', error)
      toast.error('خطا در به‌روزرسانی وضعیت پیام')
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('آیا از حذف این پیام اطمینان دارید؟')) return

    try {
      await axios.delete(`/api/messages/${messageId}`)
      setMessages(messages.filter(msg => msg.id !== messageId))
      toast.success('پیام با موفقیت حذف شد')
    } catch (error) {
      console.error('خطا در حذف پیام:', error)
      toast.error('خطا در حذف پیام')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">پیام‌های خصوصی</h2>
        {unreadCount > 0 && (
          <Badge variant="secondary" className="text-sm">
            {unreadCount} پیام نخوانده
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received">پیام‌های دریافتی</TabsTrigger>
          <TabsTrigger value="sent">پیام‌های ارسالی</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          <ScrollArea className="h-[500px] rounded-md border p-4">
            {messages.map((msg) => (
              <Card key={msg.id} className={`mb-4 ${!msg.read ? 'border-blue-200 bg-blue-50' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {msg.sender.image ? (
                        <img
                          src={msg.sender.image}
                          alt={msg.sender.name || 'کاربر'}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          👤
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-sm font-medium">
                          {msg.sender.name || 'کاربر تستولوژی'}
                        </CardTitle>
                        <p className="text-xs text-gray-500">
                          {format(new Date(msg.createdAt), 'PPp', { locale: faIR })}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!msg.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(msg.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMessage(msg.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{msg.content}</p>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          <ScrollArea className="h-[500px] rounded-md border p-4">
            {messages.map((msg) => (
              <Card key={msg.id} className="mb-4">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {msg.receiver.image ? (
                        <img
                          src={msg.receiver.image}
                          alt={msg.receiver.name || 'کاربر'}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          👤
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-sm font-medium">
                          به: {msg.receiver.name || 'کاربر تستولوژی'}
                        </CardTitle>
                        <p className="text-xs text-gray-500">
                          {format(new Date(msg.createdAt), 'PPp', { locale: faIR })}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMessage(msg.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{msg.content}</p>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>ارسال پیام جدید</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="شناسه کاربری گیرنده"
            disabled={isLoading}
          />
          <Textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="متن پیام..."
            disabled={isLoading}
            className="min-h-[100px]"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              'در حال ارسال...'
            ) : (
              <>
                <Send className="w-4 h-4 ml-2" />
                ارسال پیام
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 