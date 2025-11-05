'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'

export default function SessionTimer() {
  const { data: session, update } = useSession()
  const [secondsLeft, setSecondsLeft] = useState(3600) // یک ساعت

  useEffect(() => {
    if (!session) return

    // تنظیم زمان باقی‌مانده بر اساس زمان انقضای سشن
    const sessionExpiry = new Date(session.expires).getTime()
    const now = Date.now()
    const remainingSeconds = Math.floor((sessionExpiry - now) / 1000)
    setSecondsLeft(Math.max(0, remainingSeconds))

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval)
          signOut({ redirect: true, callbackUrl: '/login' })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [session])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  if (!session) return null

  return (
    <div className="text-center text-sm text-gray-600 bg-gray-50 py-2">
      ⏱ زمان باقی‌مانده از جلسه: {formatTime(secondsLeft)}
    </div>
  )
} 