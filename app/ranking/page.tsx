import React from 'react'
import RankingList from '@/components/ranking/RankingList'
import { UserRanking } from '@/lib/services/ranking'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getRankings(): Promise<UserRanking[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/ranking`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('خطا در دریافت رتبه‌بندی')
    }
    
    const data = await response.json()
    return data.rankings || []
  } catch (error) {
    console.error('Error fetching rankings:', error)
    return []
  }
}

export default async function RankingPage() {
  const rankings = await getRankings()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🏆 جدول رتبه‌بندی تستولوژی
            </h1>
            <p className="text-lg text-gray-600">
              کاربران برتر بر اساس امتیاز و فعالیت در تست‌های روانشناسی
            </p>
          </div>

          {rankings.length > 0 ? (
            <RankingList rankings={rankings} />
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                هنوز کسی در رتبه‌بندی نیست
              </h3>
              <p className="text-gray-500">
                اولین کسی باشید که تست‌ها را انجام می‌دهد!
              </p>
            </div>
          )}

          <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">📊 نحوه محاسبه امتیاز</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">امتیاز پایه:</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• تکمیل هر تست: 10 امتیاز</li>
                  <li>• نمره بالا: تا 10 امتیاز اضافی</li>
                  <li>• تست‌های پیشرفته: امتیاز بیشتر</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">سطوح رتبه‌بندی:</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>🌱 تازه‌کار: 0-100 امتیاز</li>
                  <li>🌿 مبتدی: 101-300 امتیاز</li>
                  <li>🌳 متوسط: 301-600 امتیاز</li>
                  <li>🏆 پیشرفته: 601-1000 امتیاز</li>
                  <li>👑 استاد: 1001-2000 امتیاز</li>
                  <li>⭐ افسانه: 2000+ امتیاز</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
















