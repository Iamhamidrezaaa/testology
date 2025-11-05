'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface MoodSelectorProps {
  onSubmit: (mood: string, note?: string) => void
  currentMood?: string
  currentNote?: string
  className?: string
}

export default function MoodSelector({ 
  onSubmit, 
  currentMood,
  currentNote,
  className = "" 
}: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState(currentMood || '')
  const [note, setNote] = useState(currentNote || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const moods = [
    { emoji: '😊', label: 'عالی', value: '😊', color: 'bg-green-100 text-green-800 border-green-200' },
    { emoji: '😐', label: 'عادی', value: '😐', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    { emoji: '😢', label: 'غمگین', value: '😢', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { emoji: '😠', label: 'عصبانی', value: '😠', color: 'bg-red-100 text-red-800 border-red-200' },
    { emoji: '😴', label: 'خسته', value: '😴', color: 'bg-purple-100 text-purple-800 border-purple-200' }
  ]

  const handleSubmit = async () => {
    if (!selectedMood) return

    setIsSubmitting(true)
    try {
      await onSubmit(selectedMood, note.trim() || undefined)
    } catch (error) {
      console.error('Error submitting mood:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={`bg-gradient-to-br from-pink-50 to-rose-100 border-pink-200 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">📅</span>
          <span>ثبت احساس امروز</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* انتخاب احساس */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            امروز چه حسی داری؟
          </h4>
          <div className="grid grid-cols-5 gap-2">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`
                  p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105
                  ${selectedMood === mood.value 
                    ? `${mood.color} border-2` 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className="text-xs font-medium">{mood.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* یادداشت اختیاری */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            یادداشت (اختیاری)
          </label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="درباره احساس امروز خود بنویسید..."
            className="min-h-[80px] resize-none"
            maxLength={200}
          />
          <div className="text-xs text-gray-500 mt-1 text-left">
            {note.length}/200 کاراکتر
          </div>
        </div>

        {/* دکمه ثبت */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedMood && (
              <span>
                احساس انتخاب شده: <span className="font-medium">{moods.find(m => m.value === selectedMood)?.label}</span>
              </span>
            )}
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={!selectedMood || isSubmitting}
            className="bg-pink-500 hover:bg-pink-600 text-white"
          >
            {isSubmitting ? 'در حال ثبت...' : 'ثبت احساس'}
          </Button>
        </div>

        {/* انگیزه‌بخشی */}
        {selectedMood && (
          <div className="bg-white bg-opacity-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">💡</span>
              <span className="text-sm text-gray-700">
                ثبت احساس روزانه به شما کمک می‌کند تا الگوهای روحی خود را بهتر درک کنید
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
















