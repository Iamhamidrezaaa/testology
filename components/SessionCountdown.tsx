'use client'

import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'

const SessionCountdown = () => {
  const [remainingTime, setRemainingTime] = useState(3600) // 1 hour = 3600 sec

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 0) {
          clearInterval(interval)
          signOut({ callbackUrl: '/login' })
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const getColorClass = () => {
    if (remainingTime <= 300) return 'text-red-600' // کمتر از 5 دقیقه
    if (remainingTime <= 900) return 'text-orange-600' // کمتر از 15 دقیقه
    return 'text-gray-700'
  }

  return (
    <div className={`flex items-center space-x-2 ${getColorClass()} transition-colors duration-300`}>
      <span className="text-lg">⏳</span>
      <div className="text-sm font-medium">
        زمان باقی‌مانده: {formatTime(remainingTime)}
      </div>
    </div>
  )
}

export default SessionCountdown 