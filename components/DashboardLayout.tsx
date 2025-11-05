'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import OnboardingTips from '@/components/OnboardingTips'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession()
  const [showTips, setShowTips] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUserStatus = async () => {
      if (status === 'loading') return

      // بدون ریدایرکت به صفحه signin؛ جریان ورود داخل داشبورد مدیریت می‌شود

      if (session.user.role === 'USER') {
        const hasSeenTips = localStorage.getItem('onboarding_done')
        if (!hasSeenTips) {
          setShowTips(true)
        }
      }

      setIsLoading(false)
    }

    checkUserStatus()
  }, [session, status, router])

  const handleTipsClose = () => {
    setShowTips(false)
    localStorage.setItem('onboarding_done', 'true')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="p-6">
        <AnimatePresence>
          {showTips && <OnboardingTips onClose={handleTipsClose} />}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
} 