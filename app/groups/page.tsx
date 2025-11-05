import { GroupTherapyList } from '@/components/groups/GroupTherapyList';

export const metadata = {
  title: 'گروه‌های درمانی - Testology',
  description: 'گروه‌های درمانی و جلسات آنلاین',
};

export default function GroupsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
          <span>👥</span>
          گروه‌های درمانی
        </h1>
        
        <GroupTherapyList />
      </div>
    </div>
  );
}
















