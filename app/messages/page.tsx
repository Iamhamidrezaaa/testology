import { MessageInbox } from '@/components/messages/MessageInbox';

export const metadata = {
  title: 'پیام‌ها - Testology',
  description: 'پیام‌های خصوصی',
};

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
          <span>💌</span>
          پیام‌ها
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MessageInbox />
          </div>

          {/* ساید‌بار */}
          <div className="space-y-6">
            {/* نکات */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span>ℹ️</span>
                نکات مهم
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>پیام‌های شما کاملاً خصوصی و رمزنگاری شده هستند</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>می‌توانید با درمانگر خود پیام رد و بدل کنید</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>پیام‌های جدید با نوتیفیکیشن به اطلاع شما می‌رسد</span>
                </li>
              </ul>
            </div>

            {/* آمار */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 border border-purple-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                📊 آمار کلی
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">پیام‌های دریافتی</span>
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">-</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">پیام‌های ارسالی</span>
                  <span className="text-xl font-bold text-pink-600 dark:text-pink-400">-</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
















