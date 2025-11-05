export interface PracticeWithMeta {
  id: string
  title: string
  description: string
  status: 'PENDING' | 'COMPLETED' | 'MISSED'
  dueDate: Date
  startedAt: Date | null
  category: string
  estimatedTime: number
  progress: number
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  tags: string[]
  createdAt: Date
  updatedAt: Date
} 