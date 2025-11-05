import { Question, Option } from '../types/test'

export const toLabeledOptions = (opts: string[]): Option[] =>
  opts.map((o) => ({ label: o, value: o }))

export const convertToNewQuestionFormat = (oldQuestions: { id: string; text: string; options: string[] }[]): any[] =>
  oldQuestions.map(q => ({
    ...q,
    options: toLabeledOptions(q.options)
  })) 
