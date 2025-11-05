"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Send, 
  Brain, 
  Heart, 
  Target,
  ArrowRight,
  CheckCircle,
  Clock,
  User,
  Bot
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Message {
  id: string;
  role: 'user' | 'therapist';
  content: string;
  timestamp: Date;
}

interface RecommendedTest {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  category: string;
}

export default function TherapistChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRecommendedTests, setShowRecommendedTests] = useState(false);
  const [recommendedTests, setRecommendedTests] = useState<RecommendedTest[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // بارگذاری تحلیل غربالگری
    const screeningAnalysis = localStorage.getItem("testology_screening_analysis");
    if (screeningAnalysis) {
      const parsedAnalysis = JSON.parse(screeningAnalysis);
      setAnalysis(parsedAnalysis);
      
      // شروع گفتگو با پیام اولیه درمانگر
      const initialMessage: Message = {
        id: '1',
        role: 'therapist',
        content: generateInitialTherapistMessage(parsedAnalysis),
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    } else {
      router.push("/start");
    }
  }, [router]);

  const generateInitialTherapistMessage = (analysis: any) => {
    return `سلام عزیزم! 👋

پاسخ‌هات به من نشون می‌دن که در چند بخش از زندگی‌ت احساس فشار یا تردید داری. این کاملاً طبیعی و قابل درک است.

اگه راحتی، برام بگو این روزها بیشتر چه چیزهایی ذهنت رو درگیر کرده یا باعث ناراحتی‌ت می‌شه؟ 

من اینجا هستم تا کمکت کنم و باهم راه‌حل پیدا کنیم. 💙`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // شبیه‌سازی پاسخ درمانگر
      const therapistResponse = await generateTherapistResponse(inputMessage, messages.length);
      
      const therapistMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'therapist',
        content: therapistResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, therapistMessage]);

      // بعد از 2-3 پیام، پیشنهاد تست‌ها را نشان بده
      if (messages.length >= 2 && !showRecommendedTests) {
        setTimeout(() => {
          setShowRecommendedTests(true);
          generateRecommendedTests();
        }, 2000);
      }

    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTherapistResponse = async (userMessage: string, messageCount: number): Promise<string> => {
    // شبیه‌سازی پاسخ‌های درمانگر بر اساس محتوای پیام کاربر
    const responses = [
      "متوجه‌ام که این موضوع واقعاً ذهنت رو درگیر کرده. می‌تونی بیشتر در موردش بگی؟",
      "این احساسی که داری کاملاً طبیعی است. خیلی از افراد در موقعیت مشابهی قرار می‌گیرن.",
      "فهمیدم که این مسئله چقدر برات مهمه. چه راه‌هایی تا الان امتحان کردی؟",
      "احساس می‌کنم که این موضوع واقعاً آزارت می‌ده. می‌خوای در موردش بیشتر صحبت کنیم؟",
      "درک می‌کنم که این شرایط چقدر سخت بوده برات. تو تنها نیستی و من اینجا هستم تا کمکت کنم."
    ];

    // اگر پیام شامل کلمات اضطراب‌آور باشد
    if (userMessage.includes('اضطراب') || userMessage.includes('نگران') || userMessage.includes('ترس')) {
      return "می‌بینم که اضطراب و نگرانی زیادی داری. این احساسات کاملاً طبیعی هستند، خصوصاً وقتی با چالش‌های جدید مواجه می‌شیم. می‌تونی بگی چه چیزهایی بیشتر باعث این نگرانی‌هات می‌شه؟";
    }

    // اگر پیام شامل کلمات غم‌آور باشد
    if (userMessage.includes('غمگین') || userMessage.includes('ناراحت') || userMessage.includes('خسته')) {
      return "احساس می‌کنم که این روزها خیلی ناراحت و خسته‌ای. این احساسات سخت هستند و درکشون می‌کنم. می‌خوای در مورد چیزهایی که باعث این احساسات می‌شه صحبت کنیم؟";
    }

    // اگر پیام شامل کلمات مثبت باشد
    if (userMessage.includes('خوب') || userMessage.includes('خوشحال') || userMessage.includes('امید')) {
      return "خوشحالم که این احساسات مثبت رو داری! این نشون‌دهنده اینه که تو قدرت و امید داری. می‌تونی بگی چه چیزهایی باعث این احساسات خوب شده؟";
    }

    // پاسخ پیش‌فرض
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateRecommendedTests = () => {
    const tests: RecommendedTest[] = [
      {
        id: 'GAD-7',
        name: 'تست اضطراب (GAD-7)',
        description: 'ارزیابی سطح اضطراب و نگرانی‌های عمومی',
        estimatedTime: '5 دقیقه',
        category: 'اضطراب'
      },
      {
        id: 'PHQ-9',
        name: 'تست افسردگی (PHQ-9)',
        description: 'بررسی علائم افسردگی و خلق و خو',
        estimatedTime: '5 دقیقه',
        category: 'افسردگی'
      },
      {
        id: 'PSS',
        name: 'تست استرس (PSS)',
        description: 'سنجش سطح استرس و فشار روانی',
        estimatedTime: '3 دقیقه',
        category: 'استرس'
      }
    ];

    setRecommendedTests(tests);
  };

  const handleStartTest = (testId: string) => {
    // ذخیره تست‌های پیشنهادی
    localStorage.setItem("testology_recommended_tests", JSON.stringify(recommendedTests));
    
    // انتقال به صفحه تست
    router.push(`/tests/${testId}`);
  };

  const handleSkipToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800" dir="rtl">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  گفتگو با مشاور هوشمند
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  در اینجا می‌توانی آزادانه در مورد احساساتت صحبت کنی
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleSkipToDashboard}
              className="text-gray-600"
            >
              رفتن به داشبورد
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  گفتگو با مشاور
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.role === 'therapist' && (
                            <Bot className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                          )}
                          {message.role === 'user' && (
                            <User className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                          )}
                          <div>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs opacity-70 mt-2">
                              {message.timestamp.toLocaleTimeString('fa-IR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <LoadingSpinner size="sm" text="مشاور در حال پاسخ..." />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="پیام خود را اینجا بنویسید..."
                    className="flex-1 min-h-[60px] resize-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="self-end"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analysis Summary */}
            {analysis && (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-500" />
                    خلاصه تحلیل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                      وضعیت کلی
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {analysis.overallAnalysis}
                    </p>
                  </div>
                  
                  {analysis.keyInsights && analysis.keyInsights.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                        نکات کلیدی
                      </h4>
                      <ul className="space-y-1">
                        {analysis.keyInsights.map((insight: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recommended Tests */}
            {showRecommendedTests && (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    تست‌های پیشنهادی
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    بر اساس گفتگوی ما، این تست‌ها می‌توانند به تو کمک کنند:
                  </p>
                  
                  {recommendedTests.map((test) => (
                    <div key={test.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                          {test.name}
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          {test.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {test.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {test.estimatedTime}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleStartTest(test.id)}
                          className="text-xs"
                        >
                          شروع تست
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      onClick={handleSkipToDashboard}
                      variant="outline"
                      className="w-full text-sm"
                    >
                      <ArrowRight className="w-4 h-4 ml-2" />
                      رفتن به داشبورد
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





