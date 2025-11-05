"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Users, Download, CheckCircle, XCircle, BarChart3, PieChart, MapPin, Calendar } from "lucide-react";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from "recharts";

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow text-center">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [newsletterStats, setNewsletterStats] = useState({
    total: 0,
    active: 0,
    recent: []
  });
  const [userAnalytics, setUserAnalytics] = useState({
    totalUsers: 0,
    usersWithCompleteProfile: 0,
    profileCompletionRate: 0,
    ageGroups: [],
    provinces: [],
    cities: [],
    stats: {
      totalUsers: 0,
      completeProfiles: 0,
      incompleteProfiles: 0,
      averageAge: 0,
      mostCommonProvince: '',
      mostCommonCity: ''
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const r = localStorage.getItem("testology_role");
    if (!r) router.push("/login");
    if (r === "user") router.push("/dashboard");
    setRole(r || "");
    
    fetchNewsletterStats();
    fetchStats();
    fetchUserAnalytics();
  }, [router]);

  const fetchNewsletterStats = async () => {
    try {
      const response = await fetch("/api/newsletter");
      const data = await response.json();
      
      if (response.ok) {
        setNewsletterStats({
          total: data.totalSubscribers || 0,
          active: data.recentSubscribers?.filter((s: any) => s.isActive).length || 0,
          recent: data.recentSubscribers?.slice(0, 5) || []
        });
      }
    } catch (error) {
      console.error("Error fetching newsletter stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      
      if (response.ok) {
        setStats({
          users: data.users || 0,
          tests: data.tests || 0,
          activeToday: data.activeToday || 0,
          avgSatisfaction: `${data.avgSatisfaction || 0}%`,
          articles: data.articles || 0,
          blogs: data.blogs || 0,
          testResults: data.testResults || 0
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUserAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/user-analytics");
      const data = await response.json();
      
      if (data.success) {
        setUserAnalytics(data.analytics);
      }
    } catch (error) {
      console.error("Error fetching user analytics:", error);
    }
  };

  const exportNewsletter = async () => {
    try {
      const response = await fetch("/api/newsletter/export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const [stats, setStats] = useState({
    users: 0,
    tests: 0,
    activeToday: 0,
    avgSatisfaction: "0%",
    articles: 0,
    blogs: 0,
    testResults: 0
  });

  return (
    <div className="space-y-6">
          <div className="container mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-indigo-600">داشبورد مدیر کل 🧠</h1>
              <div className="flex gap-3">
                <a
                  href="/admin/ai-center"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  AI Center
                </a>
                <button
                  onClick={() => {
                    localStorage.removeItem("testology_role");
                    localStorage.removeItem("testology_email");
                    router.push("/login");
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  خروج
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="کل کاربران" value={stats.users} />
              <StatCard title="تعداد تست‌ها" value={stats.tests} />
              <StatCard title="فعال امروز" value={stats.activeToday} />
              <StatCard title="رضایت میانگین" value={stats.avgSatisfaction} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="مقالات منتشر شده" value={stats.articles || 0} />
              <StatCard title="بلاگ‌های فعال" value={stats.blogs || 0} />
              <StatCard title="نتایج تست" value={stats.testResults || 0} />
              <StatCard title="نرخ مشارکت" value="87%" />
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-3">روند کاربران و تست‌ها (۳۰ روز)</h3>
              <div className="h-48 flex items-center justify-center text-gray-400">
                [نمودار خطی - Demo]
              </div>
            </div>

            {/* Newsletter Management */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">مدیریت خبرنامه 📧</h3>
                <button
                  onClick={exportNewsletter}
                  className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                >
                  <Download className="w-4 h-4" />
                  دانلود CSV
                </button>
              </div>
              
              {/* Newsletter Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">کل اعضا</p>
                      <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                        {loading ? "..." : newsletterStats.total}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400">فعال</p>
                      <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                        {loading ? "..." : newsletterStats.active}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-400">نرخ عضویت</p>
                      <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                        {newsletterStats.total > 0 ? Math.round((newsletterStats.active / newsletterStats.total) * 100) : 0}%
                      </p>
                    </div>
                    <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Recent Subscribers */}
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">اعضای اخیر</h4>
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    ))}
                  </div>
                ) : newsletterStats.recent.length > 0 ? (
                  <div className="space-y-2">
                    {newsletterStats.recent.map((subscriber: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{subscriber.email}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          subscriber.isActive 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {subscriber.isActive ? 'فعال' : 'غیرفعال'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">هنوز عضوی در خبرنامه وجود ندارد</p>
                )}
              </div>
            </div>

            {/* آمار کاربران */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  آمار کاربران
                </h3>
              </div>
              
              {/* آمار کلی */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">کل کاربران</p>
                      <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                        {userAnalytics.totalUsers}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400">پروفایل کامل</p>
                      <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                        {userAnalytics.usersWithCompleteProfile}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-400">نرخ تکمیل</p>
                      <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                        {userAnalytics.profileCompletionRate}%
                      </p>
                    </div>
                    <PieChart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 dark:text-orange-400">میانگین سن</p>
                      <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                        {userAnalytics.stats.averageAge} سال
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>

              {/* نمودارهای آمار */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* نمودار سنی */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    توزیع سنی کاربران
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={userAnalytics.ageGroups}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                        >
                          {userAnalytics.ageGroups.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* نمودار استان‌ها */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    توزیع جغرافیایی (استان‌ها)
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={userAnalytics.provinces}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* اطلاعات تکمیلی */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">پرطرفدارترین استان</h5>
                  <p className="text-blue-600 dark:text-blue-400">{userAnalytics.stats.mostCommonProvince || 'نامشخص'}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">پرطرفدارترین شهر</h5>
                  <p className="text-green-600 dark:text-green-400">{userAnalytics.stats.mostCommonCity || 'نامشخص'}</p>
                </div>
              </div>
            </div>

            {/* مدیریت مقالات */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">مدیریت مقالات 📝</h3>
                <Link
                  href="/admin/blog"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  مدیریت مقالات
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600">📚</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">مقالات بلاگ</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">مدیریت محتوای بلاگ</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <span className="text-green-600">✍️</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">تولید محتوا</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ایجاد و ویرایش مقالات</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* آمار و تحلیل */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">آمار و تحلیل 📊</h3>
                <Link
                  href="/admin/analytics"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
                >
                  مشاهده آمار
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600">📈</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">گزارش‌های پیشرفته</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">آمار کاربران، تست‌ها و مقالات</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600">🌍</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">آمار جغرافیایی</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">توزیع کاربران در کشورها</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* کتابخانه رسانه */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">کتابخانه رسانه 📁</h3>
                <Link
                  href="/admin/media"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                >
                  مدیریت رسانه
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                      <span className="text-indigo-600">🖼️</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">تصاویر و ویدیوها</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">مدیریت فایل‌های رسانه‌ای</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                      <span className="text-teal-600">📚</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">اسناد و فایل‌ها</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">آپلود و سازماندهی فایل‌ها</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-3">اعلان‌ها</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>🧠 کاربر جدید ثبت‌نام کرد: user42@testology.me</li>
                <li>⚙️ سیستم GPT پاسخ تحلیلی ارسال کرد.</li>
                <li>📧 {newsletterStats.total} عضو در خبرنامه</li>
                <li>📝 100+ مقاله جامع روان‌شناسی اضافه شد</li>
              </ul>
            </div>
          </div>
    </div>
  );
}