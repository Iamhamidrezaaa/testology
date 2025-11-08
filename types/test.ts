export type TestType = 
  | 'mbti'
  | 'gad7'
  | 'phq9'
  | 'rosenberg'
  | 'swls'
  | 'asrs'
  | 'cd-risc'
  | 'ders'
  | 'bdi'
  | 'bai'
  | 'pss'
  | 'psqi'
  | 'maas'
  | 'ffmq'
  | 'erq'
  | 'dass'
  | 'stai'
  | 'ies-r'
  | 'pcl-5'
  | 'whoqol'
  | 'sf-36'
  | 'bprs'
  | 'y-bocs'
  | 'madrs'
  | 'ham-a'
  | 'attachment'
  | 'gse'
  | 'hads'
  | 'psss'
  | 'sas'
  | 'scs'
  | 'scsy'
  | 'spin'
  | 'ucla'
  | 'cope'

export interface Option {
  label: string;
  value: string;
}

export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TEXT'

export interface Question {
  id: string
  text: string
  type: QuestionType
  options: string[]
  order: number
  testId: string
  required: boolean
  createdAt: Date
  updatedAt: Date
}

// Helper type for static questions (without database fields)
export type StaticQuestion = Omit<Question, 'createdAt' | 'updatedAt'> & {
  createdAt?: Date
  updatedAt?: Date
}

export interface TestResult {
  id: string
  userId: string
  testId: string
  testName: string | null
  score: number
  answers: any
  analysis: any
  createdAt: Date
  updatedAt: Date
  type: string | null
  result: any
  level: string | null
  timestamp: Date
  testSlug: string | null
  moodScore: number | null
  totalScore: number | null
  interpretation?: string
  recommendations?: string[]
}

export interface TestResponse {
  questionId: string;
  selectedOption: string;
}

export interface TestSubmission {
  testId: string;
  responses: TestResponse[];
  timestamp: string;
  userId?: string;
}

export interface RecommendedTest {
  name: string
  description: string
}

export interface ScreeningResult {
  message: string
  recommendedTests: RecommendedTest[]
  analysis?: string
  completedTests?: string[]
}

export interface FinalAnalysis {
  overallAnalysis: string
  recommendations: string[]
  nextSteps: string[]
}

export type TestConfig = {
  name: string
  type: 'score' | 'type'
  description: string
  instructions: string
  minScore?: number
  maxScore?: number
  questions: {
    id: number
    text: string
    options: {
      value: number
      text: string
    }[]
  }[]
}

export interface ApiResponse {
  analysis?: string
  error?: string
}

export type TestCategory = 'PSYCHOLOGICAL' | 'HEALTH' | 'JOB_SATISFACTION' | 'PERSONALITY' | 'OTHER'
export type TestStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface Test {
  id: string
  title: string
  description: string | null
  category: TestCategory
  status: TestStatus
  timeLimit: number | null
  isPublic: boolean
  slug: string
  createdAt: Date
  updatedAt: Date
  categoryId: string | null
}

export interface TestResult {
  id: string
  userId: string
  testId: string
  score: number
  answers: any
  analysis: any | null
  category: string | null
  recommendation: string | null
  createdAt: Date
  updatedAt: Date
  duration: number | null
  completed: boolean
}

export interface TestAnalytics {
  id: string
  testId: string
  totalAttempts: number
  averageScore: number
  completionRate: number
  averageDuration: number
  categoryDistribution: any | null
  updatedAt: Date
} 