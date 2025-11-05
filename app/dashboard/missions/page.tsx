import { DailyMissions } from '@/components/dashboard/DailyMissions';

export const metadata = {
  title: 'مأموریت‌های روزانه - Testology',
  description: 'مأموریت‌های روزانه و کسب XP',
};

export default function MissionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
          <span>🎯</span>
          مأموریت‌های روزانه
        </h1>
        
        <DailyMissions />

        {/* راهنما */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
            <span>💡</span>
            چطور کار می‌کند؟
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>هر روز 4 مأموریت جدید دریافت می‌کنید</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>با انجام هر مأموریت XP کسب کنید</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>تکمیل همه مأموریت‌ها = بونوس ویژه!</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>مأموریت‌های فردا بعد از نیمه‌شب دسترسی دارند</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
















