"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Download, 
  Copy, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'

interface BackupCodesProps {
  codes: string[]
  onRegenerate?: () => void
  onDownload?: () => void
}

export default function BackupCodes({ codes, onRegenerate, onDownload }: BackupCodesProps) {
  const [showCodes, setShowCodes] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const content = `کدهای پشتیبان احراز هویت دو مرحله‌ای\n\n${codes.map((code, index) => `${index + 1}. ${code}`).join('\n')}\n\nتاریخ تولید: ${new Date().toLocaleDateString('fa-IR')}\n\n⚠️ این کدها را در جای امن نگه دارید و با کسی به اشتراک نگذارید.`
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'backup-codes.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          کدهای پشتیبان احراز هویت دو مرحله‌ای
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            این کدها را در جای امن نگه دارید. هر کد فقط یک بار قابل استفاده است و پس از استفاده، 
            کد جدیدی باید تولید شود.
          </AlertDescription>
        </Alert>

        <div className="flex justify-between items-center">
          <h3 className="font-semibold">کدهای پشتیبان شما:</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCodes(!showCodes)}
          >
            {showCodes ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showCodes ? 'مخفی کردن' : 'نمایش کدها'}
          </Button>
        </div>

        {showCodes && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {codes.map((code, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono bg-white px-2 py-1 rounded border">
                    {code}
                  </span>
                  <span className="text-xs text-gray-500">
                    #{index + 1}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(code, index)}
                  className="h-8 w-8 p-0"
                >
                  {copiedIndex === index ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-yellow-800">نکات امنیتی مهم:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
            <li>کدها را در جای امن و خصوصی نگه دارید</li>
            <li>هرگز کدها را با دیگران به اشتراک نگذارید</li>
            <li>کدها را در فایل‌های رمزگذاری شده ذخیره کنید</li>
            <li>در صورت گم کردن کدها، فوراً کدهای جدید تولید کنید</li>
            <li>هر کد فقط یک بار قابل استفاده است</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleDownload}
            className="flex-1"
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            دانلود کدها
          </Button>
          
          {onRegenerate && (
            <Button
              onClick={onRegenerate}
              className="flex-1"
              variant="destructive"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              تولید کدهای جدید
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center">
          ⚠️ تولید کدهای جدید، کدهای قبلی را غیرفعال می‌کند
        </div>
      </CardContent>
    </Card>
  )
}





