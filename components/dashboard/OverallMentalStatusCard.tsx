'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Brain,
  Heart,
  Shield,
  Activity
} from 'lucide-react'

interface OverallMentalStatusCardProps {
  totalTests: number
  completedTests: number
  averageScore: number
  overallStatus: string
  overallStatusText: string
  overallStatusColor: string
  analysis?: string
  recommendations?: string[]
}

export const OverallMentalStatusCard: React.FC<OverallMentalStatusCardProps> = ({
  totalTests,
  completedTests,
  averageScore,
  overallStatus,
  overallStatusText,
  overallStatusColor,
  analysis,
  recommendations = []
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <AlertTriangle className="w-8 h-8 text-red-600" />
      case 'attention':
        return <TrendingUp className="w-8 h-8 text-orange-600" />
      default:
        return <CheckCircle className="w-8 h-8 text-green-600" />
    }
  }

  const getStatusBadge = () => {
    const colorClasses = {
      green: 'bg-green-100 text-green-800 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      red: 'bg-red-100 text-red-800 border-red-200'
    }

    return (
      <Badge className={`${colorClasses[overallStatusColor as keyof typeof colorClasses] || colorClasses.green} px-4 py-2 text-lg`}>
        {overallStatusText}
      </Badge>
    )
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'critical':
        return 'وضعیت شما نیاز به توجه فوری دارد. لطفاً با یک متخصص تماس بگیرید.'
      case 'attention':
        return 'وضعیت شما نیاز به توجه دارد. توصیه می‌شود با یک متخصص مشورت کنید.'
      default:
        return 'وضعیت کلی شما خوب است. ادامه‌دهنده تست‌های منظم برای حفظ سلامت روانی.'
    }
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          {getStatusIcon(overallStatus)}
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            وضعیت کلی روانی
          </CardTitle>
        </div>
        {getStatusBadge()}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* آمار کلی */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">تست‌ها</span>
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {totalTests}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              {completedTests} تکمیل‌شده
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">میانگین</span>
            </div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {averageScore.toFixed(1)}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              نمره کلی
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">وضعیت</span>
            </div>
            <div className="text-lg font-bold text-purple-900 dark:text-purple-100">
              {overallStatusText}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">
              سلامت روانی
            </div>
          </div>
        </div>

        {/* پیام وضعیت */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                تحلیل وضعیت
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {getStatusMessage(overallStatus)}
              </p>
            </div>
          </div>
        </div>

        {/* تحلیل اضافی */}
        {analysis && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              تحلیل هوشمند
            </h4>
            <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
              {analysis}
            </p>
          </div>
        )}

        {/* پیشنهادات */}
        {recommendations.length > 0 && (
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              پیشنهادات
            </h4>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="text-orange-800 dark:text-orange-200 text-sm flex items-start gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default OverallMentalStatusCard

























