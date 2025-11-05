'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react'

interface AnimatedTestProps {
  testId: string
  title: string
  description?: string
  questions: any[] // Changed from Question[] to any[]
  onComplete: (answers: Record<string, string>) => void
}

export default function AnimatedTest({ testId, title, description, questions, onComplete }: AnimatedTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showValidationMessage, setShowValidationMessage] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }))
    setShowValidationMessage(false)
  }

  // تابع برای رفتن به سوال بعدی
  const goToNext = () => {
    if (!answers[currentQuestion.id]) {
      setShowValidationMessage(true)
      return
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      onComplete(answers)
    }
  }

  // تابع برای رفتن به سوال قبلی
  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  // تابع برای ثبت نهایی تست
  const submitTest = () => {
    if (!answers[currentQuestion.id]) {
      setShowValidationMessage(true)
      return
    }
    
    onComplete(answers)
  }

  return (
    <div className="relative">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        {description && (
          <p className="text-gray-600 mb-6">{description}</p>
        )}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          سوال {currentQuestionIndex + 1} از {questions.length}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-6 text-center">{currentQuestion.text}</h2>
          <div className="space-y-4 mb-6">
            {currentQuestion.options.map((option: any, index: number) => {
              const label = typeof option === 'string' ? option : option.label
              const value = typeof option === 'string' ? option : option.value
              const isSelected = answers[currentQuestion.id] === value
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(value)}
                  className={`w-full p-4 text-right rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* پیام اعتبارسنجی */}
          {showValidationMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">
                لطفاً قبل از ادامه، به این سوال پاسخ دهید. پاسخ‌دهی به همه سوالات ضروری است.
              </span>
            </motion.div>
          )}

          {/* دکمه‌های ناوبری */}
          <div className="flex justify-between items-center">
            {/* دکمه قبلی */}
            <button
              onClick={goToPrevious}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentQuestionIndex === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              مرحله قبل
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* دکمه‌های بعدی/ثبت */}
            <div className="flex gap-2">
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={goToNext}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  مرحله بعد
                </button>
              ) : (
                <button
                  onClick={submitTest}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                >
                  <Check className="w-4 h-4" />
                  ثبت نهایی
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
} 