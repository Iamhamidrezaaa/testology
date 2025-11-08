import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
// import { ScreeningQuestion } from '@/data/screening-questions' // Commented out as data folder is removed
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

interface ScreeningQuestionsProps {
  onComplete: (answers: Record<string, string>) => void
}

export function ScreeningQuestions({ onComplete }: ScreeningQuestionsProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch('/api/screening/custom')
        if (!response.ok) {
          throw new Error('خطا در دریافت سؤالات')
        }
        const data = await response.json()
        setQuestions(data.questions)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطای ناشناخته')
        toast({
          title: 'خطا',
          description: 'در دریافت سؤالات مشکلی پیش آمده است',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchQuestions()
    }
  }, [session, toast])

  const handleAnswer = (value: string) => {
    const currentQuestion = questions[currentQuestionIndex]
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      onComplete(answers)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          تلاش مجدد
        </Button>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center">
        <p>سؤالی برای نمایش وجود ندارد</p>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>سؤال {currentQuestionIndex + 1} از {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">{currentQuestion.text}</h3>
        <RadioGroup
          value={answers[currentQuestion.id] || ''}
          onValueChange={handleAnswer}
          className="space-y-4"
        >
          {currentQuestion.options.map((option: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value={option} id={`${currentQuestion.id}-${index}`} />
              <Label htmlFor={`${currentQuestion.id}-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          قبلی
        </Button>
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
        >
          {currentQuestionIndex === questions.length - 1 ? 'پایان' : 'بعدی'}
        </Button>
      </div>
    </div>
  )
} 