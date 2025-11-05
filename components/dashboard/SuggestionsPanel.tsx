import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from '@/components/ui/use-toast'
import { format } from 'date-fns-jalali'
import { ClipboardList, Brain, Stethoscope, CheckCircle2 } from 'lucide-react'
import localFont from 'next/font/local'
import { getSmartSuggestions, updateSuggestionStatus } from '@/lib/api'
import type { Suggestion } from '@/types/dashboard'

const vazir = localFont({
  src: '../../public/fonts/Vazir.woff2',
  display: 'swap'
})

export default function SuggestionsPanel() {
  const { data: session } = useSession()
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (session) fetchSuggestions()
  }, [session])

  const fetchSuggestions = async () => {
    try {
      setLoading(true)
      const data = await getSmartSuggestions()
      setSuggestions(data)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      toast({
        title: 'خطا در دریافت پیشنهادات',
        description: 'لطفاً صفحه را رفرش کنید یا بعداً تلاش کنید.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (id: string) => {
    try {
      setUpdating(id)
      await updateSuggestionStatus(id, 'completed')
      setSuggestions(prev => prev.map(suggestion => 
        suggestion.id === id ? { ...suggestion, completed: true } : suggestion
      ))
      toast({
        title: 'پیشنهاد تکمیل شد',
        description: 'وضعیت با موفقیت به‌روز شد.',
      })
    } catch (error) {
      console.error('Failed to update suggestion:', error)
      toast({
        title: 'خطا در به‌روزرسانی',
        description: 'لطفاً دوباره تلاش کنید.',
        variant: 'destructive',
      })
    } finally {
      setUpdating(null)
    }
  }

  const renderIcon = (type: Suggestion['type']) => {
    const iconProps = { className: "w-5 h-5" }
    
    switch (type) {
      case 'test':
        return <ClipboardList {...iconProps} className="text-blue-500" />
      case 'exercise':
        return <Brain {...iconProps} className="text-purple-500" />
      case 'referral':
        return <Stethoscope {...iconProps} className="text-red-500" />
      default:
        return null
    }
  }

  const renderBadge = (type: Suggestion['type']) => {
    const badges = {
      test: { label: 'تست', variant: 'secondary' as const },
      exercise: { label: 'تمرین', variant: 'default' as const },
      referral: { label: 'ارجاع', variant: 'destructive' as const },
    }
    
    const { label, variant } = badges[type]
    return <Badge variant={variant}>{label}</Badge>
  }

  if (loading) {
    return (
      <div className={`${vazir.className} space-y-4`}>
        <h2 className="text-xl font-bold">پیشنهادات شخصی‌سازی‌شده شما</h2>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-md">
            <CardContent className="p-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-2 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className={`${vazir.className} space-y-4`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">پیشنهادات شخصی‌سازی‌شده شما</h2>
        <Button variant="ghost" size="sm" onClick={fetchSuggestions}>
          به‌روزرسانی
        </Button>
      </div>

      {suggestions.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center text-gray-500">
            در حال حاضر پیشنهادی برای شما وجود ندارد.
          </CardContent>
        </Card>
      ) : (
        suggestions.map((suggestion) => (
          <Card key={suggestion.id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {renderIcon(suggestion.type)}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-base font-semibold text-gray-800">
                      {suggestion.title}
                    </div>
                    {renderBadge(suggestion.type)}
                  </div>
                  
                  <div className="text-sm text-gray-700">
                    {suggestion.description}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>مهلت: {format(new Date(suggestion.deadline), 'yyyy/MM/dd')}</span>
                    {suggestion.completed && (
                      <div className="flex items-center gap-1 text-green-500">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تکمیل شده</span>
                      </div>
                    )}
                  </div>
                  
                  <Progress 
                    value={suggestion.completed ? 100 : 30} 
                    className={`h-2 bg-gray-100 ${
                      suggestion.completed 
                        ? '[&>div]:bg-green-500' 
                        : '[&>div]:bg-yellow-400'
                    }`}
                  />
                  
                  {!suggestion.completed && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleComplete(suggestion.id)}
                        disabled={updating === suggestion.id}
                      >
                        تکمیل شد
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `/tests/${suggestion.id}`}
                      >
                        مشاهده جزئیات
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
} 