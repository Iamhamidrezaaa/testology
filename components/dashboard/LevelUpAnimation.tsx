'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { getLevelIcon, getLevelTitle, getLevelColor } from '@/lib/services/level'

interface LevelUpAnimationProps {
  newLevel: number
  onComplete?: () => void
}

export default function LevelUpAnimation({ newLevel, onComplete }: LevelUpAnimationProps) {
  const [show, setShow] = useState(true)
  const [phase, setPhase] = useState<'entering' | 'celebrating' | 'exiting'>('entering')
  
  const levelIcon = getLevelIcon(newLevel)
  const levelTitle = getLevelTitle(newLevel)
  const levelColor = getLevelColor(newLevel)

  useEffect(() => {
    // فاز ورود
    const enterTimer = setTimeout(() => {
      setPhase('celebrating')
    }, 500)

    // فاز جشن
    const celebrateTimer = setTimeout(() => {
      setPhase('exiting')
    }, 3000)

    // فاز خروج
    const exitTimer = setTimeout(() => {
      setShow(false)
      onComplete?.()
    }, 4000)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(celebrateTimer)
      clearTimeout(exitTimer)
    }
  }, [onComplete])

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className={`
        transform transition-all duration-500 ${
          phase === 'entering' ? 'scale-0 opacity-0' : 
          phase === 'celebrating' ? 'scale-110 opacity-100' : 
          'scale-0 opacity-0'
        } bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 border-4 border-yellow-300 shadow-2xl
      `}>
        <CardContent className="p-8 text-center">
          {/* انیمیشن ستاره‌ها */}
          <div className="relative mb-6">
            <div className="text-6xl mb-4 animate-bounce">
              {levelIcon}
            </div>
            
            {/* ستاره‌های چرخان */}
            <div className="absolute -top-2 -right-2 text-2xl animate-spin">✨</div>
            <div className="absolute -top-2 -left-2 text-2xl animate-spin" style={{ animationDelay: '0.5s' }}>⭐</div>
            <div className="absolute -bottom-2 -right-2 text-2xl animate-spin" style={{ animationDelay: '1s' }}>🌟</div>
            <div className="absolute -bottom-2 -left-2 text-2xl animate-spin" style={{ animationDelay: '1.5s' }}>💫</div>
          </div>

          {/* متن تبریک */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-yellow-800 animate-pulse">
              🎉 تبریک! 🎉
            </h2>
            
            <div className="text-2xl font-bold text-gray-800">
              به سطح {newLevel} رسیدید!
            </div>
            
            <div className={`text-xl font-semibold ${levelColor}`}>
              {levelTitle}
            </div>
            
            <div className="bg-white bg-opacity-50 rounded-lg p-4 mt-4">
              <div className="text-sm text-gray-700">
                🎁 پاداش: +50 XP اضافی
              </div>
              <div className="text-sm text-gray-700">
                🏆 دستاورد جدید: "ارتقاء سطح"
              </div>
            </div>
          </div>

          {/* انیمیشن کنفتی */}
          {phase === 'celebrating' && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-red-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
              <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
















