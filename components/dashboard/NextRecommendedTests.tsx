'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Heart, 
  Shield, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Loader2
} from 'lucide-react'

interface RecommendedTest {
  id: string
  name: string
  slug: string
  description: string
  category: string
  priority: 'high' | 'medium' | 'low'
  reason: string
  estimatedTime: string
}

interface RecommendedTest {
  testId: string
  testName: string
  reason: string
  estimatedTime: string
  priority: 'high' | 'medium' | 'low'
  category: string
  description: string
}

interface NextRecommendedTestsProps {
  completedTests?: string[]
  overallStatus?: string
  onStartTest?: (testSlug: string) => void
}

export const NextRecommendedTests: React.FC<NextRecommendedTestsProps> = ({
  completedTests = [],
  overallStatus = 'good',
  onStartTest
}) => {
  const [recommendedTests, setRecommendedTests] = useState<RecommendedTest[]>([])
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState<any>(null)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/recommend-next-tests')
      const data = await response.json()
      setRecommendedTests(data.recommended || [])
      setAnalysis(data.analysis)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityBadge = (priority: string) => {
    const colorClasses = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    }

    const textClasses = {
      high: 'اولویت بالا',
      medium: 'اولویت متوسط',
      low: 'اولویت پایین'
    }

    return (
      <Badge className={`${colorClasses[priority as keyof typeof colorClasses]} px-2 py-1 text-xs`}>
        {textClasses[priority as keyof typeof textClasses]}
      </Badge>
    )
  }

  const getTestIcon = (category: string) => {
    switch (category) {
      case 'خلق و خو':
        return <Heart className="w-5 h-5 text-red-600" />
      case 'اضطراب':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      case 'شخصیت':
        return <Brain className="w-5 h-5 text-blue-600" />
      case 'خودشناسی':
        return <Shield className="w-5 h-5 text-green-600" />
      case 'کیفیت زندگی':
        return <Activity className="w-5 h-5 text-purple-600" />
      default:
        return <CheckCircle className="w-5 h-5 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardContent className="text-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">در حال بارگذاری پیشنهادات...</p>
        </CardContent>
      </Card>
    )
  }

  if (recommendedTests.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-xl">
            <CheckCircle className="w-6 h-6 text-green-600" />
            همه تست‌ها تکمیل شده
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            شما تمام تست‌های موجود را انجام داده‌اید. برای دریافت نتایج جدید، منتظر تست‌های جدید باشید.
          </p>
          <Button 
            onClick={() => onStartTest?.('phq9')}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            تکرار تست‌ها
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          تست‌های پیشنهادی بعدی
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          بر اساس وضعیت فعلی شما، این تست‌ها پیشنهاد می‌شوند
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {recommendedTests.map((test) => (
          <div key={test.testId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getTestIcon(test.category)}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {test.testName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {test.description}
                  </p>
                </div>
              </div>
              {getPriorityBadge(test.priority)}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">دلیل پیشنهاد:</span>
                <span>{test.reason}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">زمان تقریبی:</span>
                <span>{test.estimatedTime} دقیقه</span>
              </div>
            </div>
            
            <Button 
              onClick={() => onStartTest?.(test.testId)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              شروع تست
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        ))}
        
        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            برای مشاهده تمام تست‌های موجود
          </p>
          <Button 
            onClick={() => onStartTest?.('all')}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            مشاهده همه تست‌ها
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default NextRecommendedTests
