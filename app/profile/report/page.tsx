'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import ResponsiveContainer from '@/components/responsive/ResponsiveContainer'
import ResponsiveGrid from '@/components/responsive/ResponsiveGrid'
import MobileOptimizedCard from '@/components/responsive/MobileOptimizedCard'
import Link from 'next/link'

export default function ReportPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastGenerated, setLastGenerated] = useState<string | null>(null)

  const generateReport = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/report/generate')
      
      if (!response.ok) {
        throw new Error('خطا در تولید گزارش')
      }

      // دریافت فایل PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      // دانلود فایل
      const a = document.createElement('a')
      a.href = url
      a.download = `testology-report-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setLastGenerated(new Date().toLocaleString('fa-IR'))
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ResponsiveContainer maxWidth="lg" padding="md" className="space-y-6">
      {/* هدر */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          📄 گزارش روان‌شناسی
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          تولید گزارش کامل از وضعیت روان‌شناختی و پیشرفت شما
        </p>
      </div>

      {/* اطلاعات گزارش */}
      <ResponsiveGrid 
        cols={{ default: 1, md: 2 }} 
        gap="md"
        className="mb-6"
      >
        <MobileOptimizedCard 
          title="محتوای گزارش"
          icon="📋"
          className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">👤</span>
              <span className="text-sm text-gray-700">اطلاعات کاربر و پیشرفت</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🧠</span>
              <span className="text-sm text-gray-700">نتایج تست‌های روان‌شناسی</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📦</span>
              <span className="text-sm text-gray-700">تمرین‌های هفتگی</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">😊</span>
              <span className="text-sm text-gray-700">ورودی‌های احساسات</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <span className="text-sm text-gray-700">تحلیل روان‌شناسی</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎥</span>
              <span className="text-sm text-gray-700">ویدئوهای ضبط شده</span>
            </div>
          </div>
        </MobileOptimizedCard>

        <MobileOptimizedCard 
          title="ویژگی‌های گزارش"
          icon="✨"
          className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <span className="text-sm text-gray-700">نمودارها و آمار کامل</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <span className="text-sm text-gray-700">توصیه‌های شخصی‌سازی شده</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📈</span>
              <span className="text-sm text-gray-700">روند پیشرفت در طول زمان</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🔒</span>
              <span className="text-sm text-gray-700">امن و خصوصی</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📱</span>
              <span className="text-sm text-gray-700">قابل اشتراک‌گذاری با درمانگر</span>
            </div>
          </div>
        </MobileOptimizedCard>
      </ResponsiveGrid>

      {/* دکمه تولید گزارش */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-100 border-indigo-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-4xl mb-4">📄</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              تولید گزارش کامل
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              گزارش جامع از تمام فعالیت‌ها، تست‌ها، تمرین‌ها و پیشرفت‌های شما
            </p>
            
            {lastGenerated && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-700">
                  ✅ آخرین گزارش: {lastGenerated}
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-700">
                  ❌ {error}
                </p>
              </div>
            )}

            <Button
              onClick={generateReport}
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 text-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>در حال تولید...</span>
                </div>
              ) : (
                '📄 تولید و دانلود گزارش'
              )}
            </Button>
            
            <p className="text-xs text-gray-500 mt-2">
              گزارش به صورت PDF تولید و دانلود می‌شود
            </p>
          </div>
        </CardContent>
      </Card>

      {/* راهنمای استفاده */}
      <MobileOptimizedCard 
        title="راهنمای استفاده"
        icon="💡"
        className="bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200"
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-lg">1️⃣</span>
            <div>
              <p className="text-sm font-medium text-gray-800">تولید گزارش</p>
              <p className="text-xs text-gray-600">روی دکمه "تولید و دانلود گزارش" کلیک کنید</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-lg">2️⃣</span>
            <div>
              <p className="text-sm font-medium text-gray-800">دانلود خودکار</p>
              <p className="text-xs text-gray-600">فایل PDF به صورت خودکار دانلود می‌شود</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-lg">3️⃣</span>
            <div>
              <p className="text-sm font-medium text-gray-800">اشتراک‌گذاری</p>
              <p className="text-xs text-gray-600">گزارش را با درمانگر یا روان‌شناس خود به اشتراک بگذارید</p>
            </div>
          </div>
        </div>
      </MobileOptimizedCard>

      {/* نکات مهم */}
      <MobileOptimizedCard 
        title="نکات مهم"
        icon="⚠️"
        className="bg-gradient-to-br from-red-50 to-pink-100 border-red-200"
      >
        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            • این گزارش صرفاً جنبه اطلاع‌رسانی دارد
          </p>
          <p className="text-sm text-gray-700">
            • جایگزین مشاوره تخصصی نیست
          </p>
          <p className="text-sm text-gray-700">
            • در صورت نیاز به مشاوره، با متخصص تماس بگیرید
          </p>
          <p className="text-sm text-gray-700">
            • اطلاعات شما محرمانه و امن نگهداری می‌شود
          </p>
        </div>
      </MobileOptimizedCard>

      {/* لینک‌های مفید */}
      <div className="text-center space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/profile/progress">
            <Button variant="outline" className="w-full sm:w-auto">
              📊 مسیر پیشرفت
            </Button>
          </Link>
          
          <Link href="/profile/mental-health">
            <Button variant="outline" className="w-full sm:w-auto">
              🧠 تحلیل روان‌شناسی
            </Button>
          </Link>
          
          <Link href="/tests">
            <Button variant="outline" className="w-full sm:w-auto">
              🧠 تست‌های جدید
            </Button>
          </Link>
        </div>
      </div>
    </ResponsiveContainer>
  )
}
















