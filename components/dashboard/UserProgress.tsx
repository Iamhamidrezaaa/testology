'use client'

import { calculateLevelFromXP, getLevelTitle, getLevelColor, getLevelIcon } from '@/lib/services/level'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface UserProgressProps {
  xp: number
  level: number
  totalPoints: number
  className?: string
}

export default function UserProgress({ xp, level, totalPoints, className = "" }: UserProgressProps) {
  const levelInfo = calculateLevelFromXP(xp)
  const levelTitle = getLevelTitle(level)
  const levelColor = getLevelColor(level)
  const levelIcon = getLevelIcon(level)

  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">{levelIcon}</span>
          <span>پیشرفت شما</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* سطح و عنوان */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${levelColor}`}>
                سطح {level}
              </span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {levelTitle}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {totalPoints.toLocaleString('fa-IR')} امتیاز کل
            </p>
          </div>
        </div>

        {/* نوار پیشرفت */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">پیشرفت به سطح بعدی</span>
            <span className="font-medium">
              {levelInfo.remainingXP} / {levelInfo.nextLevelXP} XP
            </span>
          </div>
          
          <div className="relative">
            <Progress 
              value={levelInfo.progressPercentage} 
              className="h-3 bg-gray-200"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-white drop-shadow-sm">
                {levelInfo.progressPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* آمار کلی */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              {xp.toLocaleString('fa-IR')}
            </div>
            <div className="text-xs text-gray-600">XP کل</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {levelInfo.nextLevelXP - levelInfo.remainingXP}
            </div>
            <div className="text-xs text-gray-600">XP تا سطح بعدی</div>
          </div>
        </div>

        {/* انگیزه‌بخشی */}
        {levelInfo.progressPercentage > 80 && (
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <span className="text-sm font-medium text-green-800">
                نزدیک به ارتقاء سطح هستید!
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
















