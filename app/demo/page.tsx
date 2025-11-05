import CollectiveMindAnimation from "@/components/CollectiveMindAnimation";

export default function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-center">🧠 Testology — Collective Intelligence Live Demo</h1>
      <p className="text-center text-gray-500 dark:text-gray-400">
        نسخه نمایشی مغز جمعی Testology — نمایش زنده‌ی اتصال داده‌ها، احساسات و یادگیری.
      </p>

      <CollectiveMindAnimation />

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 text-sm text-center bg-white/70 dark:bg-gray-900/60">
        مغز جمعی Testology از داده‌های کاربران، احساسات، و پاسخ‌های GPT تغذیه می‌کند.  
        هر رنگ نشانگر الگوی احساسی غالب در زمان واقعی است.
      </div>
    </div>
  );
}
