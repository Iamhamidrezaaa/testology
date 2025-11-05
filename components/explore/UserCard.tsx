'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Calendar, Award } from 'lucide-react'

interface UserCardProps {
  user: {
    id: string
    username: string
    fullName: string
    bio?: string
    mood?: string
    totalPoints: number
    testCount: number
    joinDate: string
  }
}

export default function UserCard({ user }: UserCardProps) {
  const getMoodEmoji = (mood?: string) => {
    const moodMap: { [key: string]: string } = {
      'happy': '😊',
      'sad': '😢',
      'anxious': '😰',
      'calm': '😌',
      'excited': '🤩',
      'tired': '😴',
      'confident': '💪',
      'confused': '😕'
    }
    return moodMap[mood || ''] || '😊'
  }

  const getLevelFromPoints = (points: number) => {
    if (points >= 2000) return { name: 'افسانه', badge: '⭐', color: 'text-red-500' }
    if (points >= 1000) return { name: 'استاد', badge: '👑', color: 'text-yellow-500' }
    if (points >= 600) return { name: 'پیشرفته', badge: '🏆', color: 'text-purple-500' }
    if (points >= 300) return { name: 'متوسط', badge: '🌳', color: 'text-blue-500' }
    if (points >= 100) return { name: 'مبتدی', badge: '🌿', color: 'text-green-600' }
    return { name: 'تازه‌کار', badge: '🌱', color: 'text-green-500' }
  }

  const level = getLevelFromPoints(user.totalPoints)

  return (
    <Link href={`/profile/${user.username}`}>
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.fullName.charAt(0)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {user.fullName}
                </h3>
                <span className="text-2xl">{getMoodEmoji(user.mood)}</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">@{user.username}</p>
              
              {user.bio && (
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                  {user.bio}
                </p>
              )}
              
              <div className="flex items-center space-x-4 space-x-reverse mb-3">
                <Badge variant="outline" className={`text-xs ${level.color}`}>
                  <span className="ml-1">{level.badge}</span>
                  {level.name}
                </Badge>
                <div className="flex items-center text-xs text-gray-500">
                  <Award className="w-4 h-4 ml-1" />
                  {user.totalPoints} امتیاز
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <User className="w-4 h-4 ml-1" />
                  {user.testCount} تست
                </div>
              </div>
              
              <div className="flex items-center text-xs text-gray-400">
                <Calendar className="w-4 h-4 ml-1" />
                عضویت از {new Date(user.joinDate).toLocaleDateString('fa-IR')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}