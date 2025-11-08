// import { screeningQuestions, ScreeningQuestion } from '@/data/screening-questions' // Commented out as data folder is removed

interface UserProfile {
  age: number
  gender: 'male' | 'female'
  city?: string
}

function getAgeCategory(age: number): 'age-young' | 'age-middle' | 'age-senior' {
  if (age < 30) return 'age-young'
  if (age < 50) return 'age-middle'
  return 'age-senior'
}

function getCityCategory(city: string): 'city-small' | 'city-large' {
  const largeCities = ['تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز']
  return largeCities.includes(city) ? 'city-large' : 'city-small'
}

function getGenderCategory(gender: string): 'gender-male' | 'gender-female' {
  return gender === 'male' ? 'gender-male' : 'gender-female'
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export function selectCustomScreeningQuestions(user: UserProfile): any[] {
  const ageCategory = getAgeCategory(user.age)
  const genderCategory = getGenderCategory(user.gender)
  const cityCategory = user.city ? getCityCategory(user.city) : null

  // انتخاب سؤالات بر اساس دسته‌بندی‌ها
  let selectedQuestions: any[] = []

  // TODO: Implement when screeningQuestions data is available
  const generalQuestions: any[] = []
  selectedQuestions.push(...generalQuestions)

  // TODO: Implement when screeningQuestions data is available
  // const genderQuestions = screeningQuestions
  //   .filter(q => q.category === genderCategory)
  //   .slice(0, 3)
  // selectedQuestions.push(...genderQuestions)

  // const ageQuestions = screeningQuestions
  //   .filter(q => q.category === ageCategory)
  //   .slice(0, 3)
  // selectedQuestions.push(...ageQuestions)

  // if (cityCategory) {
  //   const cityQuestions = screeningQuestions
  //     .filter(q => q.category === cityCategory)
  //     .slice(0, 2)
  //   selectedQuestions.push(...cityQuestions)
  // }

  // TODO: Implement when screeningQuestions data is available
  // if (selectedQuestions.length < 15) {
  //   const remainingGeneralQuestions = screeningQuestions
  //     .filter(q => q.category === 'general' && !selectedQuestions.includes(q))
  //     .slice(0, 15 - selectedQuestions.length)
  //   selectedQuestions.push(...remainingGeneralQuestions)
  // }

  // اگر تعداد سؤالات بیشتر از 15 است، به صورت تصادفی 15 سؤال انتخاب می‌کنیم
  if (selectedQuestions.length > 15) {
    selectedQuestions = shuffleArray(selectedQuestions).slice(0, 15)
  }

  return selectedQuestions
} 
