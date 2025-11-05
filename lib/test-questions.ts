// Helper functions for getting test questions
import pssQuestions from '@/app/data/pss-questions';
import gad7Questions from '@/app/data/gad7-questions';
import phq9Questions from '@/app/data/phq9-questions';
import rosenbergQuestions from '@/app/data/rosenberg-questions';
import swlsQuestions from '@/app/data/swls-questions';

const testQuestionsMap: Record<string, any> = {
  'stress': pssQuestions,
  'anxiety': gad7Questions,
  'depression': phq9Questions,
  'self-esteem': rosenbergQuestions,
  'life-satisfaction': swlsQuestions,
};

export async function getQuestionsByTestSlug(slug: string) {
  return testQuestionsMap[slug] || null;
}

export function getAllTestSlugs(): string[] {
  return Object.keys(testQuestionsMap);
}
















