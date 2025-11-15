"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGlobalRecommendedTests } from "@/hooks/useGlobalRecommendedTests";
import {
  Brain,
  Heart,
  Smile,
  Moon,
  Zap,
  Target,
  Briefcase,
  Compass,
  Sparkles,
  Star,
  Clock,
  Users,
  Activity,
  Award,
  Home,
  Lightbulb,
  BookOpen,
  TrendingUp,
  Shield,
  Coffee,
  Gamepad2,
  Music,
  Camera,
  Palette,
  Dumbbell,
  Car,
  Plane,
  ShoppingBag,
  Utensils,
  TreePine,
  Mountain,
  Waves,
  Sun,
  Cloud,
  Snowflake,
  Leaf,
} from "lucide-react";

// دسته‌بندی‌ها
const categories = [
  { id: "all", name: "همه تست‌ها" },
  { id: "personality", name: "شخصیت‌شناسی 💬" },
  { id: "mental", name: "سلامت روان 💭" },
  { id: "emotion", name: "احساسات و روابط ❤️" },
  { id: "focus", name: "تمرکز و خواب 🌙" },
  { id: "career", name: "انتخاب شغل 💼" },
  { id: "skills", name: "مهارت‌های فردی 🚀" },
  { id: "intelligence", name: "هوش و شناخت 🧠" },
  { id: "social", name: "مهارت‌های اجتماعی 👥" },
  { id: "wellness", name: "سلامت و تندرستی 💪" },
  { id: "learning", name: "یادگیری و رشد 📚" },
  { id: "lifestyle", name: "سبک زندگی 🏠" },
];

