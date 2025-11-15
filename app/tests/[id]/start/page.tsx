"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronRight, ArrowLeft, Star, Brain, Heart, Moon, Zap, Target, Briefcase, Compass, Sparkles, ChevronLeft, AlertCircle, Check, Users } from "lucide-react";
import { getTestQuestions } from "@/app/data/test-questions";

// آیکون‌های تست‌ها
const testIcons: Record<string, React.ReactNode> = {
  mbti: <Brain className="w-8 h-8 text-indigo-500" />,
  phq9: <Moon className="w-8 h-8 text-blue-500" />,
  gad7: <Heart className="w-8 h-8 text-pink-500" />,
  eq: <Heart className="w-8 h-8 text-yellow-500" />,
  rosenberg: <Zap className="w-8 h-8 text-orange-500" />,
  focus: <Target className="w-8 h-8 text-rose-500" />,
  career: <Briefcase className="w-8 h-8 text-green-500" />,
  riasec: <Compass className="w-8 h-8 text-orange-400" />,
  creativity: <Sparkles className="w-8 h-8 text-purple-500" />,
  'problem-solving': <Brain className="w-8 h-8 text-indigo-400" />,
  'self-esteem-test': <Star className="w-8 h-8 text-purple-500" />,
  'stress-evaluation': <Zap className="w-8 h-8 text-orange-500" />,
  'anxiety-assessment': <Heart className="w-8 h-8 text-red-500" />,
  'depression-screening': <Moon className="w-8 h-8 text-blue-500" />,
  'sleep-quality': <Moon className="w-8 h-8 text-indigo-500" />,
  'social-anxiety': <Users className="w-8 h-8 text-pink-500" />,
  'relationship-satisfaction': <Heart className="w-8 h-8 text-rose-500" />,
  'motivation-assessment': <Zap className="w-8 h-8 text-yellow-500" />,
};

// نام‌های تست‌ها
const testNames: Record<string, string> = {
  mbti: "تست شخصیت‌شناسی MBTI",
  phq9: "تست افسردگی PHQ-9",
  gad7: "تست اضطراب GAD-7",
  eq: "تست هوش هیجانی EQ",
  rosenberg: "تست عزت نفس روزنبرگ",
  focus: "تست تمرکز و توجه",
  career: "تست آینده شغلی",
  riasec: "تست علاقه‌مندی شغلی RIASEC",
  creativity: "تست خلاقیت ذهنی",
  'problem-solving': "تست حل مسئله",
  'self-esteem-test': "تست اعتماد به نفس",
  'stress-evaluation': "تست استرس",
  'anxiety-assessment': "تست اضطراب",
  'depression-screening': "تست افسردگی",
  'sleep-quality': "تست کیفیت خواب",
  'social-anxiety': "تست اضطراب اجتماعی",
  'relationship-satisfaction': "تست رضایت از روابط",
  'motivation-assessment': "تست انگیزه",
};

