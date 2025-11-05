import { HabitTrackerWidget } from '@/components/habit/HabitTrackerWidget';

export const metadata = {
  title: 'ترک عادت - Testology',
  description: 'ردیاب ترک عادت و تداوم روزانه',
};

export default function HabitPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
            <span>🎯</span>
            ترک عادت و تداوم
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            عادت‌های خود را ردیابی کنید و به اهدافتان برسید
          </p>
        </div>
        
        <HabitTrackerWidget />
      </div>
    </div>
  );
}
















