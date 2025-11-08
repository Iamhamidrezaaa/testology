import { Question, QuestionType } from '@/types/test'

/**
 * Helper function to create a Question with all required fields
 */
export function createQuestion(
  id: string,
  text: string,
  options: string[],
  testId: string,
  order: number,
  type: QuestionType = 'SINGLE_CHOICE',
  required: boolean = true
): Question {
  return {
    id,
    text,
    options,
    testId,
    order,
    type,
    required,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

// فقط فیلدهای خام هر سؤال
type RawQuestion = Pick<Question, 'text' | 'options'>

/**
 * Helper function to normalize raw questions to full Question objects
 */
export function normalizeQuestions(
  raws: RawQuestion[],
  defaults: Pick<Question, 'testId' | 'type' | 'required'>
): Question[] {
  return raws.map((q, i) => ({
    id: `${defaults.testId}-${i + 1}`,
    order: i + 1,
    ...defaults,
    ...q,
    createdAt: new Date(),
    updatedAt: new Date()
  }))
}

