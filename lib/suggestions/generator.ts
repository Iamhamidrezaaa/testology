import { v4 as uuidv4 } from 'uuid'
import type { Suggestion } from '@/types/dashboard'
import { addDays } from 'date-fns-jalali'

interface TestResult {
  id: string
  testName: string
  score: number
  answers: Record<string, number>
  createdAt: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface GenerateSuggestionsParams {
  screening?: TestResult
  chat?: ChatMessage[]
}

const defaultSuggestions: Suggestion[] = [
  {
    id: uuidv4(),
    type: 'test',
    title: 'تست غربالگری اضطراب',
    description: 'این تست به شما کمک می‌کند تا میزان اضطراب خود را ارزیابی کنید.',
    completed: false,
    createdAt: new Date().toISOString(),
    deadline: addDays(new Date(), 7).toISOString()
  },
  {
    id: uuidv4(),
    type: 'test',
    title: 'تست افسردگی PHQ-9',
    description: 'این تست به شما کمک می‌کند تا میزان افسردگی خود را ارزیابی کنید.',
    completed: false,
    createdAt: new Date().toISOString(),
    deadline: addDays(new Date(), 7).toISOString()
  },
  {
    id: uuidv4(),
    type: 'test',
    title: 'تست خوددلسوزی',
    description: 'این تست به شما کمک می‌کند تا میزان خوددلسوزی خود را ارزیابی کنید.',
    completed: false,
    createdAt: new Date().toISOString(),
    deadline: addDays(new Date(), 7).toISOString()
  },
  {
    id: uuidv4(),
    type: 'referral',
    title: 'مشاوره با متخصص',
    description: 'بر اساس نتایج تست‌های شما، پیشنهاد می‌شود با یک متخصص مشورت کنید.',
    completed: false,
    createdAt: new Date().toISOString(),
    deadline: addDays(new Date(), 14).toISOString()
  },
  {
    id: uuidv4(),
    type: 'exercise',
    title: 'تمرینات تنفسی',
    description: 'این تمرینات به شما کمک می‌کند تا اضطراب خود را مدیریت کنید.',
    completed: false,
    createdAt: new Date().toISOString(),
    deadline: addDays(new Date(), 3).toISOString()
  }
]

export async function generateSuggestions(params?: GenerateSuggestionsParams): Promise<Suggestion[]> {
  // اگر پارامتر ورودی نداشته باشیم، پیشنهادات پیش‌فرض را برمی‌گردانیم
  if (!params?.screening) {
    return defaultSuggestions
  }

  const { screening, chat } = params
  const suggestions: Suggestion[] = []

  // تست اضطراب
  if (screening.testName === 'GAD-7' && screening.score >= 10) {
    suggestions.push({
      id: uuidv4(),
      type: 'test',
      title: 'تست غربالگری اضطراب',
      description: 'این تست به شما کمک می‌کند تا میزان اضطراب خود را ارزیابی کنید.',
      completed: false,
      createdAt: new Date().toISOString(),
      deadline: addDays(new Date(), 7).toISOString()
    })
  }

  // تست افسردگی
  if (screening.testName === 'PHQ-9' && screening.score >= 10) {
    suggestions.push({
      id: uuidv4(),
      type: 'test',
      title: 'تست افسردگی PHQ-9',
      description: 'این تست به شما کمک می‌کند تا میزان افسردگی خود را ارزیابی کنید.',
      completed: false,
      createdAt: new Date().toISOString(),
      deadline: addDays(new Date(), 7).toISOString()
    })
  }

  // تست خوددلسوزی
  if (screening.testName === 'SCS' && screening.score < 3) {
    suggestions.push({
      id: uuidv4(),
      type: 'test',
      title: 'تست خوددلسوزی',
      description: 'این تست به شما کمک می‌کند تا میزان خوددلسوزی خود را ارزیابی کنید.',
      completed: false,
      createdAt: new Date().toISOString(),
      deadline: addDays(new Date(), 7).toISOString()
    })
  }

  // ارجاع به متخصص
  if (screening.score >= 15) {
    suggestions.push({
      id: uuidv4(),
      type: 'referral',
      title: 'مشاوره با متخصص',
      description: 'بر اساس نتایج تست‌های شما، پیشنهاد می‌شود با یک متخصص مشورت کنید.',
      completed: false,
      createdAt: new Date().toISOString(),
      deadline: addDays(new Date(), 14).toISOString()
    })
  }

  // تمرینات
  suggestions.push({
    id: uuidv4(),
    type: 'exercise',
    title: 'تمرینات تنفسی',
    description: 'این تمرینات به شما کمک می‌کند تا اضطراب خود را مدیریت کنید.',
    completed: false,
    createdAt: new Date().toISOString(),
    deadline: addDays(new Date(), 3).toISOString()
  })

  return suggestions
} 