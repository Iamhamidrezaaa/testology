"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function TherapistAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [trend, setTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const therapistId = "therapist-demo-1";

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);
    try {
      const response = await fetch(`/api/therapist/get-analytics?therapistId=${therapistId}`);
      const data = await response.json();
      
      setAnalytics(data.analytics);
      setTrend(data.trend || []);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">در حال بارگذاری تحلیل عملکرد...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">داده‌ای برای نمایش وجود ندارد</p>
          <p className="text-gray-500 text-sm mt-2">بعد از دریافت بازخورد از بیماران، آمار اینجا نمایش داده می‌شود</p>
        </div>
      </div>
    );
  }

  const performanceColor = analytics.avgRating >= 4 ? "text-green-400" : 
                          analytics.avgRating >= 3 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          📊 تحلیل عملکرد درمانگر
        </h1>

        {/* کارت‌های اصلی */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-center">
            <h2 className="text-xl text-white mb-2">⭐ میانگین رضایت</h2>
            <p className="text-3xl font-bold text-white">
              {analytics.avgRating.toFixed(1)}/5
            </p>
            <p className="text-sm text-purple-200 mt-1">
              {analytics.avgRating >= 4 ? "عالی" : analytics.avgRating >= 3 ? "خوب" : "نیاز به بهبود"}
            </p>
          </div>

          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-center">
            <h2 className="text-xl text-white mb-2">🧠 کیفیت جلسات (AI)</h2>
            <p className="text-3xl font-bold text-white">
              {(analytics.avgAIScore * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-emerald-200 mt-1">
              ارزیابی هوش مصنوعی
            </p>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-center">
            <h2 className="text-xl text-white mb-2">📈 اثر روانی جلسات</h2>
            <p className="text-3xl font-bold text-white">
              {(analytics.avgSessionImpact * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-indigo-200 mt-1">
              بهبود سنجیده شده
            </p>
          </div>

          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 text-center">
            <h2 className="text-xl text-white mb-2">🔁 وفاداری بیماران</h2>
            <p className="text-3xl font-bold text-white">
              {(analytics.retentionRate * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-teal-200 mt-1">
              نرخ بازگشت بیماران
            </p>
          </div>
        </div>

        {/* آمار کلی */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-purple-400 mb-4">
              📊 آمار کلی
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">کل جلسات:</span>
                <span className="text-emerald-400 font-semibold">{analytics.totalSessions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">امتیاز کلی:</span>
                <span className={`font-semibold ${performanceColor}`}>
                  {((analytics.avgRating / 5) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">سطح عملکرد:</span>
                <span className="text-blue-400 font-semibold">
                  {analytics.avgRating >= 4 ? "عالی" : 
                   analytics.avgRating >= 3 ? "خوب" : "نیاز به بهبود"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-indigo-400 mb-4">
              🎯 کیفیت جلسات
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">امتیاز AI:</span>
                <span className="text-purple-400 font-semibold">
                  {(analytics.avgAIScore * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">اثر روانی:</span>
                <span className="text-teal-400 font-semibold">
                  {(analytics.avgSessionImpact * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">رضایت بیماران:</span>
                <span className="text-green-400 font-semibold">
                  {(analytics.avgRating * 20).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-emerald-400 mb-4">
              📈 روند عملکرد
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">وفاداری:</span>
                <span className="text-cyan-400 font-semibold">
                  {(analytics.retentionRate * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">بازخوردها:</span>
                <span className="text-yellow-400 font-semibold">
                  {trend.length} مورد
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">وضعیت:</span>
                <span className="text-green-400 font-semibold">
                  فعال
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* نمودار روند */}
        {trend.length > 0 && (
          <div className="bg-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-purple-400 mb-6 text-center">
              📈 روند کیفیت جلسات اخیر
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trend}>
                <XAxis 
                  dataKey="date" 
                  stroke="#aaa" 
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('fa-IR')}
                />
                <YAxis 
                  stroke="#aaa" 
                  domain={[0, 1]}
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `${(value * 100).toFixed(1)}%`, 
                    name === 'aiScore' ? 'کیفیت AI' : 
                    name === 'sessionImpact' ? 'اثر روانی' : 'امتیاز'
                  ]}
                  labelFormatter={(value) => `تاریخ: ${new Date(value).toLocaleDateString('fa-IR')}`}
                />
                <Line
                  type="monotone"
                  dataKey="aiScore"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  name="کیفیت AI"
                />
                <Line
                  type="monotone"
                  dataKey="sessionImpact"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  name="اثر روانی"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* دکمه‌های عملیات */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={loadAnalytics}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-all"
          >
            🔄 بروزرسانی آمار
          </button>
          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-all"
          >
            📊 گزارش تفصیلی
          </button>
          <button
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold transition-all"
          >
            📈 تحلیل پیشرفته
          </button>
        </div>

        {/* راهنمای تفسیر */}
        <div className="mt-8 bg-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">
            📋 راهنمای تفسیر آمار
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
            <div>
              <p><strong>⭐ میانگین رضایت:</strong> امتیاز 1-5 از بیماران</p>
              <p><strong>🧠 کیفیت جلسات:</strong> ارزیابی AI از کیفیت درمان</p>
            </div>
            <div>
              <p><strong>📈 اثر روانی:</strong> میزان بهبود سنجیده شده</p>
              <p><strong>🔁 وفاداری:</strong> درصد بیماران بازگشتی</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}











