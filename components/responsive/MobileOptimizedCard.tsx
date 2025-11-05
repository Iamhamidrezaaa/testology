'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MobileOptimizedCardProps {
  title?: string
  children: ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
  icon?: string
  gradient?: boolean
}

export default function MobileOptimizedCard({
  title,
  children,
  className = "",
  headerClassName = "",
  contentClassName = "",
  icon,
  gradient = false
}: MobileOptimizedCardProps) {
  return (
    <Card className={cn(
      'w-full shadow-sm hover:shadow-md transition-shadow duration-200',
      gradient && 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200',
      className
    )}>
      {title && (
        <CardHeader className={cn(
          'pb-3',
          headerClassName
        )}>
          <CardTitle className={cn(
            'text-lg sm:text-xl font-semibold flex items-center gap-2',
            'text-gray-800'
          )}>
            {icon && <span className="text-2xl">{icon}</span>}
            <span className="truncate">{title}</span>
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className={cn(
        'p-4 sm:p-6',
        contentClassName
      )}>
        <div className="space-y-3 sm:space-y-4">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}
















