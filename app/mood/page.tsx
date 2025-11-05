import { MoodCalendar } from '@/components/calendar/MoodCalendar';

export const metadata = {
  title: 'تقویم احساسات - Testology',
  description: 'ثبت و پیگیری احساسات روزانه',
};

export default function MoodPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
            <span>📅</span>
            تقویم احساسات
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            هر روز احساس خود را ثبت کنید و روند تغییرات خلقی خود را پیگیری کنید
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MoodCalendar />
          </div>

          {/* ساید‌بار */}
          <div className="space-y-6">
            {/* مزایا */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 border border-blue-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span>✨</span>
                مزایای ثبت احساسات
              </h3>
              <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>شناخت بهتر الگوهای احساسی</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>تشخیص عوامل تأثیرگذار بر خلق</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>پیگیری پیشرفت درمان</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>کسب 20 XP در هر ثبت</span>
                </li>
              </ul>
            </div>

            {/* نکات */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span>💡</span>
                نکات مفید
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span>سعی کنید هر روز در یک زمان ثابت احساس خود را ثبت کنید</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span>یادداشت‌های کوتاه می‌تواند کمک زیادی به تحلیل کند</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span>صادق باشید - این اطلاعات فقط برای شماست</span>
                </li>
              </ul>
            </div>

            {/* پاداش */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white text-center">
              <div className="text-4xl mb-2">🎁</div>
              <div className="font-bold text-lg mb-1">پاداش روزانه!</div>
              <div className="text-sm opacity-90">+20 XP برای هر ثبت احساس</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
















