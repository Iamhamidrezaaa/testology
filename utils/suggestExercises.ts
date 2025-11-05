import { prisma } from '@/lib/prisma'

interface TestResult {
  testSlug: string
  score: number
}

interface UserInfo {
  age: number
  gender: 'male' | 'female' | 'any'
  city?: string
}

interface Exercise {
  id: string
  title: string
  description: string
  category: string
  suitableFor: {
    ageRange?: [number, number]
    gender?: 'male' | 'female' | 'any'
    cities?: string[]
  }
  estimatedTime: number
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  tags: string[]
}

interface SuggestExercisesParams {
  testResults: TestResult[]
  user: UserInfo
}

export async function suggestExercises({
  testResults,
  user,
}: SuggestExercisesParams): Promise<Exercise[]> {
  // TODO: Implement when exercise model is added to schema
  const exercises: any[] = []

  // فیلتر کردن تمرین‌ها بر اساس شرایط مناسب بودن
  const suitableExercises = exercises.filter((exercise) => {
    const suitableFor = exercise.suitableFor as Exercise['suitableFor']

    // بررسی محدوده سنی
    if (suitableFor.ageRange) {
      const [minAge, maxAge] = suitableFor.ageRange
      if (user.age < minAge || user.age > maxAge) {
        return false
      }
    }

    // بررسی جنسیت
    if (suitableFor.gender && suitableFor.gender !== 'any') {
      if (user.gender !== suitableFor.gender) {
        return false
      }
    }

    // بررسی شهر
    if (suitableFor.cities && user.city) {
      if (!suitableFor.cities.includes(user.city)) {
        return false
      }
    }

    return true
  })

  // مرتب‌سازی تمرین‌ها بر اساس امتیاز
  const scoredExercises = suitableExercises.map((exercise) => {
    let score = 0

    // امتیاز بر اساس نتایج تست‌ها
    testResults.forEach((result) => {
      if (exercise.tags.includes(result.testSlug)) {
        score += result.score
      }
    })

    // امتیاز بر اساس زمان تخمینی
    score += 100 - exercise.estimatedTime

    // امتیاز بر اساس سختی
    if (exercise.difficulty === 'EASY') {
      score += 50
    } else if (exercise.difficulty === 'MEDIUM') {
      score += 30
    }

    return {
      ...exercise,
      score,
    }
  })

  // مرتب‌سازی نهایی
  scoredExercises.sort((a, b) => b.score - a.score)

  // برگرداندن 5 تمرین برتر
  return scoredExercises.slice(0, 5).map(exercise => ({
    id: exercise.id,
    title: exercise.title,
    description: exercise.description,
    category: exercise.category,
    suitableFor: exercise.suitableFor as Exercise['suitableFor'],
    estimatedTime: exercise.estimatedTime,
    difficulty: exercise.difficulty as Exercise['difficulty'],
    tags: exercise.tags,
  }))
} 
