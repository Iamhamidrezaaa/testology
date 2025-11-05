'use client'

import React from 'react'
import { UserRanking } from '@/lib/services/ranking'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award } from 'lucide-react'

interface RankingListProps {
  rankings: UserRanking[]
}

export default function RankingList({ rankings }: RankingListProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />
    return <span className="text-lg font-bold text-gray-500">#{rank}</span>
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-50 border-yellow-200'
    if (rank === 2) return 'bg-gray-50 border-gray-200'
    if (rank === 3) return 'bg-amber-50 border-amber-200'
    return 'bg-white border-gray-200'
  }

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-center mb-6">🏆 جدول رتبه‌بندی</h2>
      
      {rankings.map((user) => (
        <Card 
          key={user.id} 
          className={`${getRankColor(user.rank)} transition-all hover:shadow-md`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex items-center justify-center w-12 h-12">
                  {getRankIcon(user.rank)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <h3 className="font-semibold text-lg">{user.fullName}</h3>
                    <span className="text-2xl">{user.badge}</span>
                  </div>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                  <div className="flex items-center space-x-4 space-x-reverse mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {user.level}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {user.totalPoints} امتیاز
                    </span>
                    <span className="text-sm text-gray-500">
                      {user.testCount} تست
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {user.totalPoints}
                </div>
                <div className="text-sm text-gray-500">امتیاز</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
















