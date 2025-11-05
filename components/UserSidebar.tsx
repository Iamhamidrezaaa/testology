"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Home, 
  Brain, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut,
  User,
  Heart,
  TrendingUp,
  BookOpen,
  Download,
  AlertCircle,
  X
} from "lucide-react";

export default function UserSidebar() {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState("");
  const [userProfile, setUserProfile] = useState({
    name: "",
    lastName: "",
    avatar: ""
  });
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const [profileComplete, setProfileComplete] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      const email = localStorage.getItem("testology_email");
      if (email) {
        setUserEmail(email);
        await Promise.all([
          checkProfileCompletion(email),
          fetchUserProfile(email)
        ]);
      }
      setInitialLoad(false);
      setIsLoading(false);
    };
    
    initializeData();
  }, []);

  const fetchUserProfile = async (email: string) => {
    try {
      const response = await fetch(`/api/user/profile?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (data.success) {
        setUserProfile({
          name: data.profile.name || "",
          lastName: data.profile.lastName || "",
          avatar: data.profile.avatar || ""
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const checkProfileCompletion = async (email: string) => {
    try {
      const response = await fetch(`/api/user/profile?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (data.success) {
        const profile = data.profile;
        const isComplete = !!(profile.name && profile.lastName && profile.phone && 
                            profile.birthDate && profile.province && profile.city);
        setProfileComplete(isComplete);
        // موقتاً modal را غیرفعال می‌کنیم
        // if (!isComplete) {
        //   setShowProfileAlert(true);
        // }
      }
    } catch (error) {
      console.error("Error checking profile completion:", error);
    }
  };

  const menuItems = [
    { href: "/dashboard", label: "داشبورد", icon: Home },
    { href: "/tests", label: "تست‌ها", icon: Brain },
    { href: "/dashboard/results", label: "نتایج تست‌ها", icon: BarChart3 },
    { href: "/dashboard/chat", label: "چت هوشمند", icon: MessageSquare },
    { href: "/dashboard/chat-psychology", label: "تحلیل روانی ترکیبی", icon: Brain },
    { href: "/dashboard/chat-history", label: "تاریخچه گفتگو", icon: MessageSquare },
    { href: "/dashboard/psychological-profile", label: "پروفایل روانشناختی", icon: FileText },
    { href: "/dashboard/mood-tracker", label: "ردیاب خلق", icon: Heart },
    { href: "/dashboard/insights", label: "بینش‌های رفتاری", icon: TrendingUp },
    { href: "/dashboard/learning-center", label: "مرکز یادگیری", icon: BookOpen },
    { href: "/dashboard/settings", label: "تنظیمات", icon: Settings, hasAlert: !profileComplete },
  ];

  const handleLogout = () => {
    localStorage.removeItem("testology_role");
    localStorage.removeItem("testology_email");
    window.dispatchEvent(new CustomEvent("localStorageChange"));
    window.location.href = "/";
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-900 shadow-lg border-l border-gray-200 dark:border-gray-800 h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          {userProfile.avatar ? (
            <img 
              src={userProfile.avatar} 
              alt="User Avatar" 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          )}
          <div className="pl-12">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              {initialLoad ? "..." : (userProfile.lastName ? (
                <span style={{ marginLeft: '12px' }}>{userProfile.lastName}</span>
              ) : (userProfile.name || userEmail || "کاربر"))}
            </h3>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const hasAlert = item.hasAlert;
          
          return (
            <div key={item.href} className="relative">
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={hasAlert ? (e) => {
                  e.preventDefault();
                  setShowProfileAlert(true);
                } : undefined}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {hasAlert && (
                  <div className="absolute left-2 top-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">دسترسی سریع</h4>
        <div className="space-y-2">
          <Link
            href="/tests"
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition"
          >
            <Brain className="w-4 h-4" />
            <span>شروع تست جدید</span>
          </Link>
          <Link
            href="/dashboard/psychological-profile"
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition"
          >
            <Download className="w-4 h-4" />
            <span>دانلود گزارش</span>
          </Link>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">خروج از حساب</span>
        </button>
      </div>

      {/* Profile Completion Alert Modal */}
      {showProfileAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl max-w-md mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">تکمیل پروفایل</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">اطلاعات شخصی شما ناقص است</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                برای استفاده کامل از خدمات Testology، لطفاً اطلاعات پروفایل خود را تکمیل کنید.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>اطلاعات مورد نیاز:</strong> نام، نام خانوادگی، شماره موبایل، تاریخ تولد، استان و شهرستان
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Link
                href="/dashboard/settings"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition text-center font-semibold"
                onClick={() => setShowProfileAlert(false)}
              >
                تکمیل پروفایل
              </Link>
              <button
                onClick={() => setShowProfileAlert(false)}
                className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                بعداً
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


