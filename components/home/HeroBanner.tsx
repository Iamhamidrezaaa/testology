"use client";

import React from 'react';
import SmartStartButton from '@/components/ui/SmartStartButton';

export function HeroBanner() {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      
      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in font-vazir">
            🧠 چرا تستولوژی؟
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold mb-4">
            پلتفرم هوشمند روان‌شناسی
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            تست‌های روان‌شناسی علمی + تحلیل هوش مصنوعی + گروه درمانی + ترک عادت
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <SmartStartButton className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl">
              از اینجا شروع کنید...
            </SmartStartButton>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
              <div className="text-sm opacity-90">تست روان‌شناسی</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">100+</div>
              <div className="text-sm opacity-90">درمانگر حرفه‌ای</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">1000+</div>
              <div className="text-sm opacity-90">کاربر فعال</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
              <div className="text-sm opacity-90">پشتیبانی آنلاین</div>
            </div>
          </div>
        </div>
      </div>

      {/* موج */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="currentColor"
            className="text-gray-50 dark:text-gray-900"
          />
        </svg>
      </div>
    </div>
  );
}

export default HeroBanner;