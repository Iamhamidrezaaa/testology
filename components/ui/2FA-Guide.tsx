"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, Clock, Smartphone, Shield } from 'lucide-react'

interface TwoFAGuideProps {
  onClose?: () => void
}

export default function TwoFAGuide({ onClose }: TwoFAGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "نصب اپ احراز هویت",
      icon: <Smartphone className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            برای استفاده از احراز هویت دو مرحله‌ای، ابتدا یکی از اپلیکیشن‌های زیر را نصب کنید:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">Google Authenticator</h4>
              <p className="text-xs text-gray-500">رایگان - ساده و سریع</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-semibold">Authy</h4>
              <p className="text-xs text-gray-500">پشتیبان‌گیری خودکار</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "اسکن کد QR",
      icon: <Shield className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              کد QR را با اپ احراز هویت خود اسکن کنید. این کد فقط یک بار نمایش داده می‌شود.
            </AlertDescription>
          </Alert>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">مراحل اسکن:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>اپ احراز هویت را باز کنید</li>
              <li>گزینه "Add Account" یا "+" را انتخاب کنید</li>
              <li>گزینه "Scan QR Code" را انتخاب کنید</li>
              <li>کد QR نمایش داده شده را اسکن کنید</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      title: "وارد کردن کد تأیید",
      icon: <Clock className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              کد 6 رقمی در اپ احراز هویت شما هر 30 ثانیه تغییر می‌کند.
            </AlertDescription>
          </Alert>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">نکات مهم:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>کد را دقیقاً همان‌طور که در اپ نمایش داده می‌شود وارد کنید</li>
              <li>کد فقط 30 ثانیه اعتبار دارد</li>
              <li>در صورت خطا، کد جدیدی دریافت کنید</li>
              <li>کدهای پشتیبان را در جای امن نگه دارید</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "تأیید نهایی",
      icon: <CheckCircle className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-600">احراز هویت دو مرحله‌ای فعال شد!</h3>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              از این پس برای ورود به حساب خود، علاوه بر رمز عبور، کد احراز هویت نیز نیاز دارید.
            </AlertDescription>
          </Alert>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">نکات امنیتی:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>کدهای پشتیبان را در جای امن نگه دارید</li>
              <li>در صورت گم کردن دستگاه، از کدهای پشتیبان استفاده کنید</li>
              <li>هرگز کدهای احراز هویت را با دیگران به اشتراک نگذارید</li>
            </ul>
          </div>
        </div>
      )
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else if (onClose) {
      onClose()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {steps[currentStep].icon}
          {steps[currentStep].title}
        </CardTitle>
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded ${
                index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {steps[currentStep].content}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            قبلی
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'تمام' : 'بعدی'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}





