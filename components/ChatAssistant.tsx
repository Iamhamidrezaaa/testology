'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { CircleHelp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import { Input } from "@/components/ui/input"

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiAssistant() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const hasScreened = router.query?.screeningDone === 'true'
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getMessage = () => {
    if (!session) return 'لطفاً ابتدا وارد حساب خود شوید تا گفت‌وگو آغاز شود.'
    if (!hasScreened) return 'برای شروع تحلیل، ابتدا تست غربالگری را کامل کنید.'
    return 'سلام! آماده‌ام که بر اساس تست‌ها و گفت‌وگو بهت کمک کنم. چی توی ذهنت می‌گذره؟'
  }

  const canChat = session && hasScreened

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, sessionId }),
      })

      if (!res.ok) {
        throw new Error("خطا در ارتباط با سرور")
      }

      const data = await res.json()
      setSessionId(data.sessionId)
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "متأسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="fixed bottom-5 right-5 z-50">
        <Button onClick={() => setOpen(true)} className="rounded-full h-12 w-12 p-0">
          <CircleHelp className="w-6 h-6" />
        </Button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90vw] max-w-md shadow-xl relative">
            <Button onClick={() => setOpen(false)} className="absolute top-2 right-2 text-sm">×</Button>
            <h2 className="text-lg font-semibold mb-4">روان‌یار تستولوژی</h2>
            
            {!canChat ? (
              <div className="text-gray-700 mb-4 whitespace-pre-line">
                {getMessage()}
              </div>
            ) : (
              <div className="flex flex-col h-[60vh]">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="پیام خود را بنویسید..."
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter" && !e.shiftKey && !loading) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button 
                    disabled={loading || !input.trim()} 
                    onClick={sendMessage}
                    className="min-w-[40px]"
                  >
                    <PaperPlaneIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 