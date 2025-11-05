'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageBubble } from '@/components/admin/modules/MessageBubble'
import { Send } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Message {
  from: 'user' | 'bot'
  text: string
}

export default function ChatbotPreviewPage() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      from: 'bot', 
      text: 'سلام، من روان‌شناس شما هستم. چطور می‌تونم کمکتون کنم؟' 
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")
    setLoading(true)

    try {
      const newMessages: Message[] = [...messages, { from: 'user', text: userMessage }]
      setMessages(newMessages)

      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })

      if (!res.ok) throw new Error('خطا در دریافت پاسخ')

      const data = await res.json()
      setMessages([...newMessages, { from: 'bot', text: data.reply }])
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('خطا در ارسال پیام')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">چت‌بات روان‌درمانگر</h1>
        <div className="text-sm text-muted-foreground">
          نسخه پیش‌نمایش - فقط برای ادمین‌ها
        </div>
      </div>

      <div className="border rounded-lg p-4 h-[600px] overflow-y-auto bg-background space-y-3 shadow-sm">
        {messages.map((msg, i) => (
          <MessageBubble key={i} from={msg.from} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="پیام خود را بنویسید..."
          disabled={loading}
          className="flex-1"
        />
        <Button 
          onClick={sendMessage} 
          disabled={loading || !input.trim()}
          size="icon"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
} 