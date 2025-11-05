/**
 * تنظیمات اصلی چندزبانه‌سازی Testology
 * پشتیبانی از 7 زبان: فارسی، انگلیسی، عربی، فرانسوی، روسی، ترکی، اسپانیایی
 */

export const i18nConfig = {
  defaultLocale: 'fa',
  locales: ['fa', 'en', 'ar', 'fr', 'ru', 'tr', 'es'],
  rtlLanguages: ['fa', 'ar', 'tr'],
  fallbackLocale: 'en',
  
  // نام‌های نمایشی زبان‌ها
  localeNames: {
    fa: 'فارسی',
    en: 'English',
    ar: 'العربية',
    fr: 'Français',
    ru: 'Русский',
    tr: 'Türkçe',
    es: 'Español'
  },

  // آیکون پرچم برای هر زبان
  localeFlags: {
    fa: '🇮🇷',
    en: '🇺🇸',
    ar: '🇸🇦',
    fr: '🇫🇷',
    ru: '🇷🇺',
    tr: '🇹🇷',
    es: '🇪🇸'
  }
} as const;

export type Locale = typeof i18nConfig.locales[number];

/**
 * تشخیص جهت متن (RTL/LTR)
 */
export const getDirection = (lang: string): 'rtl' | 'ltr' => {
  return i18nConfig.rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
};

/**
 * دریافت نام زبان
 */
export const getLocaleName = (lang: string): string => {
  return i18nConfig.localeNames[lang as Locale] || lang;
};

/**
 * دریافت پرچم زبان
 */
export const getLocaleFlag = (lang: string): string => {
  return i18nConfig.localeFlags[lang as Locale] || '🌐';
};

export default i18nConfig;

