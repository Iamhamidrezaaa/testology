'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Share2, Download, Heart, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

interface ResultCardProps {
  title: string
  description: string
  score?: number
  totalScore?: number
  level?: 'low' | 'mild' | 'moderate' | 'severe' | 'high'
  testType: string
  recommendations?: string[]
  strengths?: string[]
  weaknesses?: string[]
  onShare?: () => void
  onDownload?: () => void
  onSave?: () => void
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  description,
  score,
  totalScore,
  level,
  testType,
  recommendations = [],
  strengths = [],
  weaknesses = [],
  onShare,
  onDownload,
  onSave
}) => {
  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'mild':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'moderate':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'severe':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLevelIcon = (level?: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'mild':
        return <TrendingUp className="w-4 h-4 text-yellow-600" />
      case 'moderate':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />
      case 'severe':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'high':
        return <Heart className="w-4 h-4 text-blue-600" />
      default:
        return <CheckCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getLevelText = (level?: string) => {
    switch (level) {
      case 'low':
        return 'پایین'
      case 'mild':
        return 'خفیف'
      case 'moderate':
        return 'متوسط'
      case 'severe':
        return 'شدید'
      case 'high':
        return 'بالا'
      default:
        return 'نامشخص'
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </CardTitle>
          
          {/* نمره و وضعیت */}
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {score !== undefined && totalScore !== undefined && (
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">نمره:</span>
                <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {score} از {totalScore}
                </span>
              </div>
            )}
            
            {level && (
              <Badge className={`${getLevelColor(level)} flex items-center gap-2 px-4 py-2`}>
                {getLevelIcon(level)}
                <span className="font-medium">{getLevelText(level)}</span>
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* توضیحات اصلی */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              تحلیل نتایج
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>

          {/* نقاط قوت */}
          {strengths.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                نقاط قوت شما
              </h3>
              <ul className="space-y-2">
                {strengths.map((strength, index) => (
                  <li key={index} className="text-green-800 dark:text-green-200 flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* نقاط ضعف */}
          {weaknesses.length > 0 && (
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                نقاط قابل بهبود
              </h3>
              <ul className="space-y-2">
                {weaknesses.map((weakness, index) => (
                  <li key={index} className="text-orange-800 dark:text-orange-200 flex items-start gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* پیشنهادات */}
          {recommendations.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                پیشنهادات و راهنمایی
              </h3>
              <ul className="space-y-2">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="text-blue-800 dark:text-blue-200 flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* دکمه‌های عملیات */}
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            {onSave && (
              <Button 
                onClick={onSave}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <Heart className="w-4 h-4" />
                ذخیره در داشبورد
              </Button>
            )}
            
            {onShare && (
              <Button 
                onClick={onShare}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                اشتراک‌گذاری
              </Button>
            )}
            
            {onDownload && (
              <Button 
                onClick={onDownload}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                دانلود PDF
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResultCard

























