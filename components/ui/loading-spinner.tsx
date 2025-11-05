import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  text 
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center gap-2">
        <div 
          className={cn(
            'animate-spin rounded-full border-2 border-gray-300 border-t-blue-500',
            sizeClasses[size]
          )}
        />
        {text && (
          <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  )
}

export function PageLoader({ text = 'در حال بارگذاری...' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center" dir="rtl">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 animate-pulse">
          {text}
        </p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  )
}

export function CardLoader() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 w-3/4 mb-2"></div>
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 w-1/2 mb-4"></div>
      <div className="space-y-2">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-3 w-full"></div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-3 w-5/6"></div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-3 w-4/6"></div>
      </div>
    </div>
  )
}

export function TableLoader({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 w-1/4"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 w-1/4"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 w-1/4"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

