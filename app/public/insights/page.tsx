"use client";

import { useEffect, useState } from "react";

export default function PublicInsights() {
  const [data, setData] = useState<any>({ insights: [], stats: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/insights")
      .then((r) => r.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-10">
        <p className="text-gray-400 text-center">در حال بارگذاری بینش‌ها...</p>
      </div>
    );
  }

  if (!data.insights || data.insights.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-10">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🌍 Public Mental Health Insights
        </h1>
        <p className="text-gray-400 text-center">هنوز داده‌ای برای نمایش وجود ندارد.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🌍 Public Mental Health Insights
      </h1>

      {/* آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
          <h3 className="text-gray-400 text-sm mb-2">کل کاربران</h3>
          <p className="text-3xl font-bold text-indigo-400">{data.stats.totalUsers || 0}</p>
        </div>
        <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
          <h3 className="text-gray-400 text-sm mb-2">کل جلسات</h3>
          <p className="text-3xl font-bold text-purple-400">{data.stats.totalSessions || 0}</p>
        </div>
        <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
          <h3 className="text-gray-400 text-sm mb-2">میانگین خلق</h3>
          <p className="text-3xl font-bold text-green-400">{data.stats.averageMood || 0}/100</p>
        </div>
        <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
          <h3 className="text-gray-400 text-sm mb-2">جلسات درمانی</h3>
          <p className="text-3xl font-bold text-teal-400">{data.stats.therapySessions || 0}</p>
        </div>
      </div>

      {/* نمودار دسته‌بندی خلق */}
      <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-8">
        <h2 className="text-xl font-semibold mb-6 text-indigo-400">
          📊 توزیع میانگین خلق و خو
        </h2>
        
        <div className="space-y-4">
          {data.insights.map((insight: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded"></div>
                <span className="text-gray-300">{insight.category}</span>
                <span className="text-gray-500 text-sm">({insight.count} نمونه)</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${insight.average}%` }}
                  ></div>
                </div>
                <span className="text-indigo-400 font-mono w-12 text-right">
                  {insight.average}/100
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* اطلاعات تکمیلی */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4 text-teal-400">
            🔍 درباره این داده‌ها
          </h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• داده‌ها کاملاً ناشناس و محرمانه هستند</li>
            <li>• فقط آمار کلی و میانگین‌ها نمایش داده می‌شوند</li>
            <li>• آخرین بروزرسانی: {new Date(data.stats.lastUpdated).toLocaleDateString("fa-IR")}</li>
            <li>• این اطلاعات برای تحقیقات علمی سلامت روان استفاده می‌شود</li>
          </ul>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4 text-purple-400">
            🛡️ حریم خصوصی
          </h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• هیچ اطلاعات شخصی ذخیره نمی‌شود</li>
            <li>• داده‌ها فقط برای تحلیل‌های آماری استفاده می‌شوند</li>
            <li>• کاربران می‌توانند در هر زمان داده‌های خود را حذف کنند</li>
            <li>• تمام داده‌ها با استانداردهای امنیتی محافظت می‌شوند</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-400">
        <p>🔹 این داده‌ها کاملاً ناشناس هستند و از روند عمومی سلامت روان کاربران Testology به دست آمده‌اند.</p>
        <p>هدف: بهبود درک ما از سلامت روان جامعه و توسعه ابزارهای بهتر برای حمایت از سلامت ذهن.</p>
      </div>
    </div>
  );
}











