"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Download, Share2, FileText, TrendingUp, Heart } from "lucide-react";

export default function PsychologicalProfilePage() {
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

  const profileData = {
    personality: {
      type: "ENFP",
      title: "مبارز",
      description: "شما فردی خلاق، پرانرژی و اجتماعی هستید که به دنبال معنا و هدف در زندگی است.",
      traits: ["برون‌گرا", "شهودی", "احساسی", "ادراکی"],
      strengths: ["خلاقیت", "انعطاف‌پذیری", "همدلی", "انگیزه"],
      challenges: ["تمرکز", "جزئیات", "روال‌ها", "انتقاد"]
    },
    emotional: {
      score: 78,
      level: "بالا",
      description: "هوش هیجانی شما در سطح بالایی قرار دارد و می‌توانید احساسات خود و دیگران را به خوبی درک کنید.",
      skills: ["خودآگاهی", "خودتنظیمی", "انگیزه", "همدلی", "مهارت‌های اجتماعی"]
    },
    mental: {
      anxiety: "متوسط",
      depression: "پایین",
      stress: "متوسط",
      overall: "خوب"
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
              <Brain className="w-6 h-6 mr-2 text-purple-600" />
              پروفایل روان‌شناختی شما
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              تحلیل جامع و علمی شخصیت و وضعیت روانی شما
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Download className="w-4 h-4" />
              دانلود PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <Share2 className="w-4 h-4" />
              اشتراک‌گذاری
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">نوع شخصیت</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{profileData.personality.type}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{profileData.personality.title}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">هوش هیجانی</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{profileData.emotional.score}%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">سطح {profileData.emotional.level}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">وضعیت کلی</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{profileData.mental.overall}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">سلامت روان</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personality Analysis */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              تحلیل شخصیت
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">نوع شخصیت: {profileData.personality.type}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{profileData.personality.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">ویژگی‌های اصلی</h4>
                <div className="flex flex-wrap gap-2">
                  {profileData.personality.traits.map((trait, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full text-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">نقاط قوت</h4>
                <div className="flex flex-wrap gap-2">
                  {profileData.personality.strengths.map((strength, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-sm">
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">نقاط قابل بهبود</h4>
                <div className="flex flex-wrap gap-2">
                  {profileData.personality.challenges.map((challenge, index) => (
                    <span key={index} className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-full text-sm">
                      {challenge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Emotional Intelligence */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-green-600" />
              هوش هیجانی
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">نمره کلی</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{profileData.emotional.score}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${profileData.emotional.score}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">توضیح</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{profileData.emotional.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">مهارت‌های کلیدی</h4>
                <div className="space-y-2">
                  {profileData.emotional.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{skill}</span>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mental Health Status */}
        <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            وضعیت سلامت روان
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">اضطراب</h4>
              <p className={`text-2xl font-bold ${
                profileData.mental.anxiety === 'پایین' ? 'text-green-600' :
                profileData.mental.anxiety === 'متوسط' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {profileData.mental.anxiety}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">افسردگی</h4>
              <p className={`text-2xl font-bold ${
                profileData.mental.depression === 'پایین' ? 'text-green-600' :
                profileData.mental.depression === 'متوسط' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {profileData.mental.depression}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">استرس</h4>
              <p className={`text-2xl font-bold ${
                profileData.mental.stress === 'پایین' ? 'text-green-600' :
                profileData.mental.stress === 'متوسط' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {profileData.mental.stress}
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            توصیه‌های شخصی‌سازی شده
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">برای رشد شخصی</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• تمرین تمرکز و توجه</li>
                <li>• برنامه‌ریزی روزانه</li>
                <li>• پذیرش انتقاد سازنده</li>
              </ul>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">برای سلامت روان</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• تمرینات تنفسی روزانه</li>
                <li>• فعالیت بدنی منظم</li>
                <li>• ارتباط با طبیعت</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}