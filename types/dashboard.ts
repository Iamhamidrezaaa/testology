export interface MoodEntry {
  date: string
  moodScore: number
}

export type SuggestionType = 'test' | 'exercise' | 'referral'

export interface Suggestion {
  id: string
  type: SuggestionType
  title: string
  description: string
  completed: boolean
  createdAt: string
  deadline: string
}

export interface DashboardData {
  moodData: MoodEntry[]
  suggestions: Suggestion[]
  pendingCount: number
}

export type ReminderType = 'test' | 'exercise' | 'appointment'

export interface Reminder {
  id: string
  title: string
  description: string
  type: ReminderType
  progress: number
  dueDate: string
  status: 'pending' | 'in_progress' | 'completed' | 'snoozed'
} 