'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TestTube, 
  FileText, 
  Eye, 
  TrendingUp, 
  Globe, 
  Smartphone, 
  Monitor,
  Chrome,
  Clock,
  Calendar,
  BarChart3,
  Activity,
  ArrowUp,
  ArrowDown,
  Target,
  Zap,
  Star,
  Heart,
  Share2,
  MessageCircle
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalTests: number;
    totalArticles: number;
    totalViews: number;
  };
  userStats: {
    total: number;
    active: number;
    new: number;
    returning: number;
    premium: number;
    free: number;
  };
  testStats: {
    total: number;
    completed: number;
    averageTime: number;
    completionRate: number;
    satisfaction: number;
  };
  articleStats: {
    total: number;
    published: number;
    draft: number;
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
  monthlyData: Array<{
    month: string;
    users: number;
    tests: number;
    articles: number;
    revenue: number;
  }>;
  geoData: Array<{
    country: string;
    users: number;
    percentage: number;
  }>;
  deviceData: Array<{
    device: string;
    users: number;
    percentage: number;
  }>;
  browserData: Array<{
    browser: string;
    users: number;
    percentage: number;
  }>;
  hourlyData: Array<{
    hour: number;
    users: number;
    tests: number;
  }>;
  weeklyData: Array<{
    day: string;
    users: number;
    tests: number;
  }>;
}

