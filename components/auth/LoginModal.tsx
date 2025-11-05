'use client'

import { useState } from 'react'
import OtpVerifyForm from './OtpVerifyForm'
import axios from 'axios'

interface RequestOtpResponse {
  ok: boolean
  error?: string
}

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [identifier, setIdentifier] = useState('')
  const [mode, setMode] = useState<'email' | 'sms'>('email')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateInput = () => {
    if (mode === 'email') {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(identifier)
    } else {
      const re = /^09\d{9}$/
      return re.test(identifier)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateInput()) {
      setError(mode === 'email' 
        ? 'لطفاً یک ایمیل معتبر وارد کنید' 
        : 'لطفاً یک شماره موبایل معتبر وارد کنید (مثال: 09123456789)'
      )
      return
    }

    setIsLoading(true)

    try {
      await axios.post<RequestOtpResponse>('/api/auth/request-otp', { identifier, mode })
      setStep(2)
    } catch (err: any) {
      setError(err?.response?.data?.error || 'خطا در ارسال کد. لطفاً دوباره تلاش کنید')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center font-vazir">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
        
        <div className="flex justify-between mb-6">
          <button
            onClick={() => {
              setMode('email')
              setIdentifier('')
              setError('')
              setStep(1)
            }}
            className={`w-1/2 py-2.5 rounded-t-lg transition-colors ${
              mode === 'email' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ورود با ایمیل
          </button>
          <button
            onClick={() => {
              setMode('sms')
              setIdentifier('')
              setError('')
              setStep(1)
            }}
            className={`w-1/2 py-2.5 rounded-t-lg transition-colors ${
              mode === 'sms' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ورود با پیامک
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-600">
                {mode === 'email' ? 'ایمیل خود را وارد کنید' : 'شماره موبایل خود را وارد کنید'}
              </label>
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                type={mode === 'email' ? 'email' : 'tel'}
                placeholder={mode === 'email' ? 'example@mail.com' : '09123456789'}
                className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading || !identifier}
              className={`w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm transition-colors
                ${isLoading || !identifier ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {isLoading ? 'در حال ارسال...' : 'دریافت کد یک‌بار مصرف'}
            </button>
          </form>
        ) : (
          <OtpVerifyForm 
            identifier={identifier} 
            mode={mode}
          />
        )}
      </div>
    </div>
  )
} 