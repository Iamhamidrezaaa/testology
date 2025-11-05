/**
 * Helper functions برای ترجمه
 */

import { createTranslator, getTranslation } from '@/i18n';
import { Locale } from '@/i18n/config';

/**
 * ترجمه با پارامترها
 */
export function translate(
  lang: string,
  key: string,
  params?: Record<string, string | number>
): string {
  const t = createTranslator(lang);
  return t(key, params);
}

/**
 * Hook برای استفاده در کامپوننت‌ها
 */
export function useTranslations(lang: string) {
  return {
    t: (key: string, params?: Record<string, string | number>) => {
      return translate(lang, key, params);
    },
    lang,
    isRTL: ['fa', 'ar', 'tr'].includes(lang)
  };
}

/**
 * ترجمه خودکار با GPT (برای محتوای دینامیک)
 */
export async function translateWithGPT(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        sourceLang,
        targetLang
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.translation;
    }
  } catch (error) {
    console.error('Translation error:', error);
  }

  return text;
}

/**
 * ترجمه دسته‌ای (برای تست‌ها و مقالات)
 */
export async function batchTranslate(
  items: Array<{ id: string; text: string }>,
  sourceLang: string,
  targetLang: string
): Promise<Record<string, string>> {
  const translations: Record<string, string> = {};

  for (const item of items) {
    translations[item.id] = await translateWithGPT(item.text, sourceLang, targetLang);
  }

  return translations;
}

export default {
  translate,
  useTranslations,
  translateWithGPT,
  batchTranslate
};

