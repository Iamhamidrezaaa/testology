"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, TrendingUp, Award, Calendar } from "lucide-react";

export default function ResultsPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("testology_role");
    const email = localStorage.getItem("testology_email");
    
    if (!role) {
      router.push("/login");
    } else if (role === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      setUserEmail(email || "");
    }
  }, [router]);

  const testResults = [
    {
      id: 1,
      name: "تست شخصیت MBTI",
      type: "ENFP",
      score: 85,
      date: "۲ روز پیش",
      description: "شما یک فرد برون‌گرا، شهودی، احساسی و ادراکی هستید.",
      color: "blue"
    },
    {
      id: 2,
      name: "تست هوش هیجانی",
      type: "بالا",
      score: 78,
      date: "۱ هفته پیش",
      description: "هوش هیجانی شما در سطح بالایی قرار دارد.",
      color: "green"
    },
    {
      id: 3,
      name: "تست اضطراب",
      type: "متوسط",
      score: 45,
      date: "۲ هفته پیش",
      description: "سطح اضطراب شما در حد متوسط است.",
      color: "yellow"
    },
    {
      id: 4,
      name: "تست افسردگی",
      type: "پایین",
      score: 25,
      date: "۳ هفته پیش",
      description: "خوشبختانه نشانه‌های افسردگی در شما کم است.",
      color: "green"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      green: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      red: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
              نتایج تست‌های شما
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              تحلیل کامل و جامع تست‌های روان‌شناختی شما
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">تست‌های انجام شده</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{testResults.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">میانگین نمره</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.round(testResults.reduce((acc, test) => acc + test.score, 0) / testResults.length)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">آخرین تست</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">۲ روز پیش</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            جزئیات نتایج تست‌ها
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {testResults.map((test) => (
              <div key={test.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {test.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {test.date}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getColorClasses(test.color)}`}>
                      {test.type}
                    </span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{test.score}%</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {test.description}
                </p>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      test.color === 'green' ? 'bg-green-500' :
                      test.color === 'blue' ? 'bg-blue-500' :
                      test.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${test.score}%` }}
                  ></div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 py-2 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition text-sm font-medium">
                    مشاهده جزئیات
                  </button>
                  <button className="flex-1 py-2 px-4 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm font-medium">
                    دانلود گزارش
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-blue-600" />
            توصیه‌های شخصی‌سازی شده
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">تست‌های پیشنهادی</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                بر اساس نتایج شما، تست‌های اضطراب و استرس را تکرار کنید.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">مشاوره تخصصی</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                برای تحلیل عمیق‌تر، با روان‌شناسان ما صحبت کنید.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}