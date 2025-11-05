"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  CheckCircle, 
  ArrowRight, 
  Clock,
  Target,
  Heart,
  Users,
  Lightbulb,
  Sparkles,
  ArrowLeft,
  MessageCircle
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import CheckmarkAnimation from "@/components/ui/CheckmarkAnimation";
import TestProgressIndicator from "@/components/ui/TestProgressIndicator";
import CompletionModal from "@/components/ui/CompletionModal";
import ProfileCompletionModal from "@/components/ui/ProfileCompletionModal";
import { TestDataManager, TestData } from "@/lib/test-data";
import { SimpleTestStorage } from "@/lib/simple-test-storage";
import { getTestQuestions } from "@/app/data/test-questions";

interface SuggestedTest {
  id: string;
  name: string;
  description: string;
  reason: string;
  estimatedTime: string;
  difficulty: 'آسان' | 'متوسط' | 'سخت';
  category: string;
  completed?: boolean;
}

interface TestSession {
  testId: string;
  testData: TestData;
  currentQuestion: number;
  answers: Record<string, number>;
  isCompleted: boolean;
  score?: number;
  analysis?: string;
}

export default function SuggestedTestsPage() {
  const [suggestedTests, setSuggestedTests] = useState<SuggestedTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [activeTestSession, setActiveTestSession] = useState<TestSession | null>(null);
  const [userSelfDescription, setUserSelfDescription] = useState<string>('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const loadSuggestedTests = async () => {
      try {
        // دریافت اطلاعات کاربر از session
        const sessionResponse = await fetch('/api/auth/session');
        const session = await sessionResponse.json();
        
        if (!session?.user?.email) {
          router.push("/login");
          return;
        }

        const email = session.user.email;
        setUserEmail(email);

        // دریافت تحلیل غربالگری از دیتابیس
        const screeningResponse = await fetch(`/api/screening/analysis?userEmail=${encodeURIComponent(email)}`);
        const screeningData = await screeningResponse.json();
        
        if (!screeningData.success) {
          console.log("No screening analysis found, redirecting to start");
          router.push("/start");
          return;
        }

        const screeningAnalysis = screeningData.data.analysis;

        // درخواست پیشنهاد تست‌ها از API
        try {
          const response = await fetch('/api/suggest-tests', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              screeningAnalysis: JSON.parse(screeningAnalysis),
              userEmail: email
            }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log("API response data:", data);
            
            // دریافت نتایج تست‌های تکمیل شده از دیتابیس
            const { SimpleTestStorage } = await import('@/lib/simple-test-storage');
            const completedTests = await SimpleTestStorage.getAllTestResults(email);
            const completedTestIds = completedTests.map((test: any) => test.testId);
            
            // اضافه کردن وضعیت تکمیل به تست‌ها
            const testsWithStatus = (data.suggestedTests || []).map((test: any) => ({
              ...test,
              completed: completedTestIds.includes(test.id)
            }));
            
            setSuggestedTests(testsWithStatus);
            
            // ذخیره تست‌های پیشنهادی در localStorage
            localStorage.setItem('testology_suggested_tests', JSON.stringify(
              testsWithStatus.map((test: any) => ({ id: test.id, name: test.name, completed: test.completed }))
            ));
            
            // شروع ردیابی پیشرفت
            if (data.testIds) {
              const { TestProgressTracker } = await import('@/lib/test-progress');
              TestProgressTracker.startTracking(data.testIds);
            }
          } else {
            console.log("API response not ok, using default tests");
            throw new Error("API response not ok");
          }
        } catch (apiError) {
          console.log("API error, using default tests:", apiError);
          // در صورت خطا، تست‌های پیش‌فرض
          const defaultTests: SuggestedTest[] = [
            {
              id: "anxiety-assessment",
              name: "تست اضطراب",
              description: "ارزیابی سطح اضطراب و استرس روزانه",
              reason: "بر اساس پاسخ‌های شما، ممکن است از اضطراب خفیف رنج ببرید",
              estimatedTime: "5 دقیقه",
              difficulty: "آسان",
              category: "اضطراب"
            },
            {
              id: "depression-screening",
              name: "تست افسردگی",
              description: "بررسی علائم افسردگی و خلق و خو",
              reason: "برای درک بهتر وضعیت روحی شما",
              estimatedTime: "7 دقیقه",
              difficulty: "متوسط",
              category: "خلق و خو"
            }
          ];
          
          // دریافت نتایج تست‌های تکمیل شده از دیتابیس
          const { SimpleTestStorage } = await import('@/lib/simple-test-storage');
          const completedTests = await SimpleTestStorage.getAllTestResults(email);
          const completedTestIds = completedTests.map((test: any) => test.testId);
          
          // اضافه کردن وضعیت تکمیل به تست‌های پیش‌فرض
          const testsWithStatus = defaultTests.map((test: any) => ({
            ...test,
            completed: completedTestIds.includes(test.id)
          }));
          
          setSuggestedTests(testsWithStatus);
          console.log("Set default tests with status:", testsWithStatus);
          
          // ذخیره تست‌های پیش‌فرض در localStorage
          localStorage.setItem('testology_suggested_tests', JSON.stringify(
            defaultTests.map((test: any) => ({ id: test.id, name: test.name }))
          ));
          
          // شروع ردیابی پیشرفت برای تست‌های پیش‌فرض
          try {
            const { TestProgressTracker } = await import('@/lib/test-progress');
            TestProgressTracker.startTracking(defaultTests.map(t => t.id));
          } catch (trackerError) {
            console.log("Tracker error:", trackerError);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading suggested tests:", error);
        // در صورت خطای کلی، تست‌های پیش‌فرض
        const fallbackTests: SuggestedTest[] = [
          {
            id: "anxiety-assessment",
            name: "تست اضطراب",
            description: "ارزیابی سطح اضطراب و استرس روزانه",
            reason: "تست پیش‌فرض برای شروع",
            estimatedTime: "5 دقیقه",
            difficulty: "آسان",
            category: "اضطراب"
          },
          {
            id: "depression-screening",
            name: "تست افسردگی",
            description: "بررسی علائم افسردگی و خلق و خو",
            reason: "تست پیش‌فرض برای شروع",
            estimatedTime: "7 دقیقه",
            difficulty: "متوسط",
            category: "خلق و خو"
          }
        ];
        setSuggestedTests(fallbackTests);
        console.log("Set fallback tests:", fallbackTests);
        setLoading(false);
      }
    };

    loadSuggestedTests();
  }, [router]);

  // شروع تست
  const handleStartTest = (testId: string) => {
    console.log("Starting test:", testId);
    
    // ابتدا از TestDataManager جستجو کن
    let testData = TestDataManager.getTestById(testId);
    
    // اگر پیدا نشد، از getTestQuestions استفاده کن
    if (!testData) {
      console.log("Test not found in TestDataManager, trying getTestQuestions");
      const questions = getTestQuestions(testId);
      if (questions && questions.length > 0) {
        // ساخت testData از questions
        testData = {
          id: testId,
          name: suggestedTests.find(t => t.id === testId)?.name || testId,
          description: suggestedTests.find(t => t.id === testId)?.description || "",
          duration: suggestedTests.find(t => t.id === testId)?.estimatedTime || "5 دقیقه",
          level: suggestedTests.find(t => t.id === testId)?.difficulty || "آسان",
          category: suggestedTests.find(t => t.id === testId)?.category || "عمومی",
          questions: questions.map((q, index) => ({
            id: `q${index + 1}`,
            text: q.text,
            options: [
              "اصلاً",
              "کم",
              "گاهی",
              "اغلب",
              "همیشه"
            ],
            order: index + 1
          }))
        };
        console.log("Created testData from questions:", testData);
      }
    }
    
    if (!testData) {
      console.error("Test not found:", testId);
      return;
    }

    const testSession: TestSession = {
      testId,
      testData,
      currentQuestion: 0,
      answers: {},
      isCompleted: false
    };

    setActiveTestSession(testSession);
  };

  // پاسخ دادن به سوال
  const handleAnswerQuestion = (questionId: string, answerIndex: number) => {
    if (!activeTestSession) return;

    // تبدیل answerIndex به امتیاز (0, 1, 2, 3, 4 -> 0, 1, 2, 3, 4)
    const score = answerIndex;

    const newAnswers = {
      ...activeTestSession.answers,
      [questionId]: score
    };

    setActiveTestSession(prev => ({
      ...prev!,
      answers: newAnswers
    }));
  };

  // رفتن به سوال بعدی
  const handleNextQuestion = () => {
    if (!activeTestSession) return;

    const nextQuestion = activeTestSession.currentQuestion + 1;
    if (nextQuestion >= activeTestSession.testData.questions.length) {
      // تست تمام شد
      handleCompleteTest();
    } else {
      setActiveTestSession(prev => ({
        ...prev!,
        currentQuestion: nextQuestion
      }));
    }
  };

  // رفتن به سوال قبلی
  const handlePreviousQuestion = () => {
    if (!activeTestSession || activeTestSession.currentQuestion === 0) return;

    setActiveTestSession(prev => ({
      ...prev!,
      currentQuestion: prev!.currentQuestion - 1
    }));
  };

  // تکمیل تست
  const handleCompleteTest = async () => {
    if (!activeTestSession) return;

    try {
      console.log('🔄 شروع تکمیل تست:', activeTestSession.testId);
      console.log('📋 activeTestSession:', activeTestSession);
      console.log('📊 answers:', activeTestSession.answers);
      
      // محاسبه نمره
      let score, analysis;
      
      try {
        // ابتدا از TestDataManager استفاده کن
        score = TestDataManager.calculateScore(activeTestSession.testId, activeTestSession.answers);
        analysis = TestDataManager.generateTestAnalysis(activeTestSession.testId, score);
      } catch (error) {
        console.log('TestDataManager failed, calculating manually:', error);
        // اگر TestDataManager کار نکرد، محاسبه دستی انجام بده
        const answers = Object.values(activeTestSession.answers);
        const totalScore = answers.reduce((sum, answer) => sum + (answer || 0), 0);
        const maxScore = answers.length * 4; // حداکثر نمره (4 برای هر سوال)
        score = Math.round((totalScore / maxScore) * 100);
        
        // تحلیل ساده بر اساس نمره
        if (score >= 80) {
          analysis = "نمره شما عالی است. شما در این زمینه عملکرد بسیار خوبی دارید.";
        } else if (score >= 60) {
          analysis = "نمره شما در حد متوسط است. با تمرین و تلاش می‌توانید آن را بهبود دهید.";
        } else if (score >= 40) {
          analysis = "نمره شما نیاز به بهبود دارد. توصیه می‌شود از راهکارهای مناسب استفاده کنید.";
        } else {
          analysis = "نمره شما پایین است. حتماً با یک متخصص مشورت کنید.";
        }
      }
      
      console.log('📊 نمره محاسبه شد:', score);
      console.log('📝 تحلیل تولید شد:', analysis);

      // ذخیره نتیجه در دیتابیس
      const testResult = await SimpleTestStorage.saveTestResult({
        testId: activeTestSession.testId,
        testName: activeTestSession.testData.name,
        score,
        answers: activeTestSession.answers,
        result: analysis,
        analysis,
        userId: userEmail || 'demo-user'
      });
      
      console.log('✅ نتیجه تست ذخیره شد:', testResult);

      // به‌روزرسانی تست به عنوان تکمیل شده
      setSuggestedTests(prev => 
        prev.map(test => 
          test.id === activeTestSession.testId 
            ? { ...test, completed: true }
            : test
        )
      );

      // به‌روزرسانی session
      setActiveTestSession(prev => ({
        ...prev!,
        isCompleted: true,
        score,
        analysis
      }));

      // اگر همه تست‌ها تکمیل شدند، چک کردن تکمیل پروفایل
      const allCompleted = suggestedTests.every(test => 
        test.id === activeTestSession.testId || test.completed
      );
      
      if (allCompleted) {
        // چک کردن تکمیل پروفایل از دیتابیس
        try {
          const profileResponse = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
          const profileData = await profileResponse.json();
          
          if (profileData.success && profileData.user) {
            const isProfileComplete = profileData.user.name && 
                                    profileData.user.lastName && 
                                    profileData.user.birthDate && 
                                    profileData.user.province && 
                                    profileData.user.city;
            
            if (!isProfileComplete) {
              setShowProfileModal(true);
            } else {
              setShowCompletionModal(true);
            }
          } else {
            setShowProfileModal(true);
          }
        } catch (error) {
          console.error('Error checking profile completion:', error);
          setShowProfileModal(true);
        }
      }

    } catch (error) {
      console.error('❌ خطا در تکمیل تست:', error);
      alert('خطا در تکمیل تست. لطفاً دوباره تلاش کنید.');
    }
  };



  // تکمیل پروفایل
  const handleProfileComplete = (profileData: any) => {
    setShowProfileModal(false);
    // پروفایل تکمیل شد، ادامه فلو
    console.log('Profile completed:', profileData);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'آسان': return 'bg-green-100 text-green-800';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800';
      case 'سخت': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'اضطراب': return <Heart className="w-4 h-4" />;
      case 'خلق و خو': return <Brain className="w-4 h-4" />;
      case 'روابط': return <Users className="w-4 h-4" />;
      case 'انگیزه': return <Target className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <LoadingSpinner size="xl" text="در حال آماده‌سازی تست‌های پیشنهادی..." />
        </div>
      </div>
    );
  }

  const completedTests = suggestedTests.filter(test => test.completed).length;
  const progressPercentage = suggestedTests.length > 0 ? (completedTests / suggestedTests.length) * 100 : 0;
  const allTestsCompleted = suggestedTests.length > 0 && completedTests === suggestedTests.length;
  
  console.log("Suggested tests:", suggestedTests);
  console.log("Completed tests:", completedTests);
  console.log("All tests completed:", allTestsCompleted);

  // اگر تست فعالی وجود دارد، صفحه تست را نمایش بده
  if (activeTestSession && !activeTestSession.isCompleted) {
    const currentQuestion = activeTestSession.testData.questions[activeTestSession.currentQuestion];
    const isLastQuestion = activeTestSession.currentQuestion === activeTestSession.testData.questions.length - 1;
    const hasAnswer = activeTestSession.answers[currentQuestion.id] !== undefined;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800" dir="rtl">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTestSession(null)}
                className="flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                بازگشت به تست‌ها
              </Button>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {activeTestSession.testData.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  سوال {activeTestSession.currentQuestion + 1} از {activeTestSession.testData.questions.length}
                </p>
              </div>
              <div className="w-24"></div>
            </div>
            <Progress 
              value={((activeTestSession.currentQuestion + 1) / activeTestSession.testData.questions.length) * 100} 
              className="mt-4 h-3" 
            />
          </div>

          {/* Question Card */}
          <Card className="bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                سوال {activeTestSession.currentQuestion + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  {currentQuestion.text}
                </h3>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerQuestion(currentQuestion.id, index)}
                      className={`w-full p-4 text-right rounded-lg border-2 transition-all duration-200 ${
                        activeTestSession.answers[currentQuestion.id] === index
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{option}</span>
                        {activeTestSession.answers[currentQuestion.id] === index && (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={activeTestSession.currentQuestion === 0}
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              قبلی
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleCompleteTest}
                disabled={!hasAnswer}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <CheckCircle className="w-4 h-4" />
                تکمیل تست
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={!hasAnswer}
                className="flex items-center gap-2"
              >
                بعدی
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // اگر تست تکمیل شده، نتیجه را نمایش بده
  if (activeTestSession && activeTestSession.isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800" dir="rtl">
        <div className="container mx-auto px-4 py-8">
          <Card className="bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CheckCircle className="w-6 h-6 text-green-500" />
                تست {activeTestSession.testData.name} تکمیل شد!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">نمره شما: {activeTestSession.score}%</h3>
                <p className="text-green-700 dark:text-green-300">{activeTestSession.analysis}</p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => setActiveTestSession(null)}
                  className="flex-1"
                >
                  بازگشت به تست‌ها
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // صفحه اصلی تست‌های پیشنهادی
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                تست‌های پیشنهادی برای شما
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                بر اساس تحلیل غربالگری شما
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="max-w-lg mx-auto">
            <TestProgressIndicator 
              completedTests={completedTests}
              totalTests={suggestedTests.length}
            />
          </div>
        </div>

        {/* Tests Grid */}
        {suggestedTests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {suggestedTests.map((test, index) => (
            <Card 
              key={test.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                test.completed 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                  : 'bg-white/80 backdrop-blur-sm hover:bg-white'
              }`}
            >
              {test.completed && (
                <div className="absolute top-4 right-4">
                  <CheckmarkAnimation show={true} size="lg" />
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {getCategoryIcon(test.category)}
                      {test.name}
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {test.description}
                    </p>
                  </div>
                  <Badge className={getDifficultyColor(test.difficulty)}>
                    {test.difficulty}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>چرا این تست؟</strong><br />
                    {test.reason}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {test.estimatedTime}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {test.category}
                    </Badge>
                  </div>
                </div>

                <div className="pt-2">
                  {test.completed ? (
                    <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                      <CheckmarkAnimation show={true} size="md" />
                      <span className="font-medium">تکمیل شده</span>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => handleStartTest(test.id)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <ArrowLeft className="w-4 h-4 ml-2" />
                      شروع تست
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              در حال بارگذاری تست‌های پیشنهادی...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              لطفاً صبر کنید تا تست‌های مناسب برای شما آماده شوند.
            </p>
          </div>
        )}

        {/* Chat Section - Only show when all tests are completed */}
        {allTestsCompleted && suggestedTests.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-500" />
                چت با هوش مصنوعی
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                تمام تست‌های پیشنهادی تکمیل شدند. حالا می‌توانید با هوش مصنوعی گفتگو کنید.
              </p>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => window.location.href = '/dashboard/chat-ai'}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              >
                <MessageCircle className="w-4 h-4 ml-2" />
                شروع چت با هوش مصنوعی
              </Button>
            </CardContent>
          </Card>
        )}


        {/* Navigation */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {suggestedTests.length > 0 && completedTests === suggestedTests.length 
              ? "🎉 تبریک! همه تست‌ها تکمیل شدند"
              : suggestedTests.length > 0 
                ? "تست‌ها را یکی یکی انجام دهید تا تحلیل کاملی از خودتان دریافت کنید"
                : "در حال بارگذاری تست‌های پیشنهادی..."
            }
          </p>
        </div>

        {/* Completion Modal */}
        <CompletionModal 
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          completedTests={completedTests}
          totalTests={suggestedTests.length}
        />

        {/* Profile Completion Modal */}
        <ProfileCompletionModal
          isOpen={showProfileModal}
          onComplete={handleProfileComplete}
        />
      </div>
    </div>
  );
}