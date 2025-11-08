"use client";

import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import DailyMissions from '@/components/missions/DailyMissions'
import ConversationList from '@/components/messages/ConversationList'
import MessageBox from '@/components/messages/MessageBox'
import MoodSelector from '@/components/mood/MoodSelector'
import MoodCalendar from '@/components/mood/MoodCalendar'
import Link from 'next/link'

function AdvancedFeaturesSkeleton() {
  return (
    <div className="max-w-7xl mx-auto py-10 space-y-6">
      <div className="text-center">
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AdvancedFeaturesContent() {
  return (
    <Suspense fallback={<AdvancedFeaturesSkeleton />}>
      <AdvancedFeaturesPage />
    </Suspense>
  )
}

function AdvancedFeaturesPage() {
  return (
    <div className="max-w-7xl mx-auto py-10">
      {/* هدر */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🚀 ویژگی‌های پیشرفته
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          تجربه کامل روان‌شناسی با مأموریت‌های روزانه، پیام‌رسانی خصوصی و تقویم احساسات
        </p>
      </div>

      {/* لینک‌های سریع */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/gamification">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🎮</div>
              <h3 className="text-lg font-semibold mb-2">سیستم گیمیفیکیشن</h3>
              <p className="text-sm text-gray-600">XP، سطح، دستاوردها و رتبه‌بندی</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/leaderboard">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-lg font-semibold mb-2">جدول رتبه‌بندی</h3>
              <p className="text-sm text-gray-600">برترین کاربران و رقابت</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/explore">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🌟</div>
              <h3 className="text-lg font-semibold mb-2">کاوش کاربران</h3>
              <p className="text-sm text-gray-600">آشنایی با جامعه Testology</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* ویژگی‌های اصلی */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* مأموریت‌های روزانه */}
        <div className="lg:col-span-1">
          <DailyMissions />
        </div>

        {/* تقویم احساسات */}
        <div className="lg:col-span-1">
          <MoodCalendar />
        </div>
      </div>

      {/* انتخاب احساس و پیام‌رسانی */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <MoodSelector 
          onSubmit={async (mood, note) => {
            try {
              const response = await fetch('/api/mood/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood, note })
              })
              
              if (response.ok) {
                alert('احساس شما با موفقیت ثبت شد!')
              }
            } catch (error) {
              console.error('Error submitting mood:', error)
            }
          }}
        />

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <span>پیام‌رسانی</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-lg font-semibold mb-2">سیستم پیام خصوصی</h3>
              <p className="text-gray-600 mb-4">
                با کاربران دیگر در ارتباط باشید و تجربیات خود را به اشتراک بگذارید
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div>• ارسال پیام خصوصی</div>
                <div>• چت زنده</div>
                <div>• اشتراک‌گذاری تجربیات</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* راهنمای استفاده */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-100 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span>راهنمای ویژگی‌های پیشرفته</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span>🎯</span>
                <span>مأموریت‌های روزانه</span>
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• هر روز مأموریت‌های جدید دریافت کنید</li>
                <li>• XP و دستاورد کسب کنید</li>
                <li>• پیشرفت خود را دنبال کنید</li>
                <li>• انگیزه برای فعالیت روزانه</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span>💬</span>
                <span>پیام‌رسانی</span>
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• با کاربران دیگر ارتباط برقرار کنید</li>
                <li>• تجربیات خود را به اشتراک بگذارید</li>
                <li>• از جامعه Testology بهره ببرید</li>
                <li>• پشتیبانی و راهنمایی دریافت کنید</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span>📊</span>
                <span>تقویم احساسات</span>
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• احساس روزانه خود را ثبت کنید</li>
                <li>• الگوهای روحی خود را شناسایی کنید</li>
                <li>• پیشرفت روانی خود را دنبال کنید</li>
                <li>• آمار و نمودارهای مفصل</li>
              </ul>
            </div>
          </div>

          <div className="bg-white bg-opacity-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <span>💡</span>
              <span>نکات مهم</span>
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• همه ویژگی‌ها به صورت خودکار با سیستم گیمیفیکیشن متصل هستند</p>
              <p>• فعالیت‌های شما XP و دستاورد به همراه دارد</p>
              <p>• داده‌های شما محفوظ و خصوصی هستند</p>
              <p>• می‌توانید در هر زمان تنظیمات را تغییر دهید</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdvancedFeatures() {
  return <AdvancedFeaturesContent />
}
















