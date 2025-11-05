"use client"

import { useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  AlertCircle, 
  Clock, 
  Smartphone, 
  RefreshCw, 
  HelpCircle,
  CheckCircle
} from 'lucide-react'

interface TwoFAErrorHandlerProps {
  error: {
    message: string
    errorCode?: string
    troubleshooting?: string[]
  }
  onRetry?: () => void
  onDisable2FA?: () => void
  onShowGuide?: () => void
}

export default function TwoFAErrorHandler({ 
  error, 
  onRetry, 
  onDisable2FA, 
  onShowGuide 
}: TwoFAErrorHandlerProps) {
  const [showTroubleshooting, setShowTroubleshooting] = useState(false)

  const getErrorIcon = (errorCode?: string) => {
    switch (errorCode) {
      case 'INVALID_2FA_CODE':
        return <Clock className="h-5 w-5 text-orange-500" />
      case '2FA_SERVER_ERROR':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getErrorTitle = (errorCode?: string) => {
    switch (errorCode) {
      case 'INVALID_2FA_CODE':
        return 'کد احراز هویت نادرست'
      case '2FA_SERVER_ERROR':
        return 'خطا در سرور'
      default:
        return 'خطا در احراز هویت دو مرحله‌ای'
    }
  }

  const getQuickFixes = (errorCode?: string) => {
    switch (errorCode) {
      case 'INVALID_2FA_CODE':
        return [
          'کد جدیدی از اپ احراز هویت دریافت کنید',
          'اطمینان حاصل کنید که کد 6 رقمی است',
          'زمان سیستم خود را بررسی کنید',
          'در صورت ادامه مشکل، اپ را مجدداً راه‌اندازی کنید'
        ]
      case '2FA_SERVER_ERROR':
        return [
          'اتصال اینترنت خود را بررسی کنید',
          'صفحه را رفرش کنید',
          'در صورت ادامه مشکل، با پشتیبانی تماس بگیرید'
        ]
      default:
        return [
          'دوباره تلاش کنید',
          'صفحه را رفرش کنید',
          'در صورت ادامه مشکل، با پشتیبانی تماس بگیرید'
        ]
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          {getErrorIcon(error.errorCode)}
          {getErrorTitle(error.errorCode)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="font-semibold text-sm">راه‌حل‌های سریع:</h4>
          {getQuickFixes(error.errorCode).map((fix, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{fix}</span>
            </div>
          ))}
        </div>

        {error.troubleshooting && error.troubleshooting.length > 0 && (
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTroubleshooting(!showTroubleshooting)}
              className="w-full"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              راهنمای کامل
            </Button>
            
            {showTroubleshooting && (
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <h5 className="font-semibold text-sm">راهنمای کامل:</h5>
                {error.troubleshooting.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-500 font-semibold">{index + 1}.</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {onRetry && (
            <Button onClick={onRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              دوباره تلاش کنید
            </Button>
          )}
          
          {onShowGuide && (
            <Button variant="outline" onClick={onShowGuide} className="w-full">
              <Smartphone className="h-4 w-4 mr-2" />
              راهنمای تنظیم 2FA
            </Button>
          )}
          
          {onDisable2FA && (
            <Button 
              variant="destructive" 
              onClick={onDisable2FA} 
              className="w-full"
            >
              غیرفعال کردن 2FA
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center">
          در صورت ادامه مشکل، با پشتیبانی فنی تماس بگیرید
        </div>
      </CardContent>
    </Card>
  )
}





