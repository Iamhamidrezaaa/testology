'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface TestSuggestion {
  id: string
  title: string
  description: string
  tags: string[]
  priorityScore: number
}

interface SmartSuggestionsProps {
  screeningResults: any
  chatbotSummary: string
}

export default function SmartSuggestions({ screeningResults, chatbotSummary }: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<TestSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const res = await fetch('/api/suggestions/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            screeningResults,
            chatbotSummary
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
  }, [screeningResults, chatbotSummary])

  const handleAccept = async (suggestion: TestSuggestion) => {
    try {
      const res = await fetch('/api/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'TEST',
          relatedSlug: suggestion.id,
          title: suggestion.title,
          description: suggestion.description
        })
      })

      if (!res.ok) throw new Error('Failed to create follow-up')

      toast.success('پیشنهاد با موفقیت به لیست پیگیری‌ها اضافه شد')
      router.refresh()
    } catch (error) {
      console.error('Error accepting suggestion:', error)
      toast.error('خطا در ثبت پیشنهاد')
    }
  }

  if (loading) {
    return <div className="text-center py-4">در حال تحلیل شرایط شما...</div>
  }

  if (suggestions.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">هیچ پیشنهادی یافت نشد</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">پیشنهادات هوشمند برای شما</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id}>
            <CardHeader>
              <CardTitle className="text-lg">{suggestion.title}</CardTitle>
              <CardDescription>{suggestion.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {suggestion.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleAccept(suggestion)}
                className="w-full"
              >
                قبول دارم
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
} 