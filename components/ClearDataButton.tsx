"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function ClearDataButton() {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearData = async () => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید تمام داده‌های تست را پاک کنید؟')) {
      return;
    }

    setIsClearing(true);
    
    try {
      // استفاده از DashboardDataManager برای پاک کردن داده‌ها
      const { DashboardDataManager } = await import('@/lib/dashboard-data');
      DashboardDataManager.clearAllTestData();

      // Dispatch event برای اطلاع‌رسانی
      window.dispatchEvent(new CustomEvent("localStorageChange"));

      setTimeout(() => {
        setIsClearing(false);
        alert('✅ تمام داده‌های تست پاک شدند! صفحه را رفرش کنید.');
      }, 1000);
    } catch (error) {
      console.error('Error clearing data:', error);
      setIsClearing(false);
      alert('❌ خطا در پاک کردن داده‌ها!');
    }
  };

  return (
    <Button
      onClick={handleClearData}
      disabled={isClearing}
      variant="outline"
      size="sm"
      className="fixed bottom-4 right-4 bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20 z-50"
    >
      {isClearing ? (
        <>
          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2" />
          در حال پاک کردن...
        </>
      ) : (
        <>
          <Trash2 className="w-4 h-4 mr-2" />
          پاک کردن داده‌های تست
        </>
      )}
    </Button>
  );
}
