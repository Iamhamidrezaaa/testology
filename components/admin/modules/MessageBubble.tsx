'use client'

interface MessageBubbleProps {
  from: 'user' | 'bot'
  text: string
}

export function MessageBubble({ from, text }: MessageBubbleProps) {
  const isUser = from === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
          isUser 
            ? 'bg-primary text-primary-foreground rounded-tr-none' 
            : 'bg-muted text-muted-foreground rounded-tl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  )
} 