/**
 * Auto-translation utility for content creation
 * Automatically translates content when articles/tests are created
 */

import { prisma } from '@/lib/prisma';

interface TranslationRequest {
  id: string;
  type: 'article' | 'test' | 'exercise';
  content: string;
  title?: string;
  description?: string;
}

/**
 * Trigger automatic translation for new content
 */
export async function triggerAutoTranslation(request: TranslationRequest) {
  try {
    // فراخوانی API ترجمه
    const response = await fetch('/api/admin/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Auto-translation error:', error);
    // در صورت خطا، ترجمه را در پس‌زمینه انجام نده
    return null;
  }
}

/**
 * Get translated content for a specific language
 */
export async function getTranslatedContent(
  type: string,
  referenceId: string,
  language: string
) {
  try {
    const translation = await prisma.translation.findUnique({
      where: {
        key_lang: {
          key: `${type}_${referenceId}`,
          lang: language
        }
      }
    });

    return translation?.text || null;
  } catch (error) {
    console.error('Get translation error:', error);
    return null;
  }
}

/**
 * Get all translations for content
 */
export async function getAllTranslations(type: string, referenceId: string) {
  try {
    const translations = await prisma.translation.findMany({
      where: {
        key: {
          startsWith: `${type}_${referenceId}`
        }
      },
      orderBy: { lang: 'asc' }
    });

    return translations;
  } catch (error) {
    console.error('Get all translations error:', error);
    return [];
  }
}

/**
 * Check if content has translations
 */
export async function hasTranslations(type: string, referenceId: string) {
  try {
    const count = await prisma.translation.count({
      where: {
        key: {
          startsWith: `${type}_${referenceId}`
        }
      }
    });

    return count > 0;
  } catch (error) {
    console.error('Check translations error:', error);
    return false;
  }
}

/**
 * Delete all translations for content
 */
export async function deleteTranslations(type: string, referenceId: string) {
  try {
    await prisma.translation.deleteMany({
      where: {
        key: {
          startsWith: `${type}_${referenceId}`
        }
      }
    });

    return true;
  } catch (error) {
    console.error('Delete translations error:', error);
    return false;
  }
}


















