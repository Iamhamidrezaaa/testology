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
  AlertCircle,
  CheckCircle,
  FileText
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
  const [isEndingChat, setIsEndingChat] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);

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
    if (!inputMessage.trim() || isLoading || chatEnded) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      // بررسی اینکه آیا سوال مرتبط با روان‌شناسی است یا نه
      const isPsychologyRelated = checkPsychologyRelated(currentInput);
      
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
          message: currentInput,
          history: messages
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 100)}`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response || data.reply || 'متأسفم، خطایی رخ داد. لطفاً دوباره تلاش کنید.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
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
    // کلمات کلیدی گسترده‌تر برای تشخیص بهتر
    const psychologyKeywords = [
      // احساسات و عواطف
      'احساس', 'عاطفه', 'روان', 'اضطراب', 'مضطرب', 'نگران', 'نگرانی', 'افسردگی', 'افسرده', 'غم', 'غمگین',
      'استرس', 'فشار', 'خشم', 'عصبانی', 'شادی', 'خوشحال', 'غم', 'ناراحت', 'ناراحتی',
      'ترس', 'می‌ترسم', 'ترسناک', 'فوبیا', 'وسواس', 'پانیک', 'اضطراب اجتماعی',
      'خستگی', 'خسته', 'بی‌حال', 'بی‌حوصلگی', 'بی‌انگیزه',
      
      // روابط و ارتباطات
      'روابط', 'رابطه', 'خانواده', 'والدین', 'پدر', 'مادر', 'دوستان', 'دوست',
      'عشق', 'عاشق', 'طلاق', 'جدایی', 'مرگ', 'از دست دادن', 'فقدان',
      'تنهایی', 'احساس تنهایی', 'انزوا', 'منزوی',
      
      // اعتماد به نفس و خودشناسی
      'اعتماد به نفس', 'خودباوری', 'خودشناسی', 'شخصیت', 'هویت', 'ارزش', 'باور', 'فکر', 'ذهن',
      'رفتار', 'عادات', 'عادت',
      
      // خواب و رویا
      'خواب', 'بی‌خوابی', 'کابوس', 'رویا', 'خاطرات', 'تروما', 'خاطره بد',
      
      // درمان و مشاوره
      'درمان', 'مشاوره', 'روان‌درمانی', 'روان‌شناس', 'روانپزشک', 'دارو', 'داروی ضد افسردگی',
      'کمک', 'کمکم کن', 'کمک می‌خواهم', 'نیاز به کمک',
      
      // مشکلات و چالش‌ها
      'مشکل', 'مشکلات', 'چالش', 'چالش‌ها', 'درد', 'رنج', 'رنج می‌برم',
      'خودکشی', 'آسیب', 'خودآزاری', 'اعتیاد', 'الکل', 'مواد',
      
      // سن و موقعیت
      'کودک', 'نوجوان', 'جوان', 'مدرسه', 'کار', 'شغل', 'تحصیل', 'دانشگاه',
      'پیری', 'بازنشستگی', 'بیماری', 'سلامت', 'سلامت روان',
      
      // سوالات رایج
      'چطور', 'چگونه', 'چرا', 'چی کار کنم', 'چه کنم', 'راه حل', 'راهکار',
      'نمی‌تونم', 'نمی‌توانم', 'نمیتونم', 'نمیتوانم'
    ];

    const messageLower = message.toLowerCase().trim();
    
    // اگر پیام خیلی کوتاه است (کمتر از 3 کاراکتر)، بررسی نکن
    if (messageLower.length < 3) {
      return false;
    }
    
    // بررسی کلمات کلیدی
    const hasKeyword = psychologyKeywords.some(keyword => messageLower.includes(keyword));
    
    // اگر کلمه کلیدی پیدا شد، مرتبط است
    if (hasKeyword) {
      return true;
    }
    
    // بررسی کلمات غیر مرتبط (ریاضی، فیزیک، و...)
    const unrelatedKeywords = [
      'ریاضی', 'حساب', 'جبر', 'هندسه', 'مثلث', 'دایره',
      'فیزیک', 'شیمی', 'زیست', 'نجوم', 'ستاره',
      'برنامه‌نویسی', 'کد', 'کامپیوتر', 'نرم‌افزار',
      'تاریخ', 'جغرافیا', 'سیاست', 'اقتصاد'
    ];
    
    const hasUnrelatedKeyword = unrelatedKeywords.some(keyword => messageLower.includes(keyword));
    
    // اگر کلمه غیر مرتبط پیدا شد، مرتبط نیست
    if (hasUnrelatedKeyword) {
      return false;
    }
    
    // اگر پیام شامل کلمات احساسی یا سوالی است، مرتبط در نظر بگیر
    const emotionalWords = ['من', 'منم', 'دارم', 'می‌خوام', 'میخوام', 'می‌خواهم', 'میخواهم'];
    const hasEmotionalContext = emotionalWords.some(word => messageLower.includes(word));
    
    // اگر پیام کوتاه است و شامل کلمات احساسی است، مرتبط در نظر بگیر
    if (messageLower.length < 50 && hasEmotionalContext) {
      return true;
    }
    
    // در غیر این صورت، مرتبط نیست
    return false;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // شمارش فقط سوالات مرتبط با روان‌شناسی
  const psychologyRelatedMessages = messages.filter((msg, index) => {
    if (msg.role !== 'user') return false;
    // بررسی اینکه آیا این پیام کاربر به سوال مرتبط با روان‌شناسی پاسخ داده یا نه
    // اگر پیام بعدی assistant باشد و محتوای آن پیام خطای "متأسفم" نباشد، یعنی مرتبط بوده
    const nextMessage = messages[index + 1];
    if (nextMessage && nextMessage.role === 'assistant') {
      const isError = nextMessage.content.includes('متأسفم، من فقط در زمینه مسائل روان‌شناختی');
      return !isError;
    }
    // اگر پیام بعدی وجود ندارد (مثلاً در حال تایپ است)، بررسی کن که آیا محتوای پیام مرتبط است
    return checkPsychologyRelated(msg.content);
  });
  
  const userMessageCount = psychologyRelatedMessages.length;
  // دکمه "پایان گفت‌وگو" بعد از 5 سوال مرتبط فعال می‌شود و همیشه نمایش داده می‌شود
  const canEndChat = userMessageCount >= 5 && !chatEnded;

  // پایان گفت‌وگو و تحلیل
  const handleEndChat = async () => {
    if (!canEndChat || isEndingChat) return;

    setIsEndingChat(true);
    
    try {
      // دریافت ایمیل کاربر
      const userEmail = localStorage.getItem('testology_email') || '';
      
      // ارسال گفت‌وگو برای تحلیل
      const response = await fetch('/api/chat/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages,
          userEmail: userEmail
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // ذخیره در localStorage
        localStorage.setItem('testology_chat_analysis', JSON.stringify(data));
        
        // نمایش پیام موفقیت
        const successMessage: ChatMessage = {
          role: 'assistant',
          content: '✅ گفت‌وگو با موفقیت تحلیل شد و نتایج در پروفایل شما ذخیره شد. می‌توانید در داشبورد خود آن‌ها را مشاهده کنید.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
        setChatEnded(true);
        
        // غیرفعال کردن input
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        throw new Error('خطا در تحلیل گفت‌وگو');
      }
    } catch (error) {
      console.error('Error ending chat:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'متأسفم، خطایی در تحلیل گفت‌وگو رخ داد. لطفاً دوباره تلاش کنید.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsEndingChat(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="mb-6 flex-shrink-0">
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
        <Card className="flex flex-col flex-1 min-h-0">
          <CardHeader className="border-b flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-500" />
              گفتگوی روان‌شناختی
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
            {/* Messages - باید scrollable باشد */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
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

            {/* Input Section - همیشه نمایش داده می‌شود */}
            <div className="border-t p-4 bg-white dark:bg-gray-800 flex-shrink-0">
              {/* دکمه پایان گفت‌وگو - بعد از 5 سوال مرتبط نمایش داده می‌شود */}
              {userMessageCount >= 5 && (
                <div className="mb-3 flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        شما {userMessageCount} سوال مرتبط با روان‌شناسی پرسیده‌اید
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {canEndChat 
                          ? 'می‌توانید گفت‌وگو را به پایان برسانید و تحلیل دریافت کنید' 
                          : 'می‌توانید ادامه دهید یا گفت‌وگو را به پایان برسانید'}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleEndChat}
                    disabled={isEndingChat || chatEnded}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white disabled:opacity-50"
                  >
                    {isEndingChat ? (
                      <>
                        <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                        در حال تحلیل...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 ml-2" />
                        پایان گفت‌وگو و تحلیل
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Input Box - همیشه نمایش داده می‌شود */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={chatEnded ? "گفت‌وگو به پایان رسیده است" : "سوال یا نگرانی‌تان را بنویسید..."}
                  disabled={isLoading || chatEnded}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading || chatEnded}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* راهنما */}
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
