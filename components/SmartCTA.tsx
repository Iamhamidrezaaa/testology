'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface SmartCTAProps {
  initialMessage?: string
  timeThreshold?: number // زمان به میلی‌ثانیه
  scrollThreshold?: number // درصد اسکرول صفحه
}

export default function SmartCTA({
  initialMessage = 'آماده‌اید شخصیت خود را بشناسید؟',
  timeThreshold = 10000,
  scrollThreshold = 50
}: SmartCTAProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [message, setMessage] = useState(initialMessage)

  useEffect(() => {
    // نمایش بعد از گذشت زمان مشخص
    const timeoutId = setTimeout(() => {
      setIsVisible(true)
    }, timeThreshold)

    // بررسی میزان اسکرول
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      
      if (scrollPercent > scrollThreshold) {
        setMessage('می‌خواهید نتیجه دقیق‌تری دریافت کنید؟')
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [timeThreshold, scrollThreshold])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-soft p-4 z-50"
        >
          <p className="text-gray-800 mb-3">{message}</p>
          <div className="flex gap-2">
            <Link
              href="/tests/screening"
              className="flex-1 bg-primary text-white text-center py-2 rounded-lg hover:bg-blue-600 transition"
            >
              شروع تست
            </Link>
            <button
              onClick={() => setIsVisible(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
            >
              بعداً
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 