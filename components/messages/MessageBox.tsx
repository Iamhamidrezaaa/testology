'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  id: string
  content: string
  from: {
    id: string
    name: string
    image?: string
  }
  to: {
    id: string
    name: string
    image?: string
  }
  createdAt: string
  isRead: boolean
  fromMe: boolean
}

interface MessageBoxProps {
  messages: Message[]
  onSend: (content: string) => void
  currentUser?: {
    id: string
    name: string
    image?: string
  }
  otherUser?: {
    id: string
    name: string
    image?: string
  }
  className?: string
}

export default function MessageBox({ 
  messages, 
  onSend, 
  currentUser,
  otherUser,
  className = "" 
}: MessageBoxProps) {
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!text.trim() || isLoading) return

    setIsLoading(true)
    try {
      await onSend(text.trim())
      setText('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('fa-IR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <Card className={`bg-white shadow-lg ${className}`}>
      <CardHeader className="pb-3 border-b">
        <CardTitle className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={otherUser?.image} />
            <AvatarFallback>
              {otherUser?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{otherUser?.name || 'کاربر'}</div>
            <div className="text-sm text-gray-500">
              {messages.length} پیام
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* ناحیه پیام‌ها */}
        <ScrollArea className="h-80 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">💬</div>
                <p>هنوز پیامی ارسال نشده است</p>
                <p className="text-sm">اولین پیام را ارسال کنید!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.fromMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-xs ${message.fromMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!message.fromMe && (
                      <Avatar className="w-6 h-6 mt-1">
                        <AvatarImage src={message.from.image} />
                        <AvatarFallback className="text-xs">
                          {message.from.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`space-y-1 ${message.fromMe ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`px-3 py-2 rounded-lg ${
                          message.fromMe
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      
                      <div className={`text-xs text-gray-500 flex items-center gap-1 ${
                        message.fromMe ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{formatTime(message.createdAt)}</span>
                        {message.fromMe && (
                          <span className={message.isRead ? 'text-blue-500' : 'text-gray-400'}>
                            {message.isRead ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* ناحیه ارسال پیام */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="پیام خود را بنویسید..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!text.trim() || isLoading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isLoading ? '...' : 'ارسال'}
            </Button>
          </div>
          
          {text.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              {text.length} کاراکتر
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
