// کامپوننت نمودار خطی
const LineChart = ({ data, title, color = "blue" }: { data: Array<{label: string, value: number}>, title: string, color?: string }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500", 
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    red: "bg-red-500"
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="h-48 flex items-end justify-between gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className={`w-full ${colors[color as keyof typeof colors]} rounded-t-lg transition-all duration-500 hover:opacity-80`}
              style={{ height: `${(item.value / maxValue) * 100}%` }}
              title={`${item.label}: ${item.value.toLocaleString()}`}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// کامپوننت نمودار دایره‌ای
const PieChart = ({ data, title }: { data: Array<{label: string, value: number, color: string}>, title: string }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const startAngle = cumulativePercentage * 3.6;
              const endAngle = (cumulativePercentage + percentage) * 3.6;
              cumulativePercentage += percentage;
              
              const radius = 80;
              const x1 = 96 + radius * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 96 + radius * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 96 + radius * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 96 + radius * Math.sin((endAngle * Math.PI) / 180);
              const largeArcFlag = percentage > 50 ? 1 : 0;
              
              return (
                <path
                  key={index}
                  d={`M 96 96 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={item.color}
                  className="transition-all duration-500 hover:opacity-80"
                />
              );
            })}
          </svg>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
            </div>
            <span className="text-sm font-semibold">{item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// کامپوننت نمودار میله‌ای
const BarChart = ({ data, title, color = "blue" }: { data: Array<{label: string, value: number}>, title: string, color?: string }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500", 
    orange: "bg-orange-500",
    red: "bg-red-500"
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-20 text-sm text-gray-600 dark:text-gray-400">{item.label}</div>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden">
              <div 
                className={`h-full ${colors[color as keyof typeof colors]} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                {item.value.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// کامپوننت کارت آمار با انیمیشن
const AnimatedStatCard = ({ title, value, icon: Icon, color, trend, trendValue }: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-all duration-500 transform ${
      isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-1 ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3 ${color} rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics/static');
      
      if (!response.ok) {
        throw new Error('خطا در دریافت آمار');
      }
      
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای نامشخص');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">در حال بارگذاری آمار...</div>
        </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">خطا: {error}</div>
        </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">داده‌ای یافت نشد</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
      {/* هدر */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            آمار و تحلیل
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            گزارش‌های پیشرفته و آمار کلی سیستم
          </p>
        </div>

        {/* آمار کلی با انیمیشن */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnimatedStatCard
            title="کل کاربران"
            value={analytics.overview.totalUsers}
            icon={Users}
            color="bg-blue-500"
            trend="up"
            trendValue="+12%"
          />
          <AnimatedStatCard
            title="کل تست‌ها"
            value={analytics.overview.totalTests}
            icon={TestTube}
            color="bg-green-500"
            trend="up"
            trendValue="+8%"
          />
          <AnimatedStatCard
            title="کل مقالات"
            value={analytics.overview.totalArticles}
            icon={FileText}
            color="bg-purple-500"
            trend="up"
            trendValue="+15%"
          />
          <AnimatedStatCard
            title="کل بازدید"
            value={analytics.overview.totalViews}
            icon={Eye}
            color="bg-orange-500"
            trend="up"
            trendValue="+22%"
          />
      </div>

        {/* نمودارهای اصلی */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* نمودار خطی آمار ماهانه */}
          <LineChart
            data={analytics.monthlyData.slice(-6).map(month => ({
              label: month.month,
              value: month.users
            }))}
            title="رشد کاربران در 6 ماه اخیر"
            color="blue"
          />

          {/* نمودار دایره‌ای توزیع کاربران */}
          <PieChart
            data={[
              { label: 'کاربران فعال', value: analytics.userStats.active, color: '#10B981' },
              { label: 'کاربران جدید', value: analytics.userStats.new, color: '#3B82F6' },
              { label: 'کاربران بازگشتی', value: analytics.userStats.returning, color: '#8B5CF6' },
              { label: 'کاربران پریمیوم', value: analytics.userStats.premium, color: '#F59E0B' }
            ]}
            title="توزیع کاربران"
          />
              </div>

        {/* نمودارهای آمار تست‌ها و مقالات */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BarChart
            data={[
              { label: 'تکمیل', value: analytics.testStats.completed },
              { label: 'متوسط', value: Math.floor(analytics.testStats.completed * 0.7) },
              { label: 'کم', value: Math.floor(analytics.testStats.completed * 0.3) }
            ]}
            title="آمار تست‌ها"
            color="green"
          />

          <BarChart
            data={[
              { label: 'بازدید', value: analytics.articleStats.views },
              { label: 'لایک', value: analytics.articleStats.likes },
              { label: 'اشتراک', value: analytics.articleStats.shares },
              { label: 'نظر', value: analytics.articleStats.comments }
            ]}
            title="تعامل با مقالات"
            color="purple"
          />
      </div>

        {/* کارت‌های آمار مقالات با آیکون‌های جذاب */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">کل مقالات</p>
                <p className="text-3xl font-bold">{analytics.articleStats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">منتشر شده</p>
                <p className="text-3xl font-bold">{analytics.articleStats.published}</p>
              </div>
              <Target className="w-8 h-8 text-green-200" />
            </div>
      </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">بازدید</p>
                <p className="text-3xl font-bold">{analytics.articleStats.views.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100">لایک</p>
                <p className="text-3xl font-bold">{analytics.articleStats.likes.toLocaleString()}</p>
              </div>
              <Heart className="w-8 h-8 text-pink-200" />
            </div>
          </div>
        </div>

        {/* نمودارهای جغرافیایی و دستگاه‌ها */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PieChart
            data={analytics.geoData.map((country, index) => ({
              label: country.country,
              value: country.users,
              color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'][index]
            }))}
            title="توزیع جغرافیایی کاربران"
          />

          <PieChart
            data={analytics.deviceData.map((device, index) => ({
              label: device.device,
              value: device.users,
              color: ['#3B82F6', '#10B981', '#F59E0B'][index]
            }))}
            title="توزیع دستگاه‌ها"
          />
        </div>

        {/* نمودارهای مرورگرها و ساعات */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BarChart
            data={analytics.browserData.map(browser => ({
              label: browser.browser,
              value: browser.users
            }))}
            title="آمار مرورگرها"
            color="blue"
          />

          <LineChart
            data={analytics.hourlyData
              .sort((a, b) => a.hour - b.hour)
              .slice(0, 12)
              .map(hour => ({
                label: hour.hour.toString(),
                value: hour.users
              }))}
            title="آمار ساعات روز (12 ساعت اول)"
            color="orange"
          />
        </div>

        {/* نمودارهای روزهای هفته و ماهانه */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BarChart
            data={analytics.weeklyData.map(day => ({
              label: day.day,
              value: day.users
            }))}
            title="آمار روزهای هفته"
            color="green"
          />

          <LineChart
            data={analytics.monthlyData.map(month => ({
              label: month.month,
              value: month.users
            }))}
            title="رشد کاربران در طول سال"
            color="purple"
          />
        </div>

        {/* کارت‌های خلاصه با آیکون‌های جذاب */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100">نرخ تکمیل تست‌ها</p>
                <p className="text-3xl font-bold">{analytics.testStats.completionRate}%</p>
              </div>
              <Target className="w-8 h-8 text-indigo-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100">رضایت کاربران</p>
                <p className="text-3xl font-bold">{analytics.testStats.satisfaction}/5</p>
              </div>
              <Star className="w-8 h-8 text-emerald-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-100">زمان متوسط تست</p>
                <p className="text-3xl font-bold">{analytics.testStats.averageTime}دق</p>
              </div>
              <Clock className="w-8 h-8 text-rose-200" />
            </div>
          </div>
        </div>

        {/* نمودار تعامل با مقالات */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            تعامل با مقالات
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg">
              <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{analytics.articleStats.views.toLocaleString()}</p>
              <p className="text-sm text-blue-600">بازدید</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg">
              <Heart className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{analytics.articleStats.likes.toLocaleString()}</p>
              <p className="text-sm text-green-600">لایک</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg">
              <Share2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{analytics.articleStats.shares.toLocaleString()}</p>
              <p className="text-sm text-purple-600">اشتراک</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-lg">
              <MessageCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">{analytics.articleStats.comments.toLocaleString()}</p>
              <p className="text-sm text-orange-600">نظر</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}