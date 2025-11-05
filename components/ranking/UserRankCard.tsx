'use client'

import React from 'react'
import { UserRanking } from '@/lib/services/ranking'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award, Star } from 'lucide-react'

interface UserRankCardProps {
  userRank: UserRanking
  showDetails?: boolean
}

export default function UserRankCard({ userRank, showDetails = true }: UserRankCardProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-8 w-8 text-yellow-500" />
    if (rank === 2) return <Medal className="h-8 w-8 text-gray-400" />
    if (rank === 3) return <Award className="h-8 w-8 text-amber-600" />
    if (rank <= 10) return <Star className="h-8 w-8 text-blue-500" />
    return <span className="text-2xl font-bold text-gray-500">#{rank}</span>
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300'
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
    if (rank === 3) return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300'
    if (rank <= 10) return 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300'
    return 'bg-white border-gray-200'
  }

  return (
    <Card className={`${getRankColor(userRank.rank)} transition-all hover:shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center justify-center w-16 h-16">
              {getRankIcon(userRank.rank)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 space-x-reverse mb-2">
                <h3 className="font-bold text-xl">{userRank.fullName}</h3>
                <span className="text-3xl">{userRank.badge}</span>
              </div>
              
              <p className="text-gray-600 mb-3">@{userRank.username}</p>
              
              {showDetails && (
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Badge variant="outline" className="text-sm">
                    {userRank.level}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {userRank.testCount} تست انجام داده
                  </span>
                  <span className="text-sm text-gray-500">
                    میانگین: {userRank.averageScore}%
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-1">
              {userRank.totalPoints}
            </div>
            <div className="text-sm text-gray-500">امتیاز کل</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
















