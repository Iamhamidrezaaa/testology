import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SendHorizonal } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

interface ChatSession {
  id: string
  messages: Message[]
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const handleSend = async () => {
    if (!input.trim()) return

    const newMessage = { 
      role: 'user' as const, 
      content: input 
    }

    setMessages(prev => [...prev, { 
      id: 'temp-' + Date.now(),
      ...newMessage,
      createdAt: new Date().toISOString()
    }])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, newMessage],
          sessionId 
        })
      })

      if (!res.ok) throw new Error('خطا در ارسال پیام')

      const data = await res.json()
      setSessionId(data.sessionId)
      setMessages(data.session.messages)
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div className="h-96 overflow-y-auto border rounded-lg p-3 bg-muted">
        <ScrollArea className="h-full">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
            >
              <span className="inline-block px-3 py-2 rounded bg-white text-sm shadow">
                {msg.content}
              </span>
            </div>
          ))}
          {isLoading && (
            <p className="text-xs text-gray-400 text-center">در حال پاسخ‌گویی...</p>
          )}
        </ScrollArea>
      </div>
      <div className="flex gap-2 mt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
          placeholder="پیامت را بنویس..."
        />
        <Button onClick={handleSend} disabled={isLoading}>
          <SendHorizonal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 