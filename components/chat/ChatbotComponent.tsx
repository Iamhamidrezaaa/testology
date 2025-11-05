import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SendHorizonal } from 'lucide-react'
import axios from 'axios'

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

export default function ChatbotComponent({ sessionId }: { sessionId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (sessionId) {
      axios.get<{ session: ChatSession }>(`/api/chat?sessionId=${sessionId}`)
        .then((res) => {
          setMessages(res.data.session.messages)
        })
        .catch((err) => {
          console.error('Error fetching messages:', err)
        })
    }
  }, [sessionId])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage: Message = { 
      id: 'temp-' + Date.now(),
      role: 'user', 
      content: input,
      createdAt: new Date().toISOString()
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post<{ message: Message, session: ChatSession }>('/api/chat', {
        content: input,
        role: 'user',
        sessionId,
      })
      setMessages(res.data.session.messages)
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded-xl shadow-md p-4 max-w-xl mx-auto flex flex-col h-[500px]">
      <ScrollArea className="flex-1 overflow-y-auto space-y-2 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-xl max-w-[80%] whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-blue-100 self-end text-right mr-0 ml-auto'
                : 'bg-gray-100 self-start text-left ml-0 mr-auto'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </ScrollArea>
      <div className="mt-4 flex gap-2 items-center">
        <Input
          placeholder="پیامت را بنویس..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          disabled={loading}
        />
        <Button onClick={sendMessage} disabled={loading}>
          <SendHorizonal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 