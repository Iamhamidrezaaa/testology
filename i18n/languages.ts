/**
 * اطلاعات کامل زبان‌های پشتیبانی شده
 */

export const languages = {
  fa: {
    code: 'fa',
    name: 'فارسی',
    native: 'فارسی',
    dir: 'rtl' as const,
    flag: '🇮🇷',
    locale: 'fa-IR',
    currency: 'IRR',
    dateFormat: 'YYYY/MM/DD',
    enabled: true
  },
  en: {
    code: 'en',
    name: 'English',
    native: 'English',
    dir: 'ltr' as const,
    flag: '🇺🇸',
    locale: 'en-US',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    enabled: true
  },
  ar: {
    code: 'ar',
    name: 'العربية',
    native: 'العربية',
    dir: 'rtl' as const,
    flag: '🇸🇦',
    locale: 'ar-SA',
    currency: 'SAR',
    dateFormat: 'DD/MM/YYYY',
    enabled: true
  },
  fr: {
    code: 'fr',
    name: 'Français',
    native: 'Français',
    dir: 'ltr' as const,
    flag: '🇫🇷',
    locale: 'fr-FR',
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    enabled: true
  },
  ru: {
    code: 'ru',
    name: 'Русский',
    native: 'Русский',
    dir: 'ltr' as const,
    flag: '🇷🇺',
    locale: 'ru-RU',
    currency: 'RUB',
    dateFormat: 'DD.MM.YYYY',
    enabled: true
  },
  tr: {
    code: 'tr',
    name: 'Türkçe',
    native: 'Türkçe',
    dir: 'rtl' as const,
    flag: '🇹🇷',
    locale: 'tr-TR',
    currency: 'TRY',
    dateFormat: 'DD.MM.YYYY',
    enabled: true
  },
  es: {
    code: 'es',
    name: 'Español',
    native: 'Español',
    dir: 'ltr' as const,
    flag: '🇪🇸',
    locale: 'es-ES',
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    enabled: true
  }
} as const;

export type LanguageCode = keyof typeof languages;

/**
 * دریافت لیست زبان‌های فعال
 */
export const getEnabledLanguages = () => {
  return Object.entries(languages)
    .filter(([_, lang]) => lang.enabled)
    .map(([code, lang]) => ({ ...lang, code }));
};

/**
 * دریافت اطلاعات یک زبان
 */
export const getLanguageInfo = (code: string) => {
  return languages[code as LanguageCode] || languages.en;
};

export default languages;

