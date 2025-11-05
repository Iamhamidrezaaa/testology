import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getLevelIcon, getLevelColor, getLevelTitle } from '@/lib/services/level'
import { getRarityColor } from '@/lib/services/badges'

interface ExploreUser {
  id: string
  username: string
  fullName: string
  avatar?: string
  level: number
  xp: number
  badges: number
  bio?: string
  recentBadges: Array<{
    name: string
    icon: string
    rarity: string
  }>
}

async function getExploreUsers(): Promise<ExploreUser[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/explore/users`, {
    cache: 'no-store'
  })
  
  if (!response.ok) {
    throw new Error('خطا در دریافت کاربران')
  }
  
  return response.json()
}

function ExploreSkeleton() {
  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="text-center mb-8">
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ExploreContent() {
  return (
    <Suspense fallback={<ExploreSkeleton />}>
      <ExplorePage />
    </Suspense>
  )
}

async function ExplorePage() {
  const users = await getExploreUsers()

  return (
    <div className="max-w-6xl mx-auto py-10">
      {/* هدر */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          🌟 کاوش کاربران
        </h1>
        <p className="text-gray-600">
          با کاربران فعال Testology آشنا شوید و از تجربیات آن‌ها الهام بگیرید
        </p>
      </div>

      {/* فیلترها */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <Badge variant="outline" className="px-4 py-2">همه</Badge>
        <Badge variant="outline" className="px-4 py-2">سطح بالا</Badge>
        <Badge variant="outline" className="px-4 py-2">دستاوردها</Badge>
        <Badge variant="outline" className="px-4 py-2">فعال</Badge>
      </div>

      {/* لیست کاربران */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              {/* هدر کارت */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    user.fullName.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{user.fullName}</h3>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-lg">{getLevelIcon(user.level)}</span>
                    <span className={`font-bold ${getLevelColor(user.level)}`}>
                      {user.level}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">{getLevelTitle(user.level)}</div>
                </div>
              </div>

              {/* بیو */}
              {user.bio && (
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                  {user.bio}
                </p>
              )}

              {/* آمار */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="font-bold text-blue-600">{user.xp.toLocaleString('fa-IR')}</div>
                  <div className="text-xs text-gray-600">XP</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <div className="font-bold text-green-600">{user.badges}</div>
                  <div className="text-xs text-gray-600">دستاورد</div>
                </div>
              </div>

              {/* دستاوردهای اخیر */}
              {user.recentBadges.length > 0 && (
                <div>
                  <div className="text-xs text-gray-600 mb-2">دستاوردهای اخیر:</div>
                  <div className="flex gap-1 flex-wrap">
                    {user.recentBadges.slice(0, 3).map((badge, idx) => (
                      <div
                        key={idx}
                        className={`text-xs px-2 py-1 rounded-full ${getRarityColor(badge.rarity)}`}
                        title={badge.name}
                      >
                        {badge.icon}
                      </div>
                    ))}
                    {user.badges > 3 && (
                      <div className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        +{user.badges - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* دکمه مشاهده پروفایل */}
              <div className="mt-4 pt-4 border-t">
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200">
                  مشاهده پروفایل
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* انگیزه‌بخشی */}
      <div className="mt-12 text-center">
        <Card className="bg-gradient-to-r from-purple-50 to-pink-100 border-purple-200">
          <CardContent className="p-8">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold mb-4">به جامعه Testology بپیوندید!</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              با کاربران دیگر در مسیر رشد روان‌شناسی همراه شوید، تجربیات خود را به اشتراک بگذارید 
              و از سفر خودآگاهی لذت ببرید
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">🧠</span>
                <span>تست‌های روان‌شناسی</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🏆</span>
                <span>دستاوردها</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">👥</span>
                <span>جامعه</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function Explore() {
  return <ExploreContent />
}