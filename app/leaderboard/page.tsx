import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getLevelIcon, getLevelColor, getLevelTitle } from '@/lib/services/level'
import { getRarityColor, getRarityIcon } from '@/lib/services/badges'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface LeaderboardUser {
  rank: number
  id: string
  username: string
  fullName: string
  avatar?: string
  level: number
  xp: number
  totalPoints: number
  badges: number
  recentBadges: Array<{
    name: string
    icon: string
    rarity: string
  }>
}

interface LeaderboardData {
  leaderboard: LeaderboardUser[]
  stats: {
    totalUsers: number
    totalXP: number
  }
}

async function getLeaderboard(): Promise<LeaderboardData> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/leaderboard`, {
    cache: 'no-store'
  })
  
  if (!response.ok) {
    throw new Error('خطا در دریافت رتبه‌بندی')
  }
  
  return response.json()
}

function LeaderboardSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <div className="text-center">
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function LeaderboardContent() {
  return (
    <Suspense fallback={<LeaderboardSkeleton />}>
      <LeaderboardPage />
    </Suspense>
  )
}

async function LeaderboardPage() {
  const data = await getLeaderboard()
  const { leaderboard, stats } = data

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    if (rank <= 10) return '🏆'
    return '⭐'
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300'
    if (rank === 2) return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300'
    if (rank === 3) return 'bg-gradient-to-r from-orange-100 to-orange-200 border-orange-300'
    if (rank <= 10) return 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
    return 'bg-white border-gray-200'
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      {/* هدر */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🏆 جدول برترین کاربران
        </h1>
        <p className="text-gray-600">
          {stats.totalUsers.toLocaleString('fa-IR')} کاربر • {stats.totalXP.toLocaleString('fa-IR')} XP کل
        </p>
      </div>

      {/* آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {leaderboard.length}
            </div>
            <div className="text-sm text-gray-600">کاربر در جدول</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {leaderboard.length > 0 ? leaderboard[0].xp.toLocaleString('fa-IR') : '0'}
            </div>
            <div className="text-sm text-gray-600">بیشترین XP</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {leaderboard.reduce((sum, user) => sum + user.badges, 0)}
            </div>
            <div className="text-sm text-gray-600">دستاورد کل</div>
          </CardContent>
        </Card>
      </div>

      {/* جدول رتبه‌بندی */}
      <div className="space-y-3">
        {leaderboard.map((user, index) => (
          <Card key={user.id} className={`transition-all duration-200 hover:shadow-lg ${getRankColor(user.rank)}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* رتبه */}
                <div className="flex items-center gap-2 min-w-[60px]">
                  <span className="text-2xl">{getRankIcon(user.rank)}</span>
                  <span className="font-bold text-lg">#{user.rank}</span>
                </div>

                {/* آواتار و نام */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.fullName} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      user.fullName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{user.fullName}</div>
                    <div className="text-sm text-gray-600">@{user.username}</div>
                  </div>
                </div>

                {/* سطح */}
                <div className="text-center min-w-[80px]">
                  <div className="flex items-center gap-1">
                    <span className="text-xl">{getLevelIcon(user.level)}</span>
                    <span className={`font-bold ${getLevelColor(user.level)}`}>
                      {user.level}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">{getLevelTitle(user.level)}</div>
                </div>

                {/* XP */}
                <div className="text-center min-w-[100px]">
                  <div className="font-bold text-lg">{user.xp.toLocaleString('fa-IR')}</div>
                  <div className="text-xs text-gray-600">XP</div>
                </div>

                {/* دستاوردها */}
                <div className="flex items-center gap-1 min-w-[120px]">
                  <span className="text-sm text-gray-600">{user.badges} دستاورد</span>
                  <div className="flex gap-1">
                    {user.recentBadges.map((badge, idx) => (
                      <div
                        key={idx}
                        className={`text-xs px-2 py-1 rounded-full ${getRarityColor(badge.rarity)}`}
                        title={badge.name}
                      >
                        {badge.icon}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* انگیزه‌بخشی */}
      <div className="mt-8 text-center">
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="text-2xl mb-2">🚀</div>
            <h3 className="text-lg font-semibold mb-2">به جدول برترین‌ها بپیوندید!</h3>
            <p className="text-gray-600 mb-4">
              تست‌های روان‌شناسی انجام دهید، XP کسب کنید و در رتبه‌بندی صعود کنید
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span>🎯</span>
                <span>تست انجام دهید</span>
              </div>
              <div className="flex items-center gap-1">
                <span>⭐</span>
                <span>XP کسب کنید</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🏆</span>
                <span>دستاورد بگیرید</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function Leaderboard() {
  return <LeaderboardContent />
}
