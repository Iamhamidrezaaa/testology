'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface OnboardingTipsProps {
  onClose?: () => void
}

const tips = [
  {
    id: 1,
    title: 'شروع تست‌ها',
    description: 'از تست غربالگری برای آغاز سفر روان‌شناسی خود استفاده کن.',
    icon: '🎯',
    position: 'bottom-right',
  },
  {
    id: 2,
    title: 'مشاوره هوشمند',
    description: 'با چت‌بات روان‌شناس گفتگو کن تا تست‌های تکمیلی رو پیشنهاد بده.',
    icon: '🤖',
    position: 'bottom-right',
  },
  {
    id: 3,
    title: 'داشبورد هوشمند',
    description: 'در داشبوردت نتایج تست، تمرین‌ها و مسیر رشدت رو دنبال کن.',
    icon: '📊',
    position: 'bottom-right',
  },
  {
    id: 4,
    title: 'پروفایل شخصی',
    description: 'اطلاعاتت رو تکمیل کن تا تجربه‌ای شخصی‌تر داشته باشی.',
    icon: '👤',
    position: 'bottom-right',
  },
]

export default function OnboardingTips({ onClose }: OnboardingTipsProps) {
  const [step, setStep] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('onboarding_done')
    if (stored === 'true') {
      setDismissed(true)
    }
  }, [])

  const handleNext = () => {
    if (step < tips.length - 1) {
      setStep(step + 1)
    } else {
      setDismissed(true)
      localStorage.setItem('onboarding_done', 'true')
      onClose?.()
    }
  }

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleSkip = () => {
    setDismissed(true)
    localStorage.setItem('onboarding_done', 'true')
    onClose?.()
  }

  if (dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 right-6 max-w-sm w-[90%] z-50"
      >
        <Card className="shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{tips[step].icon}</span>
                <h3 className="text-lg font-semibold">{tips[step].title}</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkip}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              {tips[step].description}
            </p>

            <Progress 
              value={(step + 1) * (100 / tips.length)} 
              className="mb-6"
            />

            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={step === 0}
                className="flex items-center gap-2"
              >
                <ChevronRight className="h-4 w-4" />
                قبلی
              </Button>

              <Button
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                {step < tips.length - 1 ? (
                  <>
                    بعدی
                    <ChevronLeft className="h-4 w-4" />
                  </>
                ) : (
                  'تمام شد'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
} 