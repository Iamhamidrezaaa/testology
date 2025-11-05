"use client";

import { useEffect, useState } from "react";

export default function TherapyMemoryPage({ params }: { params: { userId: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/get-therapy-memory?userId=${params.userId}`)
      .then((r) => r.json())
      .then((res) => {
        setData(res.memory);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-10">
        <p className="text-gray-400 text-center">در حال بارگذاری حافظه...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-10">
        <h1 className="text-3xl font-bold mb-6">🧠 حافظه گفت‌وگویی کاربر</h1>
        <p className="text-gray-400 text-center">هیچ حافظه‌ای برای این کاربر یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🧠 حافظه گفت‌وگویی کاربر</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* خلاصه کلی */}
          <div className="bg-white/10 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold text-purple-400 mb-4 flex items-center">
              📝 خلاصه کلی
              <span className="ml-2 text-sm text-gray-400">
                ({new Date(data.lastUpdated).toLocaleDateString("fa-IR")})
              </span>
            </h2>
            <div className="text-gray-300 leading-relaxed whitespace-pre-line">
              {data.summary}
            </div>
          </div>

          {/* نکات کلیدی */}
          <div className="bg-white/10 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold text-indigo-400 mb-4 flex items-center">
              🔍 نکات کلیدی
            </h2>
            <div className="text-gray-300 leading-relaxed">
              {data.keyInsights || "هیچ نکته کلیدی ثبت نشده است."}
            </div>
          </div>
        </div>

        {/* تگ‌های احساسی */}
        <div className="mt-6 bg-white/10 p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold text-teal-400 mb-4 flex items-center">
            🏷️ تگ‌های احساسی
          </h2>
          <div className="flex gap-3 flex-wrap">
            {data.emotionTags && data.emotionTags.length > 0 ? (
              data.emotionTags.map((tag: string, i: number) => (
                <span 
                  key={i} 
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-gray-400">هیچ تگ احساسی ثبت نشده است.</span>
            )}
          </div>
        </div>

        {/* آمار حافظه */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 p-4 rounded-xl text-center">
            <h3 className="text-gray-400 text-sm mb-2">تاریخ ایجاد</h3>
            <p className="text-lg font-semibold text-green-400">
              {new Date(data.createdAt).toLocaleDateString("fa-IR")}
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl text-center">
            <h3 className="text-gray-400 text-sm mb-2">آخرین بروزرسانی</h3>
            <p className="text-lg font-semibold text-blue-400">
              {new Date(data.lastUpdated).toLocaleDateString("fa-IR")}
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl text-center">
            <h3 className="text-gray-400 text-sm mb-2">تعداد تگ‌ها</h3>
            <p className="text-lg font-semibold text-purple-400">
              {data.emotionTags ? data.emotionTags.length : 0}
            </p>
          </div>
        </div>

        {/* راهنمای استفاده */}
        <div className="mt-8 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-6 rounded-xl border border-indigo-500/20">
          <h3 className="text-lg font-semibold text-indigo-300 mb-3">
            💡 راهنمای استفاده از حافظه
          </h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• این حافظه به درمانگر کمک می‌کند تا گفت‌وگوهای گذشته را به یاد آورد</li>
            <li>• تگ‌های احساسی الگوهای هیجانی کاربر را نشان می‌دهند</li>
            <li>• نکات کلیدی شامل محرک‌ها، پیشرفت‌ها و نگرانی‌های تکرارشونده است</li>
            <li>• حافظه به‌صورت خودکار پس از هر جلسه درمانی به‌روزرسانی می‌شود</li>
          </ul>
        </div>
      </div>
    </div>
  );
}