export default function TestStartPage() {
  const params = useParams();
  const router = useRouter();
  const testId = (params?.id as string) || '';

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>("");
  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const [testScore, setTestScore] = useState<number | null>(null);

  // دریافت سوالات یونیک برای تست
  const questions = getTestQuestions(testId);
  
  // لاگ برای دیباگ (فقط در development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && questions.length > 0) {
      console.log(`[TEST START] Loaded ${questions.length} questions for test: ${testId}`);
      // بررسی تکراری‌ها
      const texts = questions.map(q => q.text).filter(Boolean);
      const uniqueTexts = new Set(texts);
      if (texts.length !== uniqueTexts.size) {
        console.warn(`[TEST START] ⚠️ Found ${texts.length - uniqueTexts.size} duplicate questions in ${testId}`);
      }
    }
  }, [testId, questions.length]);
  
  const currentQuestion = questions[index];
  const testName = testNames[testId] || "تست روان‌شناسی";
  const testIcon = testIcons[testId] || <Brain className="w-8 h-8 text-indigo-500" />;

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    setShowValidationMessage(false);
  };

  // تابع برای رفتن به سوال بعدی
  const goToNext = () => {
    if (answers[index] === undefined) {
      setShowValidationMessage(true);
      return;
    }
    
    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      setFinished(true);
      saveResults();
    }
  };

  // تابع برای رفتن به سوال قبلی
  const goToPrevious = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  // تابع برای ثبت نهایی تست
  const submitTest = () => {
    if (answers[index] === undefined) {
      setShowValidationMessage(true);
      return;
    }
    
    setFinished(true);
    saveResults();
  };

  // بررسی اینکه آیا همه سوالات پاسخ داده شده‌اند
  const allQuestionsAnswered = answers.filter((answer: any) => answer !== undefined).length === questions.length;

  const saveResults = async () => {
    setLoading(true);
    try {
      // تبدیل answers به فرمت مورد نیاز API جدید
      const formattedAnswers = answers.map((value: number, index: number) => ({
        questionId: index + 1,
        value: value || 0
      }));

      // دریافت userId از localStorage یا session
      let userId: string | null = null;
      try {
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        console.log("📋 Session data:", session);
        userId = session?.user?.id || session?.user?.email || localStorage.getItem("testology_userId");
        console.log("👤 Extracted userId:", userId);
      } catch (e) {
        console.warn("⚠️ Session fetch failed, using localStorage:", e);
        userId = localStorage.getItem("testology_userId") || localStorage.getItem("testology_email");
        console.log("👤 Using localStorage userId:", userId);
      }
      
      // گرفتن email از localStorage برای upsert کاربر در API
      const email = typeof window !== "undefined"
        ? (localStorage.getItem("testology_email") || undefined)
        : undefined;

      // برای MBTI از API مستقل استفاده کن
      const isMBTI = testId.toLowerCase() === 'mbti';
      
      if (isMBTI) {
        // API مستقل برای MBTI
        const payload = { answers: formattedAnswers, email: email };
        
        console.log("📧 [MBTI] Using email:", email || "undefined");
        console.log("📤 [MBTI] Submitting to /api/tests/mbti-submit", {
          answersCount: formattedAnswers.length,
          email: email || "undefined",
        });

        const submitResponse = await fetch("/api/tests/mbti-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (submitResponse.ok) {
          const data = await submitResponse.json();
          console.log("✅ [MBTI] Response:", data);
          console.log("💾 [MBTI] Saved status:", data.saved);

          // ذخیره score از API
          if (data.result?.totalScore !== undefined) {
            setTestScore(data.result.totalScore);
          } else if (data.result?.score !== undefined) {
            setTestScore(data.result.score);
          }

          // ✅ کلیدی: فقط بر اساس data.saved تصمیم بگیر
          if (data.saved === true) {
            // اگر ذخیره شد، interpretation را نمایش بده
            if (data.result?.interpretation && Array.isArray(data.result.interpretation)) {
              const interpretationText = data.result.interpretation
                .map((chunk: any) => chunk.body || chunk.title || '')
                .filter(Boolean)
                .join('\n\n');
              if (interpretationText) {
                setAnalysis(interpretationText);
              } else {
                setAnalysis("نتایج شما با موفقیت ذخیره شد ✅");
              }
            } else {
              setAnalysis("نتایج شما با موفقیت ذخیره شد ✅");
            }
          } else {
            // اگر ذخیره نشد
            setAnalysis("نتایج محاسبه شد اما ذخیره نشد (احتمالاً خطا در سرور)");
            
            // اگر interpretation وجود دارد، آن را هم نمایش بده
            if (data.result?.interpretation && Array.isArray(data.result.interpretation)) {
              const interpretationText = data.result.interpretation
                .map((chunk: any) => chunk.body || chunk.title || '')
                .filter(Boolean)
                .join('\n\n');
              if (interpretationText) {
                setAnalysis(interpretationText + "\n\n⚠️ " + "نتایج محاسبه شد اما ذخیره نشد (احتمالاً خطا در سرور)");
              }
            }
          }
        } else {
          const errorData = await submitResponse.json().catch(() => ({}));
          console.error('❌ [MBTI] خطا در ذخیره نتایج:', errorData);
          setAnalysis(`خطا در ذخیره نتایج: ${errorData.error || errorData.details || 'خطای ناشناخته'}`);
        }
        
        setLoading(false);
        return; // برای MBTI اینجا تمام می‌شود
      }

      // برای سایر تست‌ها از API generic استفاده کن
      const apiEndpoint = `/api/tests/${testId}/submit`;
      const requestBody = { answers: formattedAnswers, userId: userId, email: email };

      console.log(`📤 Submitting to ${apiEndpoint}`, {
        testId,
        hasEmail: !!email,
        hasUserId: !!userId,
      });

      const submitResponse = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (submitResponse.ok) {
        const data = await submitResponse.json();
        console.log(`✅ نتیجه ${testId} ذخیره شد`, data);
        console.log(`💾 Saved status: ${data.saved}`);
        
        // ذخیره score از API
        if (data.result?.totalScore !== undefined) {
          setTestScore(data.result.totalScore);
        } else if (data.result?.score !== undefined) {
          setTestScore(data.result.score);
        }
        
        // ✅ کلیدی: فقط بر اساس data.saved تصمیم بگیر، نه userId
        if (data.saved === true) {
          // اگر ذخیره شد، interpretation را نمایش بده
          if (data.result?.interpretation && Array.isArray(data.result.interpretation)) {
            const interpretationText = data.result.interpretation
              .map((chunk: any) => chunk.body || chunk.title || '')
              .filter(Boolean)
              .join('\n\n');
            if (interpretationText) {
              setAnalysis(interpretationText);
            } else {
              setAnalysis("نتایج شما با موفقیت ذخیره شد ✅");
            }
          } else {
            setAnalysis("نتایج شما با موفقیت ذخیره شد ✅");
          }
        } else {
          // اگر ذخیره نشد (saved === false یا undefined)
          setAnalysis("نتایج محاسبه شد اما ذخیره نشد (احتمالاً userId وجود ندارد)");
          
          // اگر interpretation وجود دارد، آن را هم نمایش بده
          if (data.result?.interpretation && Array.isArray(data.result.interpretation)) {
            const interpretationText = data.result.interpretation
              .map((chunk: any) => chunk.body || chunk.title || '')
              .filter(Boolean)
              .join('\n\n');
            if (interpretationText) {
              setAnalysis(interpretationText + "\n\n⚠️ " + "نتایج محاسبه شد اما ذخیره نشد (احتمالاً userId وجود ندارد)");
            }
          }
        }
      } else {
        const errorData = await submitResponse.json().catch(() => ({}));
        console.error('❌ خطا در ذخیره نتایج:', errorData);
        setAnalysis(`خطا در ذخیره نتایج: ${errorData.error || errorData.details || 'خطای ناشناخته'}`);
      }
    } catch (error: any) {
      console.error('Error saving results:', error);
      setAnalysis(`خطا در ذخیره نتایج: ${error.message || 'خطای ناشناخته'}`);
    } finally {
      setLoading(false);
    }
  };

  const calcScore = () => {
    const total = answers.reduce((a: any, b: any) => a + (b || 0), 0);
    return Math.round((total / (questions.length * 4)) * 100);
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { level: "عالی", color: "text-green-600", bg: "bg-green-100" };
    if (score >= 60) return { level: "خوب", color: "text-blue-600", bg: "bg-blue-100" };
    if (score >= 40) return { level: "متوسط", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { level: "نیاز به بهبود", color: "text-red-600", bg: "bg-red-100" };
  };

  if (finished) {
    // استفاده از score از API اگر موجود باشد، در غیر این صورت از calcScore
    const score = testScore !== null ? Math.round(testScore) : calcScore();
    const scoreInfo = getScoreLevel(score);
    
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-950 dark:to-gray-900 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 text-center max-w-2xl w-full"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            {testIcon}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              تست به پایان رسید 🎉
            </h2>
          </div>
          
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            نمره شما در تست <b>{testName}</b> برابر است با:
          </p>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">
              {score}%
            </div>
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${scoreInfo.bg} ${scoreInfo.color}`}>
              {scoreInfo.level}
            </div>
          </motion.div>

          {loading ? (
            <div className="mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">در حال ذخیره نتایج...</p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-700 dark:text-green-300 font-semibold">
                {analysis || "نتایج شما با موفقیت در سیستم ذخیره شد ✅"}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/tests')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              بازگشت به تست‌ها
            </button>
            <button
              onClick={async () => {
                try {
                  // گرفتن email از localStorage یا session
                  let email: string | null = null;
                  try {
                    const sessionRes = await fetch('/api/auth/session');
                    const session = await sessionRes.json();
                    email = session?.user?.email || localStorage.getItem("testology_email");
                  } catch (e) {
                    email = localStorage.getItem("testology_email");
                  }

                  // ارسال درخواست با فرمت جدید (testId + email) یا فرمت قدیمی (fallback)
                  const response = await fetch('/api/export-test-result', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      testId: testId,
                      testSlug: testId,
                      email: email,
                      // fallback به فرمت قدیمی
                      testName: testName,
                      score: testScore !== null ? testScore : score,
                      analysis: analysis,
                    })
                  });
                  
                  if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `testology-${testId}-${Date.now()}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  } else {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('PDF export error:', errorData);
                    alert(`خطا در دانلود PDF: ${errorData.error || 'خطای ناشناخته'}`);
                  }
                } catch (error) {
                  console.error('PDF export error:', error);
                  alert('خطا در دانلود PDF. لطفاً دوباره تلاش کنید.');
                }
              }}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-200"
            >
              <Star className="w-4 h-4" />
              دانلود PDF
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-950 dark:to-gray-900 px-6">
      {/* هدر تست */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          {testIcon}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{testName}</h1>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-md mx-auto">
          <motion.div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((index + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          سؤال {index + 1} از {questions.length}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 max-w-2xl w-full"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-8 leading-relaxed text-center">
            {currentQuestion.text}
          </h2>

          <div className="grid grid-cols-5 gap-3 mb-6">
            {[0, 1, 2, 3, 4].map((value) => (
              <button
                key={value}
                onClick={() => handleAnswer(value)}
                className={`p-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                  answers[index] === value
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700"
                }`}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            <span>کاملاً مخالفم</span>
            <span>کاملاً موافقم</span>
          </div>

          {/* پیام اعتبارسنجی */}
          {showValidationMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 dark:text-red-300 text-sm">
                لطفاً قبل از ادامه، به این سوال پاسخ دهید. پاسخ‌دهی به همه سوالات ضروری است.
              </span>
            </motion.div>
          )}

          {/* دکمه‌های ناوبری */}
          <div className="flex justify-between items-center">
            {/* دکمه قبلی */}
            <button
              onClick={goToPrevious}
              disabled={index === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                index === 0
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              مرحله قبل
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* دکمه‌های بعدی/ثبت */}
            <div className="flex gap-2">
              {index < questions.length - 1 ? (
                <button
                  onClick={goToNext}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  مرحله بعد
                </button>
              ) : (
                <button
                  onClick={submitTest}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                >
                  <Check className="w-4 h-4" />
                  ثبت نهایی
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
