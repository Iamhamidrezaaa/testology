'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // لاگ کردن خطا
    console.error('Application Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center" dir="rtl">
      <div className="text-center max-w-md mx-4">
        <div className="mb-8">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            خطای سیستم
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            متأسفانه خطایی در سیستم رخ داده است. لطفاً دوباره تلاش کنید.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-left text-sm">
              <p className="font-semibold mb-2">جزئیات خطا:</p>
              <code className="text-red-600">{error.message}</code>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Button onClick={reset} className="w-full" size="lg">
            <RefreshCw className="w-5 h-5 ml-2" />
            تلاش مجدد
          </Button>
          
          <Link href="/">
            <Button variant="outline" className="w-full" size="lg">
              <Home className="w-5 h-5 ml-2" />
              بازگشت به خانه
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>اگر مشکل ادامه دارد، لطفاً با پشتیبانی تماس بگیرید.</p>
        </div>
      </div>
    </div>
  )
}





