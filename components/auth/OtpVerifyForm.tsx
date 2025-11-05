'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface OtpVerifyFormProps {
  identifier: string
  mode: 'email' | 'sms'
  otpCode?: string
}

export default function OtpVerifyForm({ identifier, mode, otpCode }: OtpVerifyFormProps) {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { update } = useSession()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (otp.length !== 6) {
      setError('کد باید ۶ رقمی باشد')
      return
    }

    setIsLoading(true)

    try {
      // مرحله اول: تایید کد OTP و دریافت توکن
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, mode, code: otp }),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.message || 'کد نادرست یا منقضی شده')
        setIsLoading(false)
        return
      }

      // مرحله دوم: لاگین با توکن دریافتی و ریدایرکت خودکار
      await signIn('credentials', {
        redirect: true,
        email: identifier,
        password: data.token,
        callbackUrl: identifier === 'h.asgarizade@gmail.com' ? '/admin-panel' : '/dashboard'
      })
    } catch (err) {
      setError('خطا در تأیید کد. لطفاً دوباره تلاش کنید')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-4">
          کد ارسال‌شده به {mode === 'email' ? 'ایمیل' : 'شماره موبایل'} <strong>{identifier}</strong> را وارد کنید
        </p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="کد ۶ رقمی"
          className="w-full px-4 py-2.5 border rounded-lg text-center tracking-widest text-lg font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          maxLength={6}
          pattern="[0-9]*"
          inputMode="numeric"
          required
        />
        {otpCode && (
          <div className="mt-2 text-green-600 text-center">
            کد تست شما: <b>{otpCode}</b>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || otp.length !== 6}
        className={`w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm transition-colors
          ${isLoading || otp.length !== 6 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
      >
        {isLoading ? 'در حال بررسی...' : 'تأیید و ورود'}
      </button>
    </form>
  )
} 