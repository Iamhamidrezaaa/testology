'use client'

import { useState } from 'react'
import styles from './OtpVerifyForm.module.css'
import { toast } from 'react-hot-toast'
import axios from 'axios'

interface OtpVerifyFormProps {
  identifier: string
  mode: 'email' | 'sms'
  onSuccess: () => void
  onBack: () => void
}

interface OtpVerifyResponse {
  ok: boolean
  error?: string
  message?: string
}

export default function OtpVerifyForm({ identifier, mode, onSuccess, onBack }: OtpVerifyFormProps) {
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const handleSubmit = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('لطفاً کد ۶ رقمی را وارد کنید')
      return
    }

    setIsVerifying(true)
    try {
      const { data } = await axios.post<OtpVerifyResponse>('/api/auth/verify-otp', {
        identifier,
        code: otp,
        mode
      })

      if (data.ok) {
        toast.success('ورود با موفقیت انجام شد')
        onSuccess()
      } else {
        throw new Error(data.error || 'خطا در تأیید کد')
      }
    } catch (error: any) {
      console.error('خطا در تأیید کد:', error)
      if (error.response) {
        toast.error(error.response.data.error || 'خطا در تأیید کد. لطفاً دوباره تلاش کنید')
      } else if (error.request) {
        toast.error('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید')
      } else {
        toast.error('خطای ناشناخته. لطفاً دوباره تلاش کنید')
      }
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="کد ۶ رقمی را وارد کنید"
          className={styles.input}
          disabled={isVerifying}
        />
      </div>
      <div className={styles.buttonGroup}>
        <button 
          onClick={onBack}
          className={styles.backButton}
          disabled={isVerifying}
        >
          بازگشت
        </button>
        <button 
          onClick={handleSubmit}
          className={styles.submitButton}
          disabled={isVerifying || !otp || otp.length !== 6}
        >
          {isVerifying ? 'در حال بررسی...' : 'تأیید کد'}
        </button>
      </div>
    </div>
  )
} 