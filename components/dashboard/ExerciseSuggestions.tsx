'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CheckCircle2, Clock, Timer } from 'lucide-react'

interface ExerciseSuggestion {
  id: string
  title: string
  description: string
  category: string
  estimatedTime: number
  steps: string[]
  icon: string
}

interface ExerciseSuggestionsProps {
  screeningResults: any
  chatbotSummary: string
  userAge: number
  userGender: string
}

export default function ExerciseSuggestions({ 
  screeningResults, 
  chatbotSummary,
  userAge,
  userGender 
}: ExerciseSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<ExerciseSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const res = await fetch('/api/suggestions/exercise', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            screeningResults,
            chatbotSummary,
            userAge,
            userGender
          })
        })

        if (!res.ok) throw new Error('Failed to fetch suggestions')

        const data = await res.json()
        setSuggestions(data.suggestions)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        toast.error('خطا در دریافت پیشنهادات')
      } finally {
        setLoading(false)
      }
    }

    if (screeningResults && chatbotSummary) {
      fetchSuggestions()
    }
  }, [screeningResults, chatbotSummary, userAge, userGender])

  const handleAccept = async (suggestion: ExerciseSuggestion) => {
    try {
      const res = await fetch('/api/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'EXERCISE',
          relatedSlug: suggestion.id,
          title: suggestion.title,
          description: suggestion.description
        })
      })

      if (!res.ok) throw new Error('Failed to create follow-up')

      toast.success('تمرین با موفقیت به لیست پیگیری‌ها اضافه شد')
      router.refresh()
    } catch (error) {
      console.error('Error accepting suggestion:', error)
      toast.error('خطا در ثبت تمرین')
    }
  }

  if (loading) {
    return <div className="text-center py-4">در حال تحلیل شرایط شما...</div>
  }

  if (suggestions.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">هیچ تمرینی یافت نشد</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">تمرین‌های پیشنهادی</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{suggestion.icon}</span>
                <CardTitle className="text-lg">{suggestion.title}</CardTitle>
              </div>
              <CardDescription>{suggestion.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Timer className="w-4 h-4" />
                  <span>زمان تخمینی: {suggestion.estimatedTime} دقیقه</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{suggestion.category}</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">مراحل انجام:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    {suggestion.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleAccept(suggestion)}
                className="w-full"
              >
                شروع تمرین
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
} 