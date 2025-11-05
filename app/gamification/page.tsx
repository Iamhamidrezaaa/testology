import { GamificationPanel } from '@/components/gamification/GamificationPanel';

export const metadata = {
  title: 'گیمیفیکیشن - Testology',
  description: 'آمار و دستاوردهای گیمیفیکیشن',
};

export default function GamificationPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
          <span>🏆</span>
          گیمیفیکیشن و دستاوردها
        </h1>
        
        <GamificationPanel />
      </div>
    </div>
  );
}
