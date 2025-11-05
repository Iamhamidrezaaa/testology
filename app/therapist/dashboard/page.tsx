"use client";

import { useEffect, useState } from "react";

export default function TherapistDashboard() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const therapistId = "therapist-demo-1";

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      // بارگذاری جلسات
      const sessionsRes = await fetch(`/api/therapist/get-sessions?therapistId=${therapistId}`);
      const sessionsData = await sessionsRes.json();
      setSessions(sessionsData.sessions || []);

      // بارگذاری درآمد
      const earningsRes = await fetch(`/api/therapist/get-earnings?therapistId=${therapistId}`);
      const earningsData = await earningsRes.json();
      setEarnings(earningsData.earnings);
      setStats(earningsData.stats);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">در حال بارگذاری داشبورد...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          👩‍⚕️ Therapist Portal
        </h1>

        {/* کارت درآمد */}
        {earnings && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-center">
              <h2 className="text-2xl font-semibold text-white mb-2">
                💰 درآمد کل
              </h2>
              <p className="text-3xl font-bold text-white">
                {earnings.totalEarned.toLocaleString()} تومان
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-center">
              <h2 className="text-2xl font-semibold text-white mb-2">
                ⏳ در انتظار تسویه
              </h2>
              <p className="text-3xl font-bold text-white">
                {earnings.pending.toLocaleString()} تومان
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-center">
              <h2 className="text-2xl font-semibold text-white mb-2">
                📊 این ماه
              </h2>
              <p className="text-3xl font-bold text-white">
                {stats?.thisMonthEarnings.toLocaleString() || 0} تومان
              </p>
            </div>
          </div>
        )}

        {/* آمار کلی */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">
                📈 آمار جلسات
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">کل جلسات:</span>
                  <span className="text-emerald-400 font-semibold">{stats.totalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">این ماه:</span>
                  <span className="text-blue-400 font-semibold">{stats.thisMonthSessions}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-indigo-400 mb-4">
                🎯 عملکرد
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">میانگین درآمد/جلسه:</span>
                  <span className="text-teal-400 font-semibold">
                    {stats.totalSessions > 0 
                      ? Math.round(earnings?.totalEarned / stats.totalSessions).toLocaleString()
                      : 0} تومان
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">نرخ تأیید:</span>
                  <span className="text-green-400 font-semibold">100%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* لیست جلسات */}
        <div className="bg-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-emerald-400 mb-6">
            🗓️ جلسات آینده
          </h2>
          
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-400 text-lg">هنوز جلسه‌ای رزرو نشده است</p>
              <p className="text-gray-500 text-sm mt-2">جلسات جدید اینجا نمایش داده می‌شوند</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session: any) => (
                <div
                  key={session.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {session.user.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {session.user.name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            ID: {session.user.id}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">📅 تاریخ:</span>
                          <p className="text-white font-medium">
                            {new Date(session.date).toLocaleDateString('fa-IR')}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">🕐 زمان:</span>
                          <p className="text-white font-medium">{session.timeSlot}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">💻 نوع:</span>
                          <p className="text-white font-medium">
                            {session.mode === 'online' ? 'آنلاین' : 
                             session.mode === 'voice' ? 'صوتی' : 'متنی'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          session.confirmed 
                            ? "bg-green-600 text-white" 
                            : "bg-yellow-600 text-white"
                        }`}
                      >
                        {session.confirmed ? "✅ تأیید شده" : "⏳ در انتظار پرداخت"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* دکمه‌های عملیات */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={loadData}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold transition-all"
          >
            🔄 بروزرسانی
          </button>
          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-all"
          >
            📊 گزارش تفصیلی
          </button>
        </div>
      </div>
    </div>
  );
}