"use client"

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MessageCircle } from 'lucide-react'
import { format } from 'date-fns'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

interface ChatBoxProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatBox({ isOpen, onClose }: ChatBoxProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const chatId = router.query.id as string
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  // لود تاریخچه چت هنگام باز شدن و احراز هویت
  useEffect(() => {
    if (!chatId) return
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat-sessions/${chatId}`)
        if (!res.ok) throw new Error('Failed to fetch messages')
        const data = await res.json()
        setMessages(data.messages)
      } catch (error) {
        console.error('Error fetching messages:', error)
        router.push('/dashboard')
      }
    }
    fetchMessages()
  }, [chatId, router])

  // ارسال پیام کاربر و دریافت پاسخ GPT
  const sendMessage = async () => {
    if (!input.trim() || !chatId) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: chatId, message: userMessage }),
      })

      if (!res.ok) throw new Error('Failed to send message')

      const data = await res.json()
      setMessages(data.messages)
    } catch (error) {
      console.error('Error sending message:', error)
      // نمایش پیام خطا به کاربر
    } finally {
      setLoading(false)
    }
  }

  // اسکرول خودکار به آخرین پیام پس از هر پیام جدید یا تایپ
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) return null

  // بازگردانی رابط چت اگر isOpen باشد
  return (
    <div className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-md h-[75vh] bg-white rounded-2xl shadow-2xl border flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-bold text-gray-900">گفت‌وگوی روان‌شناس</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ✕
        </Button>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col">
        {/* نمایش پیام‌ها با حالت بالن + انیمیشن تایپ */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-4 ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <div
                  className={`text-xs mt-2 ${
                    msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {format(new Date(msg.createdAt), 'HH:mm')}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-xl p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              className="flex-1"
              placeholder="پیام خود را وارد کنید..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
} 