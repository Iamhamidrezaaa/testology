'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import ChatBox from './ChatBox'

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
      {isOpen && <ChatBox isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  )
} 