"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  Clock,
  Heart,
  Target,
  Users,
  Lightbulb
} from "lucide-react";
import { getRandomScreeningSet } from "@/data/screening-sets";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Question {
  id: number;
  text: string;
  options: string[];
  dimensions: string[];
}

interface ScreeningSet {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export default function StartPage() {
  const [screeningSet, setScreeningSet] = useState<ScreeningSet | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const checkUserSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const session = await response.json();
      
      if (!session?.user?.email) {
        router.push("/login");
        return;
      }

      // بررسی اینکه آیا کاربر قبلاً غربالگری کرده یا نه
      const screeningResponse = await fetch(`/api/screening/analysis?userEmail=${encodeURIComponent(session.user.email)}`);
      const screeningData = await screeningResponse.json();
      
      if (screeningData.success) {
        router.push("/dashboard");
        return;
      }
    } catch (error) {
      console.error('Error checking session:', error);
      router.push("/login");
    }
  };

  useEffect(() => {
    // بررسی لاگین بودن کاربر
    checkUserSession();

    // انتخاب تصادفی کالکشن
    try {
      const randomSet = getRandomScreeningSet();
      console.log("Selected screening set:", randomSet);
      
      if (!randomSet || !randomSet.questions || randomSet.questions.length === 0) {
        console.error("Invalid screening set:", randomSet);
        setLoading(false);
        return;
      }
      
      setScreeningSet(randomSet);
      setLoading(false);
    } catch (error) {
      console.error("Error loading screening set:", error);
      setLoading(false);
    }
  }, [router]);

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [screeningSet!.questions[currentQuestion].id]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < screeningSet!.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // دریافت اطلاعات کاربر از session
      const sessionResponse = await fetch('/api/auth/session');
      const session = await sessionResponse.json();
      
      if (!session?.user?.email) {
        router.push("/login");
        return;
      }

      const userEmail = session.user.email;
      
      const response = await fetch('/api/analyze-screening', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          screeningSetId: screeningSet!.id,
          answers
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // انتقال به صفحه تست‌های پیشنهادی
        router.push("/start/suggested-tests");
      } else {
        alert("خطا در تحلیل پاسخ‌ها. لطفاً دوباره تلاش کنید.");
      }
    } catch (error) {
      console.error("Error submitting screening:", error);
      alert("خطا در ارسال پاسخ‌ها. لطفاً دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="xl" text="در حال آماده‌سازی ارزیابی..." />;
  }

  if (!screeningSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center" dir="rtl">
        <Card className="max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <Brain className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              خطا در بارگذاری
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              خطا در بارگذاری سوالات ارزیابی
            </p>
            <Button onClick={() => window.location.reload()}>
              تلاش مجدد
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // بررسی اینکه screeningSet و currentQ موجود باشند
  if (!screeningSet || !screeningSet.questions || screeningSet.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  const currentQ = screeningSet.questions[currentQuestion];
  if (!currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">خطا در بارگذاری سوالات</p>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / screeningSet.questions.length) * 100;
  const isLastQuestion = currentQuestion === screeningSet.questions.length - 1;
  const canProceed = answers[currentQ.id] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800" dir="rtl">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {screeningSet.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {screeningSet.description}
                </p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                سوال {currentQuestion + 1} از {screeningSet.questions.length}
              </p>
              <Progress value={progress} className="w-32 h-2 mt-2" />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              سوال {currentQuestion + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                {currentQ.text}
              </h3>
              
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-4 text-right rounded-lg border-2 transition-all duration-200 ${
                      answers[currentQ.id] === option
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{option}</span>
                      {answers[currentQ.id] === option && (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions Badges */}
            <div className="flex flex-wrap gap-2">
              {currentQ.dimensions.map((dimension, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {dimension === 'anxiety' && <Heart className="w-3 h-3 ml-1" />}
                  {dimension === 'emotion' && <Brain className="w-3 h-3 ml-1" />}
                  {dimension === 'relationship' && <Users className="w-3 h-3 ml-1" />}
                  {dimension === 'motivation' && <Target className="w-3 h-3 ml-1" />}
                  {dimension === 'self-esteem' && <Lightbulb className="w-3 h-3 ml-1" />}
                  {dimension === 'focus' && <Clock className="w-3 h-3 ml-1" />}
                  {dimension}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            قبلی
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: screeningSet.questions.length }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= currentQuestion
                    ? 'bg-blue-500'
                    : answers[screeningSet.questions[index].id]
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed || submitting}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {submitting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  تکمیل ارزیابی
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center gap-2"
            >
              بعدی
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Progress Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            این ارزیابی به ما کمک می‌کند تا بهتر درک کنیم چه نوع پشتیبانی نیاز داری
          </p>
        </div>
      </div>
    </div>
  );
}

