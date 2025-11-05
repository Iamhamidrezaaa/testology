'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, Star } from 'lucide-react'

interface PopularTestCardProps {
  test: {
    slug: string
    name: string
    completionCount: number
    details?: {
      id: string
      title: string
      description: string
      category: string
      estimatedTime: number
      difficulty: string
    }
  }
}

export default function PopularTestCard({ test }: PopularTestCardProps) {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'آسان': return 'text-green-600 bg-green-100'
      case 'متوسط': return 'text-yellow-600 bg-yellow-100'
      case 'سخت': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryEmoji = (category?: string) => {
    const categoryMap: { [key: string]: string } = {
      'شخصیت': '🧠',
      'عزت نفس': '💪',
      'اضطراب': '😰',
      'افسردگی': '😢',
      'استرس': '😤',
      'خواب': '😴',
      'روابط': '❤️',
      'شغل': '💼',
      'تحصیل': '📚'
    }
    return categoryMap[category || ''] || '🧠'
  }

  return (
    <Link href={`/tests/${test.slug}`}>
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                <span className="text-2xl">{getCategoryEmoji(test.details?.category)}</span>
                <h3 className="text-lg font-semibold text-gray-900">
                  {test.details?.title || test.name}
                </h3>
              </div>
              
              {test.details?.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {test.details.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 ml-1" />
                {test.completionCount.toLocaleString()} نفر
              </div>
              
              {test.details?.estimatedTime && (
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 ml-1" />
                  {test.details.estimatedTime} دقیقه
                </div>
              )}
              
              {test.details?.difficulty && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getDifficultyColor(test.details.difficulty)}`}
                >
                  {test.details.difficulty}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 ml-1" />
              <span className="text-sm font-medium">محبوب</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}