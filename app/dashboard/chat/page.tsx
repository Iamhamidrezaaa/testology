"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Clock,
  Trash2,
  RefreshCw,
  Settings,
  Mic,
  MicOff,
  Paperclip,
  Smile,
  MoreVertical
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  // پیام‌های اولیه
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: "1",
        text: "سلام! من دستیار هوشمند Testology هستم. چطور می‌تونم کمکتون کنم؟",
        sender: "bot",
        timestamp: new Date()
      }
    ];
    setMessages(initialMessages);
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText("");
    setIsTyping(true);
    setIsLoading(true);

    // ذخیره چت در دیتابیس
    try {
      const userEmail = localStorage.getItem("testology_email");
      if (userEmail) {
        await fetch('/api/chat/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            messages: newMessages
          })
        });
      }
    } catch (error) {
      console.error('Error saving chat:', error);
    }

    // شبیه‌سازی پاسخ ربات
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "متشکرم از پیام شما. من در حال پردازش درخواست شما هستم و به زودی پاسخ کاملی ارائه خواهم داد.",
        sender: "bot",
        timestamp: new Date()
      };
      
      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);
      setIsTyping(false);
      setIsLoading(false);

      // ذخیره چت نهایی
      try {
        const userEmail = localStorage.getItem("testology_email");
        if (userEmail) {
          fetch('/api/chat/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: userEmail,
              messages: finalMessages
            })
          });
        }
      } catch (error) {
        console.error('Error saving final chat:', error);
      }
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: "1",
      text: "سلام! من دستیار هوشمند Testology هستم. چطور می‌تونم کمکتون کنم؟",
      sender: "bot",
      timestamp: new Date()
    }]);
  };

  const loadChatHistory = async () => {
    try {
      const userEmail = localStorage.getItem("testology_email");
      if (userEmail) {
        const response = await fetch(`/api/chat/history?email=${encodeURIComponent(userEmail)}`);
        const data = await response.json();
        
        if (data.success) {
          setChatHistory(data.chats);
          setShowHistory(true);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fa-IR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  چت هوشمند
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  گفتگو با دستیار هوشمند Testology
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadChatHistory}
                className="text-gray-600 hover:text-blue-600"
              >
                <Clock className="w-4 h-4 ml-2" />
                تاریخچه چت
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
                className="text-gray-600 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4 ml-2" />
                پاک کردن چت
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600"
              >
                <Settings className="w-4 h-4 ml-2" />
                تنظیمات
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-500" />
              گفتگوی زنده
              {isTyping && (
                <Badge variant="secondary" className="animate-pulse">
                  در حال تایپ...
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <div className={`text-xs mt-2 opacity-70 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <Clock className="w-3 h-3 inline ml-1" />
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="پیام خود را بنویسید..."
                    className="pr-12 pl-4 py-3 rounded-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    disabled={isLoading}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`${isRecording ? 'text-red-500' : 'text-gray-500'} hover:text-red-600`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>

                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-full"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            اقدامات سریع
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => window.location.href = '/dashboard/tests'}
            >
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <span className="text-sm">راهنمای تست‌ها</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => window.location.href = '/dashboard/results'}
            >
              <Bot className="w-5 h-5 text-green-500" />
              <span className="text-sm">نتایج تست‌ها</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => window.location.href = '/dashboard/recommendations'}
            >
              <Settings className="w-5 h-5 text-purple-500" />
              <span className="text-sm">پیشنهادات</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => window.location.href = '/dashboard/psychological-profile'}
            >
              <User className="w-5 h-5 text-orange-500" />
              <span className="text-sm">پروفایل روانی</span>
            </Button>
          </div>
        </div>

        {/* Chat History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    تاریخچه چت‌ها
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHistory(false)}
                    className="text-gray-500"
                  >
                    ✕
                  </Button>
                </div>
              </div>
              
              <div className="p-6 max-h-96 overflow-y-auto">
                {chatHistory.length > 0 ? (
                  <div className="space-y-4">
                    {chatHistory.map((chat, index) => (
                      <div key={chat.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">
                            چت #{index + 1}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(chat.createdAt).toLocaleDateString('fa-IR')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {chat.messages.length} پیام
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            setMessages(chat.messages);
                            setShowHistory(false);
                          }}
                        >
                          ادامه این چت
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    هیچ چت قبلی یافت نشد
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
