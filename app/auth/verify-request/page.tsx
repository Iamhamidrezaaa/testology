'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, CheckCircle } from 'lucide-react'

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            ایمیل تأیید ارسال شد
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            لطفاً صندوق ورودی ایمیل خود را بررسی کنید
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center">
              <Mail className="mr-2 h-5 w-5" />
              بررسی ایمیل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              لینک تأیید به ایمیل شما ارسال شده است. روی لینک کلیک کنید تا وارد شوید.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">نکات مهم:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• ایمیل ممکن است در پوشه spam باشد</li>
                <li>• لینک تا ۱۰ دقیقه معتبر است</li>
                <li>• اگر ایمیل را دریافت نکردید، دوباره تلاش کنید</li>
              </ul>
            </div>

            <Button 
              className="w-full" 
              onClick={() => window.location.href = '/auth/signin'}
            >
              بازگشت به صفحه ورود
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}








