'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TestResult } from '@prisma/client'
import { format } from 'date-fns-jalali'
import Link from 'next/link'

interface TestCardProps {
  test: TestResult
}

export function TestCard({ test }: TestCardProps) {
  const getScoreColor = (score: number | null, testSlug: string) => {
    if (score === null) return 'bg-gray-100 text-gray-600'
    
    // رنگ‌بندی بر اساس نوع تست
    switch (testSlug) {
      case 'rosenberg':
        if (score >= 30) return 'bg-green-100 text-green-800'
        if (score >= 20) return 'bg-yellow-100 text-yellow-800'
        return 'bg-red-100 text-red-800'
      
      case 'gad7':
      case 'phq9':
        if (score <= 4) return 'bg-green-100 text-green-800'
        if (score <= 9) return 'bg-yellow-100 text-yellow-800'
        return 'bg-red-100 text-red-800'
      
      case 'swls':
        if (score >= 25) return 'bg-green-100 text-green-800'
        if (score >= 15) return 'bg-yellow-100 text-yellow-800'
        return 'bg-red-100 text-red-800'
      
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const getScoreLabel = (score: number | null, testSlug: string) => {
    if (score === null) return 'نامشخص'
    
    switch (testSlug) {
      case 'rosenberg':
        if (score >= 30) return 'عالی'
        if (score >= 20) return 'خوب'
        return 'نیاز به بهبود'
      
      case 'gad7':
        if (score <= 4) return 'کم'
        if (score <= 9) return 'متوسط'
        return 'زیاد'
      
      case 'phq9':
        if (score <= 4) return 'کم'
        if (score <= 9) return 'متوسط'
        return 'زیاد'
      
      case 'swls':
        if (score >= 25) return 'عالی'
        if (score >= 15) return 'خوب'
        return 'نیاز به بهبود'
      
      default:
        return 'طبیعی'
    }
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-800">
            {test.testName}
          </CardTitle>
          <Badge className={getScoreColor(test.score, test.testSlug || "")}>
            {getScoreLabel(test.score, test.testSlug || "")}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>📅 تاریخ:</span>
          <span>{format(new Date(test.createdAt), 'yyyy/MM/dd')}</span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>📊 امتیاز:</span>
          <span className="font-semibold">{test.score ?? '—'}</span>
        </div>
        
        {test.resultText && (
          <div className="text-xs text-gray-500 line-clamp-2">
            {test.resultText.substring(0, 100)}...
          </div>
        )}
        
        <Link href={`/results/${test.id}`} className="block">
          <Button size="sm" className="w-full mt-3">
            مشاهده تحلیل کامل
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

















