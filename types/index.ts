import { GrowthPath, PathStep, UserPath, UserPathStep, StepStatus } from '../generated/prisma'

export type Option = {
  id: string
  text: string
  score: number
  questionId: string
  createdAt: string
  updatedAt: string
}

export type Question = {
  id: string
  text: string
  testId: string
  order: number
  options: Option[]
  createdAt: string
  updatedAt: string
}

export type Test = {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  priorityScore: number
  questionCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  targetAgeMin?: number | null
  targetAgeMax?: number | null
  targetGender?: string | null
  useCases: string[]
  questions?: Question[]
}

export type User = {
  id: string
  email: string
  fullName: string
  role: string
  roleId?: string
  createdAt: string
  updatedAt: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  country?: string
  testCount?: number
  lastTestDate?: string | null
  psychologicalScores?: {
    stress: number | null
    anxiety: number | null
    depression: number | null
  } | null
}

export type TestResult = {
  id: string
  userId: string
  testId: string
  testName: string
  score: number
  answers: Record<string, string>
  createdAt: string
  updatedAt: string
  analysis?: {
    personality: string
    career: string
    answers: {
      questionId: string
      optionId: string
      isCorrect: boolean
    }[]
  }
}

export type Role = {
  id: string
  name: string
  users?: User[]
  createdAt: string
  updatedAt: string
}

export type { StepStatus }

export interface UserPathWithSteps extends UserPath {
  growthPath: GrowthPath
  steps: UserPathStepWithDetail[]
}

export interface UserPathStepWithDetail extends UserPathStep {
  pathStep: PathStep
}

export interface GrowthPathWithSteps extends GrowthPath {
  steps: PathStep[]
} 