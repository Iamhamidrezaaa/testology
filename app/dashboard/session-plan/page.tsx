"use client";

import { useState, useEffect } from "react";

export default function SessionPlan() {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [context, setContext] = useState<any>(null);
  const [userId] = useState("demo-user-123"); // در آینده از authentication بیاید

  async function generatePlan() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-session-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      
      const data = await res.json();
      if (data.success) {
        setPlan(data.plan);
        setContext(data.context);
      } else {
        console.error("Failed to generate plan:", data.error);
      }
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    generatePlan();
  }, []);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-400";
    if (confidence >= 0.6) return "text-yellow-400";
    return "text-red-400";
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return "عالی";
    if (confidence >= 0.6) return "خوب";
    return "متوسط";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-10">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">در حال تهیه برنامه جلسه...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-10">
        <h1 className="text-3xl font-bold mb-6 text-center">🧭 برنامه جلسه بعد</h1>
        <div className="text-center">
          <p className="text-gray-400 mb-4">خطا در تولید برنامه جلسه</p>
          <button
            onClick={generatePlan}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl"
          >
            🔄 تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🧭 برنامه جلسه بعد</h1>

        {/* برنامه اصلی */}
        <div className="bg-white/10 border border-white/10 rounded-2xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-purple-400">
              🎯 {plan.topic}
            </h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(plan.aiConfidence)} bg-white/10`}>
              اطمینان: {getConfidenceText(plan.aiConfidence)} ({(plan.aiConfidence * 100).toFixed(0)}%)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-indigo-400 mb-3 flex items-center">
                🧠 تمرکز درمانی
              </h3>
              <p className="text-gray-300 leading-relaxed">{plan.focusArea}</p>
            </div>

            {plan.suggestedTest && (
              <div className="bg-white/5 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-teal-400 mb-3 flex items-center">
                  🧩 تست پیشنهادی
                </h3>
                <p className="text-gray-300 leading-relaxed">{plan.suggestedTest}</p>
              </div>
            )}
          </div>

          <div className="mt-6 bg-gradient-to-r from-green-900/30 to-blue-900/30 p-6 rounded-xl border border-green-500/20">
            <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
              🌿 تمرین روزانه
            </h3>
            <p className="text-gray-300 leading-relaxed">{plan.dailyPractice}</p>
          </div>
        </div>

        {/* آمار زمینه */}
        {context && (
          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">📊 آمار زمینه</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {context.hasMemory ? "✅" : "❌"}
                </div>
                <div className="text-gray-400">حافظه درمانی</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-400">
                  {context.emotionCount}
                </div>
                <div className="text-gray-400">تحلیل احساسات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-400">
                  {context.moodCount}
                </div>
                <div className="text-gray-400">روند خلق و خو</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {context.hasPreviousPlan ? "✅" : "❌"}
                </div>
                <div className="text-gray-400">برنامه قبلی</div>
              </div>
            </div>
          </div>
        )}

        {/* دکمه‌های عملیات */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={generatePlan}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
          >
            🔄 تولید برنامه جدید
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
          >
            🖨️ چاپ برنامه
          </button>
        </div>

        {/* راهنمای استفاده */}
        <div className="mt-8 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-6 rounded-xl border border-indigo-500/20">
          <h3 className="text-lg font-semibold text-indigo-300 mb-3">
            💡 راهنمای استفاده از برنامه جلسه
          </h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• این برنامه بر اساس تاریخچه درمانی و احساسات شما تولید شده است</li>
            <li>• تمرکز درمانی به مهم‌ترین نیازهای روانی شما اشاره دارد</li>
            <li>• تمرین روزانه را به‌طور منظم انجام دهید تا بیشترین تأثیر را ببینید</li>
            <li>• در صورت نیاز، تست پیشنهادی را انجام دهید تا اطلاعات بیشتری کسب کنید</li>
          </ul>
        </div>
      </div>
    </div>
  );
}











