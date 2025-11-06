"use client";
import { useState } from 'react';

export default function ClearDataButton() {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearData = async () => {
    // بررسی اینکه آیا کاربر یکی از user1, user2, user3 است
    const currentEmail = localStorage.getItem('testology_email');
    const testUserEmails = ['user1@testology.me', 'user2@testology.me', 'user3@testology.me'];
    
    if (!currentEmail || !testUserEmails.includes(currentEmail)) {
      alert('⚠️ این دکمه فقط برای کاربران تست (user1, user2, user3) فعال است.');
      return;
    }

    if (!confirm('آیا مطمئن هستید که می‌خواهید داده‌های تست را پاک کنید؟\n\nاین عمل فقط داده‌های localStorage شما را پاک می‌کند.')) {
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
        alert('✅ داده‌های تست پاک شدند! صفحه را رفرش کنید.');
      }, 1000);
    } catch (error) {
      console.error('Error clearing data:', error);
      setIsClearing(false);
      alert('❌ خطا در پاک کردن داده‌ها!');
    }
  };

  return (
    <button
      onClick={handleClearData}
      disabled={isClearing}
      className="bg-white/10 backdrop-blur border border-white/20 text-white/90 px-3 py-1.5 rounded-lg text-xs hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
    >
      {isClearing ? (
        <>
          <div className="w-3 h-3 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
          در حال پاک کردن...
        </>
      ) : (
        <>
          <span>🧹</span>
          پاک کردن داده‌های تست
        </>
      )}
    </button>
  );
}
