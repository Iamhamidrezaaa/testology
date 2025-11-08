'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// Tooltip component - using native HTML title attribute for now
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface UserBadge {
  id: string
  name: string
  description: string
  icon: string
  rarity: string
  earnedAt: string
}

interface UserBadgesProps {
  badges: UserBadge[]
  className?: string
}

export default function UserBadges({ badges, className = "" }: UserBadgesProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'epic': return 'bg-red-100 text-red-800 border-red-200'
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '👑'
      case 'epic': return '💎'
      case 'rare': return '⭐'
      case 'common': return '🏅'
      default: return '🏅'
    }
  }

  return (
    <Card className={`bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">🏆</span>
          <span>دستاوردهای شما</span>
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
            {badges.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-gray-600 mb-2">هنوز دستاوردی کسب نکرده‌اید</p>
            <p className="text-sm text-gray-500">
              تست‌ها را انجام دهید تا اولین دستاورد خود را کسب کنید!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`
                  relative p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 cursor-pointer
                  ${getRarityColor(badge.rarity)}
                `}
                title={`${badge.name}: ${badge.description} - کسب شده در: ${new Date(badge.earnedAt).toLocaleDateString('fa-IR')}`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className="text-xs font-medium truncate">
                    {badge.name}
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    {getRarityIcon(badge.rarity)}
                  </div>
                </div>
                
                {/* نشان تاریخ کسب */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            ))}
          </div>
        )}
        
        {/* انگیزه‌بخشی */}
        {badges.length > 0 && badges.length < 5 && (
          <div className="mt-4 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚀</span>
              <span className="text-sm font-medium text-blue-800">
                {5 - badges.length} دستاورد دیگر تا دستیابی به مجموعه کامل!
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
