// لیست تست‌ها
const testList = [
  // تست‌های شخصیت‌شناسی
  { id: "mbti", title: "تست شخصیت‌شناسی MBTI", desc: "شناخت تیپ شخصیتی", duration: "10 دقیقه", level: "آسان", category: "personality", icon: <Brain className="w-7 h-7 text-indigo-500" />, score: 95 },
  { id: "neo-ffi", title: "تست شخصیت NEO-FFI", desc: "ارزیابی پنج عامل بزرگ شخصیت", duration: "20 دقیقه", level: "متوسط", category: "personality", icon: <Brain className="w-7 h-7 text-indigo-500" />, score: 88 },
  { id: "bfi", title: "تست شخصیت BFI", desc: "ارزیابی سریع شخصیت", duration: "10 دقیقه", level: "آسان", category: "personality", icon: <Brain className="w-7 h-7 text-purple-500" />, score: 82 },
  { id: "creativity", title: "تست خلاقیت ذهنی", desc: "تحلیل قدرت نوآوری", duration: "12 دقیقه", level: "آسان", category: "personality", icon: <Sparkles className="w-7 h-7 text-purple-500" />, score: 78 },

  // تست‌های سلامت روان
  { id: "phq9", title: "تست افسردگی PHQ-9", desc: "تحلیل علائم افسردگی", duration: "7 دقیقه", level: "متوسط", category: "mental", icon: <Moon className="w-7 h-7 text-blue-500" />, score: 90 },
  { id: "gad7", title: "تست اضطراب GAD-7", desc: "بررسی اضطراب روزمره", duration: "8 دقیقه", level: "آسان", category: "mental", icon: <Heart className="w-7 h-7 text-pink-500" />, score: 92 },
  { id: "bai", title: "تست اضطراب BAI", desc: "ارزیابی شدت اضطراب", duration: "8 دقیقه", level: "آسان", category: "mental", icon: <Heart className="w-7 h-7 text-red-500" />, score: 85 },
  { id: "bdi", title: "تست افسردگی BDI", desc: "ارزیابی شدت افسردگی", duration: "10 دقیقه", level: "متوسط", category: "mental", icon: <Moon className="w-7 h-7 text-blue-500" />, score: 87 },
  { id: "hads", title: "تست اضطراب و افسردگی HADS", desc: "ارزیابی علائم اضطراب و افسردگی", duration: "7 دقیقه", level: "آسان", category: "mental", icon: <Moon className="w-7 h-7 text-indigo-500" />, score: 80 },
  { id: "stai", title: "تست اضطراب STAI", desc: "ارزیابی اضطراب حالت و صفت", duration: "15 دقیقه", level: "متوسط", category: "mental", icon: <Heart className="w-7 h-7 text-pink-500" />, score: 78 },

  // تست‌های احساسات و روابط
  { id: "eq", title: "تست هوش هیجانی EQ", desc: "سنجش میزان کنترل احساسات", duration: "15 دقیقه", level: "متوسط", category: "emotion", icon: <Smile className="w-7 h-7 text-yellow-500" />, score: 90 },
  { id: "rosenberg", title: "تست عزت نفس روزنبرگ", desc: "اندازه‌گیری عزت‌نفس شما", duration: "5 دقیقه", level: "آسان", category: "emotion", icon: <Zap className="w-7 h-7 text-orange-500" />, score: 88 },
  { id: "swls", title: "تست رضایت از زندگی", desc: "بررسی میزان رضایت شما از زندگی", duration: "5 دقیقه", level: "آسان", category: "emotion", icon: <Zap className="w-7 h-7 text-teal-500" />, score: 85 },
  { id: "panas", title: "تست عواطف PANAS", desc: "ارزیابی عواطف مثبت و منفی", duration: "8 دقیقه", level: "آسان", category: "emotion", icon: <Smile className="w-7 h-7 text-yellow-500" />, score: 82 },
  { id: "attachment", title: "تست دلبستگی", desc: "ارزیابی سبک دلبستگی", duration: "12 دقیقه", level: "متوسط", category: "emotion", icon: <Heart className="w-7 h-7 text-red-500" />, score: 75 },
  { id: "ucla", title: "تست تنهایی UCLA", desc: "ارزیابی احساس تنهایی", duration: "6 دقیقه", level: "آسان", category: "emotion", icon: <Heart className="w-7 h-7 text-gray-500" />, score: 70 },

  // تست‌های تمرکز و خواب
  { id: "focus", title: "تست تمرکز و توجه", desc: "ارزیابی سطح تمرکز ذهنی", duration: "8 دقیقه", level: "آسان", category: "focus", icon: <Target className="w-7 h-7 text-rose-500" />, score: 85 },
  { id: "isi", title: "تست بی‌خوابی ISI", desc: "ارزیابی شدت بی‌خوابی", duration: "5 دقیقه", level: "آسان", category: "focus", icon: <Moon className="w-7 h-7 text-purple-500" />, score: 80 },
  { id: "psqi", title: "تست کیفیت خواب PSQI", desc: "ارزیابی کیفیت خواب", duration: "8 دقیقه", level: "آسان", category: "focus", icon: <Moon className="w-7 h-7 text-blue-500" />, score: 78 },
  { id: "maas", title: "تست ذهن‌آگاهی MAAS", desc: "ارزیابی سطح ذهن‌آگاهی", duration: "10 دقیقه", level: "متوسط", category: "focus", icon: <Brain className="w-7 h-7 text-teal-500" />, score: 82 },

  // تست‌های انتخاب شغل
  { id: "career", title: "تست آینده شغلی", desc: "کشف مسیر شغلی مناسب شما", duration: "10 دقیقه", level: "متوسط", category: "career", icon: <Briefcase className="w-7 h-7 text-green-500" />, score: 89 },
  { id: "riasec", title: "تست علاقه‌مندی شغلی RIASEC", desc: "شغل مناسب شخصیت شما", duration: "12 دقیقه", level: "آسان", category: "career", icon: <Compass className="w-7 h-7 text-orange-400" />, score: 80 },
  { id: "leadership", title: "تست رهبری", desc: "ارزیابی مهارت‌های رهبری", duration: "12 دقیقه", level: "متوسط", category: "career", icon: <Target className="w-7 h-7 text-green-500" />, score: 85 },
  { id: "communication", title: "تست ارتباطات", desc: "ارزیابی مهارت‌های ارتباطی", duration: "10 دقیقه", level: "آسان", category: "career", icon: <Heart className="w-7 h-7 text-blue-500" />, score: 80 },
  { id: "teamwork", title: "تست کار تیمی", desc: "ارزیابی مهارت‌های همکاری", duration: "8 دقیقه", level: "آسان", category: "career", icon: <Users className="w-7 h-7 text-green-500" />, score: 78 },

  // تست‌های مهارت‌های فردی
  { id: "problem-solving", title: "تست حل مسئله", desc: "ارزیابی مهارت‌های حل چالش", duration: "10 دقیقه", level: "متوسط", category: "skills", icon: <Brain className="w-7 h-7 text-indigo-400" />, score: 84 },
  { id: "decision-making", title: "تست تصمیم‌گیری", desc: "ارزیابی مهارت‌های تصمیم‌گیری", duration: "10 دقیقه", level: "متوسط", category: "skills", icon: <Target className="w-7 h-7 text-orange-500" />, score: 82 },
  { id: "time-management", title: "تست مدیریت زمان", desc: "ارزیابی مهارت‌های مدیریت زمان", duration: "8 دقیقه", level: "آسان", category: "skills", icon: <Clock className="w-7 h-7 text-teal-500" />, score: 88 },
  { id: "stress-management", title: "تست مدیریت استرس", desc: "ارزیابی مهارت‌های مدیریت استرس", duration: "10 دقیقه", level: "آسان", category: "skills", icon: <Heart className="w-7 h-7 text-pink-500" />, score: 90 },
  { id: "work-life-balance", title: "تست تعادل کار-زندگی", desc: "ارزیابی تعادل بین کار و زندگی", duration: "8 دقیقه", level: "آسان", category: "skills", icon: <Target className="w-7 h-7 text-blue-500" />, score: 85 },

  // تست‌های هوش و شناخت
  { id: "iq", title: "تست هوش شناختی IQ", desc: "ارزیابی هوش شناختی و توانایی‌های ذهنی", duration: "30 دقیقه", level: "سخت", category: "intelligence", icon: <Brain className="w-7 h-7 text-indigo-500" />, score: 92 },
  { id: "memory", title: "تست حافظه", desc: "ارزیابی قدرت حافظه و یادآوری", duration: "10 دقیقه", level: "آسان", category: "intelligence", icon: <Brain className="w-7 h-7 text-blue-500" />, score: 82 },

  // تست‌های مهارت‌های اجتماعی
  { id: "spin", title: "تست اضطراب اجتماعی SPIN", desc: "ارزیابی اضطراب اجتماعی و ترس از تعامل", duration: "8 دقیقه", level: "آسان", category: "social", icon: <Heart className="w-7 h-7 text-red-500" />, score: 75 },
  { id: "psss", title: "تست حمایت اجتماعی PSSS", desc: "ارزیابی سطح حمایت اجتماعی و روابط", duration: "6 دقیقه", level: "آسان", category: "social", icon: <Users className="w-7 h-7 text-pink-500" />, score: 72 },

  // تست‌های سلامت و تندرستی
  { id: "wellness", title: "تست سلامت کلی", desc: "ارزیابی وضعیت سلامت جسمی و روانی", duration: "15 دقیقه", level: "آسان", category: "wellness", icon: <Activity className="w-7 h-7 text-green-500" />, score: 88 },
  { id: "nutrition", title: "تست عادات غذایی", desc: "ارزیابی الگوهای تغذیه و عادات غذایی", duration: "10 دقیقه", level: "آسان", category: "wellness", icon: <Utensils className="w-7 h-7 text-orange-500" />, score: 80 },
  { id: "exercise", title: "تست فعالیت بدنی", desc: "ارزیابی سطح فعالیت بدنی و ورزش", duration: "8 دقیقه", level: "آسان", category: "wellness", icon: <Dumbbell className="w-7 h-7 text-blue-500" />, score: 85 },
  { id: "sleep-quality", title: "تست کیفیت خواب", desc: "ارزیابی الگوهای خواب و استراحت", duration: "8 دقیقه", level: "آسان", category: "wellness", icon: <Moon className="w-7 h-7 text-purple-500" />, score: 82 },
  { id: "stress-level", title: "تست سطح استرس", desc: "ارزیابی میزان استرس و فشار روانی", duration: "6 دقیقه", level: "آسان", category: "wellness", icon: <Heart className="w-7 h-7 text-red-500" />, score: 90 },

  // تست‌های یادگیری و رشد
  { id: "learning-style", title: "تست سبک یادگیری", desc: "کشف روش یادگیری مناسب شما", duration: "12 دقیقه", level: "متوسط", category: "learning", icon: <BookOpen className="w-7 h-7 text-indigo-500" />, score: 85 },
  { id: "growth-mindset", title: "تست ذهنیت رشد", desc: "ارزیابی تمایل به یادگیری و رشد", duration: "10 دقیقه", level: "آسان", category: "learning", icon: <TrendingUp className="w-7 h-7 text-green-500" />, score: 80 },
  { id: "curiosity", title: "تست کنجکاوی", desc: "ارزیابی سطح کنجکاوی و علاقه به یادگیری", duration: "8 دقیقه", level: "آسان", category: "learning", icon: <Lightbulb className="w-7 h-7 text-yellow-500" />, score: 78 },
  { id: "adaptability", title: "تست انطباق‌پذیری", desc: "ارزیابی توانایی سازگاری با تغییرات", duration: "10 دقیقه", level: "متوسط", category: "learning", icon: <Compass className="w-7 h-7 text-teal-500" />, score: 82 },
  { id: "innovation", title: "تست نوآوری", desc: "ارزیابی تمایل به نوآوری و ایده‌پردازی", duration: "12 دقیقه", level: "متوسط", category: "learning", icon: <Sparkles className="w-7 h-7 text-purple-500" />, score: 75 },

  // تست‌های سبک زندگی
  { id: "lifestyle-balance", title: "تست تعادل زندگی", desc: "ارزیابی تعادل بین کار، خانواده و تفریح", duration: "10 دقیقه", level: "آسان", category: "lifestyle", icon: <Home className="w-7 h-7 text-blue-500" />, score: 88 },
  { id: "hobbies", title: "تست علایق و سرگرمی‌ها", desc: "کشف علایق و سرگرمی‌های مناسب شما", duration: "8 دقیقه", level: "آسان", category: "lifestyle", icon: <Gamepad2 className="w-7 h-7 text-green-500" />, score: 82 },
  { id: "values", title: "تست ارزش‌های شخصی", desc: "شناسایی ارزش‌ها و اولویت‌های زندگی", duration: "15 دقیقه", level: "متوسط", category: "lifestyle", icon: <Star className="w-7 h-7 text-yellow-500" />, score: 85 },
  { id: "time-preference", title: "تست ترجیح زمانی", desc: "ارزیابی الگوهای زمانی و انرژی", duration: "6 دقیقه", level: "آسان", category: "lifestyle", icon: <Clock className="w-7 h-7 text-orange-500" />, score: 78 },
  { id: "environment", title: "تست محیط ایده‌آل", desc: "کشف محیط کاری و زندگی مناسب شما", duration: "10 دقیقه", level: "آسان", category: "lifestyle", icon: <Home className="w-7 h-7 text-teal-500" />, score: 80 },
];

