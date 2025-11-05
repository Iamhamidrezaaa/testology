"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import TwoFAGuide from './2FA-Guide'
import TwoFAErrorHandler from './2FA-Error-Handler'
import BackupCodes from './Backup-Codes'
import TimeSyncChecker from './Time-Sync-Checker'
import { 
  Shield, 
  QrCode, 
  Smartphone, 
  AlertCircle,
  CheckCircle,
  Settings
} from 'lucide-react'

interface TwoFAManagerProps {
  userEmail: string
  onSuccess?: () => void
}

export default function TwoFAManager({ userEmail, onSuccess }: TwoFAManagerProps) {
  const [status, setStatus] = useState({
    has2FA: false,
    isEnabled: false,
    qrCode: '',
    secret: ''
  })
  const [step, setStep] = useState<'status' | 'setup' | 'verify' | 'guide' | 'backup'>('status')
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [showTimeSync, setShowTimeSync] = useState(false)

  useEffect(() => {
    fetch2FAStatus()
  }, [])

  const fetch2FAStatus = async () => {
    try {
      const response = await fetch(`/api/user/2fa?email=${encodeURIComponent(userEmail)}`)
      const data = await response.json()
      
      if (data.success) {
        setStatus({
          has2FA: data.has2FA,
          isEnabled: data.isEnabled,
          qrCode: '',
          secret: ''
        })
      }
    } catch (error) {
      console.error('Error fetching 2FA status:', error)
    }
  }

  const handleEnable2FA = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/user/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          action: 'enable'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setStatus(prev => ({
          ...prev,
          qrCode: data.qrCode,
          secret: data.secret
        }))
        setStep('verify')
      } else {
        setError(data)
      }
    } catch (error) {
      setError({ message: 'خطا در فعال‌سازی 2FA' })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError({ message: 'کد باید 6 رقمی باشد' })
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/user/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          action: 'verify',
          code: verificationCode
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setStatus(prev => ({ ...prev, isEnabled: true }))
        setStep('backup')
        generateBackupCodes()
      } else {
        setError(data)
      }
    } catch (error) {
      setError({ message: 'خطا در تأیید کد' })
    } finally {
      setLoading(false)
    }
  }

  const generateBackupCodes = async () => {
    try {
      const response = await fetch('/api/user/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          action: 'generate-backup-codes'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setBackupCodes(data.backupCodes)
      }
    } catch (error) {
      console.error('Error generating backup codes:', error)
    }
  }

  const handleDisable2FA = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/user/2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          action: 'disable'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setStatus({ has2FA: false, isEnabled: false, qrCode: '', secret: '' })
        setStep('status')
        onSuccess?.()
      } else {
        setError(data)
      }
    } catch (error) {
      setError({ message: 'خطا در غیرفعال‌سازی 2FA' })
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    if (step === 'verify') {
      setVerificationCode('')
    }
  }

  if (error && step !== 'status') {
    return (
      <TwoFAErrorHandler
        error={error}
        onRetry={handleRetry}
        onDisable2FA={handleDisable2FA}
        onShowGuide={() => setStep('guide')}
      />
    )
  }

  if (step === 'guide') {
    return <TwoFAGuide onClose={() => setStep('status')} />
  }

  if (step === 'backup' && backupCodes.length > 0) {
    return (
      <BackupCodes
        codes={backupCodes}
        onRegenerate={generateBackupCodes}
        onDownload={() => {
          const content = backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')
          const blob = new Blob([content], { type: 'text/plain' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'backup-codes.txt'
          a.click()
          URL.revokeObjectURL(url)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            احراز هویت دو مرحله‌ای
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status.isEnabled ? (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  احراز هویت دو مرحله‌ای فعال است و حساب شما محافظت می‌شود.
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setStep('backup')}
                  variant="outline"
                  size="sm"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  کدهای پشتیبان
                </Button>
                
                <Button
                  onClick={handleDisable2FA}
                  variant="destructive"
                  size="sm"
                  disabled={loading}
                >
                  غیرفعال کردن
                </Button>
              </div>
            </div>
          ) : status.has2FA ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  احراز هویت دو مرحله‌ای تنظیم شده اما فعال نیست. لطفاً کد تأیید را وارد کنید.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Label htmlFor="verification-code">کد تأیید 6 رقمی</Label>
                <Input
                  id="verification-code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
              
              <Button
                onClick={handleVerifyCode}
                disabled={loading || verificationCode.length !== 6}
                className="w-full"
              >
                {loading ? 'در حال تأیید...' : 'تأیید کد'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  احراز هویت دو مرحله‌ای غیرفعال است. برای امنیت بیشتر، آن را فعال کنید.
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleEnable2FA}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'در حال فعال‌سازی...' : 'فعال کردن 2FA'}
                </Button>
                
                <Button
                  onClick={() => setStep('guide')}
                  variant="outline"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  راهنما
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {step === 'verify' && status.qrCode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              اسکن کد QR
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <img 
                src={status.qrCode} 
                alt="QR Code for 2FA setup"
                className="mx-auto border rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="verification-code">کد تأیید 6 رقمی</Label>
              <Input
                id="verification-code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
              />
            </div>
            
            <Button
              onClick={handleVerifyCode}
              disabled={loading || verificationCode.length !== 6}
              className="w-full"
            >
              {loading ? 'در حال تأیید...' : 'تأیید کد'}
            </Button>
          </CardContent>
        </Card>
      )}

      {showTimeSync && (
        <TimeSyncChecker
          onTimeSync={(isSynced) => {
            if (!isSynced) {
              setError({
                message: 'زمان سیستم شما با سرور همگام نیست. این ممکن است باعث خطا در کدهای احراز هویت شود.',
                errorCode: 'TIME_SYNC_ERROR'
              })
            }
          }}
        />
      )}

      <div className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowTimeSync(!showTimeSync)}
        >
          {showTimeSync ? 'مخفی کردن بررسی زمان' : 'بررسی همگام‌سازی زمان'}
        </Button>
      </div>
    </div>
  )
}





