'use client'

import { useState } from 'react'
import styles from './LoginModal.module.css'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import OtpVerifyForm from './OtpVerifyForm'
import { useLoginModal } from '@/contexts/LoginModalContext'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface OtpResponse {
  ok: boolean
  error?: string
  message?: string
  code?: string
}

type Step = 'input' | 'verify'
type Mode = 'email' | 'sms'

export default function LoginModal() {
  const { isOpen, closeLoginModal } = useLoginModal()
  const [identifier, setIdentifier] = useState('')
  const [mode, setMode] = useState<'email' | 'sms'>('email')
  const [otpCode, setOtpCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'input' | 'verify'>('input')
  const [enteredCode, setEnteredCode] = useState('')
  const { data: session } = useSession()
  const router = useRouter()

  const handleRequestOtp = async () => {
    try {
      setError(null)
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, mode }),
      })

      const data = await res.json()

      if (!data.success) {
        console.error('📛 خطای دریافت شده:', data.message || data.error)
        setError(data.message || 'خطا در ارسال کد')
        return
      }

      if (data.code) {
        setOtpCode(data.code)
        setStep('verify')
      }
    } catch (err) {
      console.error('خطا در ارسال درخواست:', err)
      setError('خطا در ارسال درخواست')
    }
  }

  const handleVerifyOtp = async () => {
    try {
      setError(null)
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          identifier,
          mode,
          code: enteredCode
        }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.message || 'کد نامعتبر است')
        return
      }

      // لاگین با next-auth
      const result = await signIn('credentials', {
        email: identifier,
        password: data.token,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        return
      }

      closeLoginModal()
      
      // هدایت به صفحه مناسب
      if (data.redirectTo) {
        router.push(data.redirectTo)
      }
    } catch (err) {
      console.error('خطا در تأیید کد:', err)
      setError('خطا در تأیید کد')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {step === 'input' ? 'ورود / عضویت' : 'تأیید کد'}
          </h2>
          <button
            onClick={closeLoginModal}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {step === 'input' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {mode === 'email' ? 'ایمیل' : 'شماره موبایل'}
                </label>
                <input
                  type={mode === 'email' ? 'email' : 'tel'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={mode === 'email' ? 'example@email.com' : '09123456789'}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setMode('email')}
                  className={`flex-1 py-2 px-4 rounded-md ${
                    mode === 'email'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  ایمیل
                </button>
                <button
                  onClick={() => setMode('sms')}
                  className={`flex-1 py-2 px-4 rounded-md ${
                    mode === 'sms'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  پیامک
                </button>
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <button
                onClick={handleRequestOtp}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                دریافت کد
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-600">
                کد تأیید به {mode === 'email' ? 'ایمیل' : 'شماره موبایل'} {identifier} ارسال شد
              </p>

              {otpCode && (
                <div className="mt-4 p-4 bg-green-50 rounded-md">
                  <p className="text-green-700">
                    کد تست شما: <strong>{otpCode}</strong>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  کد تأیید
                </label>
                <input
                  type="text"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="کد 6 رقمی"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep('input')}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  بازگشت
                </button>
                <button
                  onClick={handleVerifyOtp}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                  تأیید
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 