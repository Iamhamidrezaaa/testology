"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/app/providers/LanguageProvider';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBotButton() {
  const { data: session } = useSession();
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [limitInfo, setLimitInfo] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadHistory = async () => {
    if (!session) return;
    
    try {
      const response = await fetch('/api/chat');
      if (response.ok) {
        const history = await response.json();
        setMessages(history.map((m: any) => ({
          role: m.role,
          content: m.content
        })));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          sessionId: session?.user?.id || 'guest',
          language: lang || 'en'
        })
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: Message = { role: 'assistant', content: data.reply };
        setMessages(prev => [...prev, assistantMessage]);
        setLimitInfo({
          plan: data.plan,
          remaining: data.remainingMessages,
          sentiment: data.sentiment
        });

        // نمایش احساس تشخیص داده شده (اختیاری)
        if (data.sentiment && data.sentiment !== 'neutral') {
          console.log(`Detected emotion: ${data.sentiment}`);
        }
      } else {
        // محدودیت روزانه
        if (data.limitReached) {
          alert(`Daily limit reached!\nPlan: ${data.plan}\nLimit: ${data.limit} messages/day\n\nUpgrade for more messages!`);
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `⚠️ You've reached your daily limit (${data.limit} messages for ${data.plan} users). Please upgrade your plan or try again tomorrow.`
          }]);
        } else {
          alert('Error: ' + data.error);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Sorry, something went wrong. Please try again.'
      }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center text-3xl"
        title="AI Psychology Assistant"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">🤖 AI Psychology Assistant</h3>
              <p className="text-xs opacity-90">
                {limitInfo ? `${limitInfo.remaining} messages remaining` : 'Ask me anything about mental health'}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <div className="text-5xl mb-3">👋</div>
                <p>Hi! I'm your AI psychology assistant.</p>
                <p className="text-sm mt-2">Ask me about mental health, anxiety, depression, or any psychology topic.</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-none px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="animate-bounce">●</div>
                    <div className="animate-bounce delay-100">●</div>
                    <div className="animate-bounce delay-200">●</div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                disabled={sending}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || sending}
                className="w-10 h-10 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-colors"
              >
                {sending ? '⏳' : '➤'}
              </button>
            </div>
            
            {!session && (
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                Guest: 3 messages/day • <a href="/login" className="text-purple-600">Login</a> for more
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