export default function TestsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [mounted, setMounted] = useState(false);
  const { isRecommended, isLoading } = useGlobalRecommendedTests();
  
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const filteredTests =
    activeCategory === "all"
      ? testList
      : testList.filter((test) => test.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-10">
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">
          🧠 کتابخانهٔ تست‌های روان‌شناسی تستولوژی
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          بیش از ۶۰ تست معتبر برای رشد شخصی، افزایش خودآگاهی و بهبود کیفیت زندگی
        </p>
      </div>

      {/* فیلتر دسته‌بندی */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
              activeCategory === cat.id
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-800"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* کارت تست‌ها */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filteredTests.map((test, index) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              {test.icon}
              <div className="flex items-center gap-2">
                {!isLoading && isRecommended(test.id) && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                    پیشنهادشده
                  </span>
                )}
                <span className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" /> {test.score}%
                </span>
              </div>
            </div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
              {test.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-3 text-sm">
              {test.desc}
            </p>
            <div className="flex justify-between text-xs mb-4 text-gray-500 dark:text-gray-400">
              <span>{test.level}</span>
              <span>{test.duration}</span>
            </div>
            <Link
              href={`/tests/${test.id}`}
              className="block w-full text-center bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-2 rounded-xl shadow-sm transition"
            >
              شروع تست
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}