"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  ArrowLeft,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatAIPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // پیام خوش‌آمدگویی اولیه
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: 'سلام! من هوش مصنوعی Testology هستم و اینجا هستم تا در مسائل روان‌شناختی و روانکاوانه به شما کمک کنم. لطفاً سوالات و نگرانی‌هایتان را با من در میان بگذارید.',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      // بررسی اینکه آیا سوال مرتبط با روان‌شناسی است یا نه
      const isPsychologyRelated = checkPsychologyRelated(inputMessage);
      
      if (!isPsychologyRelated) {
        const responseMessage: ChatMessage = {
          role: 'assistant',
          content: 'متأسفم، من فقط در زمینه مسائل روان‌شناختی و روانکاوانه می‌توانم به شما کمک کنم. لطفاً سوالات مرتبط با سلامت روان، احساسات، روابط، اضطراب، افسردگی و سایر مسائل روان‌شناختی را مطرح کنید.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, responseMessage]);
        setIsLoading(false);
        setIsTyping(false);
        return;
      }

      // ارسال پیام به API
      const response = await fetch('/api/chat/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          history: messages
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: data.response || 'متأسفم، خطایی رخ داد. لطفاً دوباره تلاش کنید.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('خطا در ارسال پیام');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'متأسفم، خطایی رخ داد. لطفاً دوباره تلاش کنید.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const checkPsychologyRelated = (message: string): boolean => {
    const psychologyKeywords = [
      'احساس', 'عاطفه', 'روان', 'اضطراب', 'افسردگی', 'استرس', 'خشم', 'غم', 'شادی',
      'روابط', 'خانواده', 'دوستان', 'عشق', 'طلاق', 'مرگ', 'از دست دادن',
      'اعتماد به نفس', 'ترس', 'فوبیا', 'وسواس', 'پانیک', 'اضطراب اجتماعی',
      'خواب', 'بی‌خوابی', 'کابوس', 'رویا', 'خاطرات', 'تروما',
      'رفتار', 'شخصیت', 'هویت', 'ارزش', 'باور', 'فکر', 'ذهن',
      'درمان', 'مشاوره', 'روان‌درمانی', 'دارو', 'داروی ضد افسردگی',
      'خودکشی', 'آسیب', 'خودآزاری', 'اعتیاد', 'الکل', 'مواد',
      'کودک', 'نوجوان', 'والدین', 'مدرسه', 'کار', 'شغل', 'تحصیل',
      'پیری', 'بازنشستگی', 'بیماری', 'سلامت', 'درد', 'خستگی'
    ];

    const messageLower = message.toLowerCase();
    return psychologyKeywords.some(keyword => messageLower.includes(keyword));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              بازگشت
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  چت با هوش مصنوعی
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  مشاوره روان‌شناختی هوشمند
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-500" />
              گفتگوی روان‌شناختی
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-blue-500' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' 
                          ? 'text-blue-100' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString('fa-IR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                      <div className="flex items-center gap-1">
                        <RefreshCw className="w-4 h-4 animate-spin text-purple-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          در حال تایپ...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="سوال یا نگرانی‌تان را بنویسید..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <AlertCircle className="w-3 h-3" />
                <span>فقط سوالات مرتبط با روان‌شناسی پاسخ داده می‌شود</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
