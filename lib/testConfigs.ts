export type TestType =
  | 'ucla'
  | 'swls'
  | 'gse'
  | 'cd-risc'
  | 'maas'
  | 'mbti'
  | 'rosenberg'
  | 'scs'
  | 'scsy'
  | 'tas'
  | 'gad7'
  | 'phq9'
  | 'hads'
  | 'spin'
  | 'bai'
  | 'bdi'
  | 'stai'
  | 'pss'
  | 'ders'
  | 'panas'
  | 'attachment'
  | 'psss'
  | 'sf36'
  | 'psqi'
  | 'isi'
  | 'cope'
  | 'focus'
  | 'whoqol'
  | 'asrs'

export const testConfigs = {
  ucla: {
    type: 'ucla' as TestType,
    maxScore: 80,
    validateAnswers: (answers: number[]) => {
      return Array.isArray(answers) && answers.length === 20 && answers.every(a => a >= 1 && a <= 4)
    },
    calculateScore: (answers: number[]) => {
      return answers.reduce((sum, score) => sum + score, 0)
    },
    getExtraData: (answers: number[]) => {
      const totalScore = answers.reduce((sum, score) => sum + score, 0)
      const socialLoneliness = answers.slice(0, 10).reduce((sum, score) => sum + score, 0)
      const emotionalLoneliness = answers.slice(10).reduce((sum, score) => sum + score, 0)
      
      let level = ''
      if (totalScore >= 60) level = 'شدید'
      else if (totalScore >= 40) level = 'متوسط'
      else level = 'خفیف'
      
      return {
        totalScore,
        socialLoneliness,
        emotionalLoneliness,
        level
      }
    }
  },
  swls: {
    type: 'swls' as TestType,
    maxScore: 35,
    validateAnswers: (answers: number[]) => {
      return Array.isArray(answers) && answers.length === 5 && answers.every(a => a >= 1 && a <= 7)
    },
    calculateScore: (answers: number[]) => {
      return answers.reduce((sum, score) => sum + score, 0)
    },
    getExtraData: (answers: number[]) => {
      const totalScore = answers.reduce((sum, score) => sum + score, 0)
      
      let level = ''
      if (totalScore >= 30) level = 'بسیار راضی'
      else if (totalScore >= 25) level = 'راضی'
      else if (totalScore >= 20) level = 'نسبتاً راضی'
      else if (totalScore >= 15) level = 'کمی ناراضی'
      else if (totalScore >= 10) level = 'ناراضی'
      else level = 'بسیار ناراضی'
      
      return {
        totalScore,
        level
      }
    }
  },
  gse: {
    type: 'gse' as TestType,
    maxScore: 40,
    validateAnswers: (answers: number[]) => {
      return Array.isArray(answers) && answers.length === 10 && answers.every(a => a >= 1 && a <= 4)
    },
    calculateScore: (answers: number[]) => {
      return answers.reduce((sum, score) => sum + score, 0)
    },
    getExtraData: (answers: number[]) => {
      const totalScore = answers.reduce((sum, score) => sum + score, 0)
      
      let level = ''
      if (totalScore >= 30) level = 'خودکارآمدی بالا'
      else if (totalScore >= 20) level = 'خودکارآمدی متوسط'
      else level = 'خودکارآمدی پایین'
      
      return {
        totalScore,
        level
      }
    }
  },
  'cd-risc': {
    type: 'cd-risc' as TestType,
    maxScore: 100,
    validateAnswers: (answers: number[]) => {
      return Array.isArray(answers) && answers.length === 25 && answers.every(a => a >= 0 && a <= 4)
    },
    calculateScore: (answers: number[]) => {
      return answers.reduce((sum, score) => sum + score, 0)
    },
    getExtraData: (answers: number[]) => {
      const totalScore = answers.reduce((sum, score) => sum + score, 0)
      
      let level = ''
      if (totalScore >= 80) level = 'تاب‌آوری بالا'
      else if (totalScore >= 60) level = 'تاب‌آوری متوسط'
      else level = 'تاب‌آوری پایین'
      
      return {
        totalScore,
        level
      }
    }
  },
  maas: {
    type: 'maas' as TestType,
    maxScore: 90,
    validateAnswers: (answers: number[]) => {
      return Array.isArray(answers) && answers.length === 15 && answers.every(a => a >= 1 && a <= 6)
    },
    calculateScore: (answers: number[]) => {
      return answers.reduce((sum, score) => sum + score, 0)
    },
    getExtraData: (answers: number[]) => {
      const totalScore = answers.reduce((sum, score) => sum + score, 0)
      const averageScore = totalScore / answers.length
      
      let level = ''
      if (averageScore >= 4.5) level = 'ذهن‌آگاهی بالا'
      else if (averageScore >= 3.5) level = 'ذهن‌آگاهی متوسط'
      else level = 'ذهن‌آگاهی پایین'
      
      return {
        totalScore,
        averageScore,
        level
      }
    }
  }
} 