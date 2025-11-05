"use client"

import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react'

interface TimeSyncCheckerProps {
  onTimeSync?: (isSynced: boolean) => void
}

export default function TimeSyncChecker({ onTimeSync }: TimeSyncCheckerProps) {
  const [timeOffset, setTimeOffset] = useState<number | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const checkTimeSync = async () => {
    setIsChecking(true)
    try {
      // دریافت زمان سرور
      const response = await fetch('/api/time-check')
      const serverTime = await response.json()
      
      if (serverTime.success) {
        const clientTime = new Date().getTime()
        const serverTimeMs = new Date(serverTime.timestamp).getTime()
        const offset = Math.abs(clientTime - serverTimeMs)
        
        setTimeOffset(offset)
        setLastCheck(new Date())
        
        // اگر اختلاف زمان بیش از 30 ثانیه باشد، هشدار نمایش دهید
        if (offset > 30000) {
          onTimeSync?.(false)
        } else {
          onTimeSync?.(true)
        }
      }
    } catch (error) {
      console.error('Error checking time sync:', error)
      setTimeOffset(null)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    // بررسی وضعیت آنلاین
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // بررسی اولیه
    checkTimeSync()
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const getTimeSyncStatus = () => {
    if (!isOnline) {
      return {
        icon: <WifiOff className="h-5 w-5 text-red-500" />,
        title: 'عدم اتصال به اینترنت',
        description: 'لطفاً اتصال اینترنت خود را بررسی کنید',
        variant: 'destructive' as const
      }
    }

    if (timeOffset === null) {
      return {
        icon: <Clock className="h-5 w-5 text-gray-500" />,
        title: 'در حال بررسی...',
        description: 'لطفاً صبر کنید',
        variant: 'default' as const
      }
    }

    if (timeOffset <= 5000) {
      return {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        title: 'زمان همگام است',
        description: `اختلاف زمان: ${Math.round(timeOffset / 1000)} ثانیه`,
        variant: 'default' as const
      }
    }

    if (timeOffset <= 30000) {
      return {
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        title: 'زمان تقریباً همگام است',
        description: `اختلاف زمان: ${Math.round(timeOffset / 1000)} ثانیه`,
        variant: 'destructive' as const
      }
    }

    return {
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      title: 'زمان همگام نیست',
      description: `اختلاف زمان: ${Math.round(timeOffset / 1000)} ثانیه`,
      variant: 'destructive' as const
    }
  }

  const status = getTimeSyncStatus()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status.icon}
          {status.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant={status.variant}>
          <AlertDescription>
            {status.description}
          </AlertDescription>
        </Alert>

        {timeOffset && timeOffset > 30000 && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">راه‌حل‌های پیشنهادی:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
              <li>زمان سیستم خود را بررسی کنید</li>
              <li>تنظیمات تاریخ و زمان را به‌روزرسانی کنید</li>
              <li>زمان منطقه‌ای خود را بررسی کنید</li>
              <li>در صورت استفاده از VPN، آن را خاموش کنید</li>
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            onClick={checkTimeSync}
            disabled={isChecking || !isOnline}
            variant="outline"
            size="sm"
          >
            {isChecking ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isChecking ? 'در حال بررسی...' : 'بررسی مجدد'}
          </Button>
          
          {lastCheck && (
            <span className="text-xs text-gray-500">
              آخرین بررسی: {lastCheck.toLocaleTimeString('fa-IR')}
            </span>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center">
          <div className="flex items-center justify-center gap-1">
            {isOnline ? (
              <Wifi className="h-3 w-3 text-green-500" />
            ) : (
              <WifiOff className="h-3 w-3 text-red-500" />
            )}
            <span>{isOnline ? 'آنلاین' : 'آفلاین'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}





