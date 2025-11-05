"use client";

import React from 'react';
import Link from 'next/link';

const FEATURED_TESTS = [
  {
    slug: 'phq9',
    name: 'پرسشنامه افسردگی PHQ-9',
    description: 'ارزیابی علائم افسردگی در دو هفته گذشته',
    icon: '😔',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    slug: 'gad7',
    name: 'پرسشنامه اضطراب GAD-7',
    description: 'سنجش سطح اضطراب عمومی',
    icon: '😰',
    color: 'from-purple-500 to-pink-500'
  },
  {
    slug: 'pss',
    name: 'مقیاس استرس ادراک‌شده',
    description: 'ارزیابی میزان استرس در یک ماه گذشته',
    icon: '😫',
    color: 'from-orange-500 to-red-500'
  },
  {
    slug: 'rosenberg',
    name: 'مقیاس عزت‌نفس روزنبرگ',
    description: 'سنجش عزت‌نفس و ارزش خود',
    icon: '💪',
    color: 'from-green-500 to-emerald-500'
  }
];

export function FeaturedTests() {
  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            تست‌های محبوب روان‌شناسی
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            با تحلیل هوش مصنوعی و گزارش تخصصی
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_TESTS.map((test) => (
            <Link
              key={test.slug}
              href={`/tests/${test.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-transparent"
            >
              <div className={`bg-gradient-to-br ${test.color} p-6 text-white`}>
                <div className="text-5xl mb-3">{test.icon}</div>
                <h3 className="font-bold text-lg mb-2">{test.name}</h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {test.description}
                </p>
                <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium group-hover:translate-x-2 transition-transform">
                  شروع آزمون
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/tests"
            className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            مشاهده همه تست‌ها (50+)
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FeaturedTests;