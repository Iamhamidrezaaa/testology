"use client";

import { useLanguage } from '@/app/providers/LanguageProvider';

/**
 * Hook برای استفاده از ترجمه در کامپوننت‌ها
 */
export const useTranslation = () => {
  const { t, lang, isRTL, loading } = useLanguage();

  /**
   * ترجمه با پارامترها
   */
  const translate = (key: string, params?: Record<string, string | number>, fallback?: string): string => {
    let text = t(key, fallback);

    // جایگزینی پارامترها
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
      });
    }

    return text;
  };

  return {
    t: translate,
    lang,
    isRTL,
    loading
  };
};

export default useTranslation;















