import { useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const sendOTP = async (phone: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'خطا در ارسال کد تأیید')
      }

      localStorage.setItem('otp_phone', phone)
      localStorage.setItem('otp_code', '12345')

      return response.json()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'خطای ناشناخته')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async (phone: string, code: string) => {
    try {
      setLoading(true)
      setError(null)
      const storedPhone = localStorage.getItem('otp_phone')
      const storedCode = localStorage.getItem('otp_code')

      if (phone !== storedPhone || code !== storedCode) {
        throw new Error('کد تأیید نامعتبر است')
      }

      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, code }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'خطا در تأیید کد')
      }

      const data = await response.json()
      
      localStorage.removeItem('otp_phone')
      localStorage.removeItem('otp_code')
      
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      Cookies.set('token', data.token, { expires: 7 })
      
      // بررسی اعتبار توکن قبل از ریدایرکت
      const verifyResponse = await fetch('/api/auth/verify-token')
      if (!verifyResponse.ok) {
        throw new Error('خطا در تأیید توکن')
      }
      
      await router.push('/dashboard')
      
      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'خطای ناشناخته')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    Cookies.remove('token')
    router.push('/login')
  }

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return Cookies.get('token') || localStorage.getItem('token')
    }
    return null
  }

  const getUser = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    }
    return null
  }

  return {
    loading,
    error,
    sendOTP,
    verifyOTP,
    logout,
    getToken,
    getUser,
  }
} 