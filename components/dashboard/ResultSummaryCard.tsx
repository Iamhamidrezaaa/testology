'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Eye, 
  Calendar, 
  BarChart3, 
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface ResultSummaryCardProps {
  id: string
  testName: string
  testSlug: string
  score?: number
  totalScore?: number
  result: string
  createdAt: string
  level: string
  levelText: string
  levelColor: string
  onViewResult: (id: string) => void
}

export const ResultSummaryCard: React.FC<ResultSummaryCardProps> = ({
  id,
  testName,
  testSlug,
  score,
  totalScore,
  result,
  createdAt,
  level,
  levelText,
  levelColor,
  onViewResult
}) => {
  const getLevelBadge = () => {
    const colorClasses = {
      green: 'bg-green-100 text-green-800 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200'
    }

    return (
      <Badge className={`${colorClasses[levelColor as keyof typeof colorClasses] || colorClasses.green} px-3 py-1`}>
        {levelText}
      </Badge>
    )
  }

  const getTestIcon = (testSlug: string) => {
    switch (testSlug) {
      case 'phq9':
        return <TrendingUp className="w-5 h-5 text-blue-600" />
      case 'gad7':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      case 'mbti':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getTestDescription = (testSlug: string) => {
    switch (testSlug) {
      case 'phq9':
        return 'تست افسردگی'
      case 'gad7':
        return 'تست اضطراب'
      case 'mbti':
        return 'تست شخصیت'
      default:
        return 'تست روانشناسی'
    }
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getTestIcon(testSlug)}
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                {testName}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getTestDescription(testSlug)}
              </p>
            </div>
          </div>
          {getLevelBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* اطلاعات تست */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{new Date(createdAt).toLocaleDateString('fa-IR')}</span>
          </div>
          
          {score !== undefined && totalScore !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <BarChart3 className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">
                نمره: <span className="font-semibold">{score}</span> از {totalScore}
              </span>
            </div>
          )}
        </div>

        {/* خلاصه نتیجه */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {result.length > 120 
              ? `${result.substring(0, 120)}...` 
              : result
            }
          </p>
        </div>

        {/* دکمه مشاهده */}
        <Button 
          onClick={() => onViewResult(id)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          مشاهده جزئیات
        </Button>
      </CardContent>
    </Card>
  )
}

export default ResultSummaryCard

























