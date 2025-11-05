'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecommendationBoxProps {
  title: string
  description: string
  type: 'test' | 'practice' | 'referral'
  status: 'pending' | 'completed' | 'overdue'
  deadline?: Date
  onComplete?: () => void
  onPostpone?: () => void
  onNeedHelp?: () => void
  done: boolean
  link: string
}

export function RecommendationBox({
  title,
  description,
  type,
  status,
  deadline,
  onComplete,
  onPostpone,
  onNeedHelp,
}: RecommendationBoxProps) {
  return (
    <Card className={cn(
      'transition-colors',
      status === 'overdue' && 'border-red-200 bg-red-50',
      status === 'completed' && 'border-green-200 bg-green-50'
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant={type === 'test' ? 'default' : type === 'practice' ? 'secondary' : 'outline'}>
            {type === 'test' ? 'تست' : type === 'practice' ? 'تمرین' : 'ارجاع'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{description}</p>
        {deadline && (
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>مهلت: {new Date(deadline).toLocaleDateString('fa-IR')}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        {status !== 'completed' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onPostpone}
            >
              تعویق
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNeedHelp}
            >
              نیاز به کمک
            </Button>
          </>
        )}
        <Button
          variant={status === 'completed' ? 'outline' : 'default'}
          size="sm"
          onClick={onComplete}
        >
          {status === 'completed' ? 'انجام شده' : 'انجام دادم'}
        </Button>
      </CardFooter>
    </Card>
  )
} 