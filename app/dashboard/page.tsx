"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MoodTrackerCard from "@/components/MoodTrackerCard";
import CombinedProfileCard from "@/components/CombinedProfileCard";
import BehavioralInsights from "@/components/BehavioralInsights";
import PDFExportButton from "@/components/PDFExportButton";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import ErrorBoundary from "@/components/ErrorBoundary";
import { 
  Brain, 
  BarChart3, 
  FileText, 
  Heart, 
  TrendingUp,
  BookOpen,
  Download,
  Target,
  Award,
  MessageSquare,
  Users
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userProfile, setUserProfile] = useState({
    name: "",
    lastName: "",
    avatar: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [recentTests, setRecentTests] = useState([
    { name: "تست شخصیت MBTI", date: "۲ روز پیش", score: "ENFP" },
    { name: "تست هوش هیجانی", date: "۱ هفته پیش", score: "۸۵%" },
    { name: "تست اضطراب", date: "۲ هفته پیش", score: "متوسط" },
  ]);
  const { profileData, loading: profileLoading } = useProfileCompletion();

  useEffect(() => {
    // دریافت اطلاعات کاربر از session
    fetchUserSession();
  }, [router]);

  const fetchUserSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const session = await response.json();
      
      if (!session?.user?.email) {
        router.push("/login");
        return;
      }

      // بررسی نقش کاربر
      if (session.user.role === "admin") {
        router.push("/admin/dashboard");
        return;
      } else if (session.user.role === "psychologist") {
        router.push("/psychologist/dashboard");
        return;
      } else if (session.user.role === "content_producer") {
        router.push("/content-producer/dashboard");
        return;
      }

      setUserEmail(session.user.email);
      console.log("📊 Fetching data for user:", session.user.email);
      Promise.all([
        fetchUserStats(session.user.email),
        fetchUserProfile(session.user.email)
      ]).finally(() => {
        setInitialLoad(false);
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error fetching session:', error);
      router.push("/login");
    }
  };

  const fetchUserProfile = async (email: string) => {
    try {
      console.log("🔍 Fetching user profile for:", email);
      const response = await fetch(`/api/user/profile?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      console.log("📊 Profile response:", data);
      
      if (data.success) {
        setUserProfile({
          name: data.profile.name || "",
          lastName: data.profile.lastName || "",
          avatar: data.profile.avatar || ""
        });
      } else {
        console.error("❌ Profile fetch failed:", data.message);
      }
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
    }
  };

  const [stats, setStats] = useState({
    completedTests: 0,
    totalInsights: 0,
    moodScore: 0,
    weeklyProgress: 0
  });

  const fetchUserStats = async (email: string) => {
    try {
      console.log("🔍 Fetching user stats for:", email);
      // خواندن آمار از دیتابیس
      const response = await fetch(`/api/tests/results?userEmail=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      console.log("📊 Stats response:", data);
      
      if (data.success) {
        const testResults = data.results;
        
        setStats({
          completedTests: testResults.length,
          totalInsights: testResults.length,
          moodScore: testResults.length > 0 ? Math.round(testResults.reduce((sum: number, result: any) => sum + result.score, 0) / testResults.length) : 0,
          weeklyProgress: Math.min((testResults.length / 3) * 100, 100)
        });
        
        // بارگذاری تست‌های اخیر از دیتابیس
        const recentTestsData = testResults.slice(0, 3).map((result: any) => ({
          name: result.testName,
          date: new Date(result.completedAt).toLocaleDateString('fa-IR'),
          score: `${Math.round(result.score)}%`
        }));
        setRecentTests(recentTestsData);
        
        console.log("✅ Stats updated:", {
          completedTests: testResults.length,
          recentTests: recentTestsData
        });
      } else {
        console.error("❌ Stats fetch failed:", data.error);
      }
    } catch (error) {
      console.error("❌ Error fetching user stats:", error);
    }
  };

  // اگر در حال loading است یا role admin است، loading نمایش دهیم
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    { title: "شروع تست جدید", description: "تست‌های روان‌شناسی جدید", href: "/tests", icon: Brain, color: "blue" },
    { title: "چت با هوش مصنوعی", description: "مشاوره روان‌شناختی هوشمند", href: "/dashboard/chat-ai", icon: MessageSquare, color: "purple" },
    { title: "چت با روان‌شناس", description: "مشاوره با متخصصان", href: "/psychologists", icon: Users, color: "indigo" },
    { title: "مشاهده نتایج", description: "تحلیل کامل تست‌های شما", href: "/dashboard/results", icon: BarChart3, color: "green" },
    { title: "دانلود گزارش", description: "گزارش کامل روان‌شناختی", href: "/dashboard/psychological-profile", icon: Download, color: "orange" },
  ];

  return (
    <ErrorBoundary>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {initialLoad ? "در حال بارگذاری..." : (userProfile.name ? `خوش اومدی ${userProfile.name} جان! 👋` : (userEmail ? `خوش آمدید ${userEmail}! 👋` : "خوش آمدید! 👋"))}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              داشبورد شخصی شما در Testology
            </p>
          </div>
        </div>
      </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">تست‌های انجام شده</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.completedTests}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">نمره خلق و خو</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.moodScore}/10</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">بینش‌های دریافت شده</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalInsights}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">پیشرفت هفتگی</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.weeklyProgress}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">دسترسی سریع</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <a
                    key={index}
                    href={action.href}
                    className={`p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-900 group`}
                  >
                    <div className={`w-12 h-12 bg-${action.color}-100 dark:bg-${action.color}-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 text-${action.color}-600 dark:text-${action.color}-400`} />
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Mood and Profile */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mood Tracker */}
              <MoodTrackerCard />
              
              {/* Combined Profile */}
              <CombinedProfileCard />
            </div>

            {/* Right Column - Insights */}
            <div className="space-y-6">
              {/* Behavioral Insights */}
              <BehavioralInsights />

              {/* Recent Tests */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                  تست‌های اخیر
                </h3>
                <div className="space-y-3">
                  {recentTests.map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{test.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{test.date}</p>
                      </div>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                        {test.score}
                      </span>
                    </div>
                  ))}
                </div>
                <a
                  href="/dashboard/results"
                  className="block w-full mt-4 text-center py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                >
                  مشاهده همه نتایج
                </a>
              </div>
            </div>
          </div>

      </main>
    </ErrorBoundary>
  );
}