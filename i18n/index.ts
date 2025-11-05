/**
 * سیستم ترجمه هوشمند Testology
 * با پشتیبانی از 7 زبان و fallback خودکار
 */

import { i18nConfig, type Locale } from './config';

// Import کردن تمام فایل‌های ترجمه
import faCommon from './translations/fa/common.json';
import enCommon from './translations/en/common.json';
import arCommon from './translations/ar/common.json';
import frCommon from './translations/fr/common.json';
import ruCommon from './translations/ru/common.json';
import trCommon from './translations/tr/common.json';
import esCommon from './translations/es/common.json';

const dictionaries: Record<string, any> = {
  fa: faCommon,
  en: enCommon,
  ar: arCommon,
  fr: frCommon,
  ru: ruCommon,
  tr: trCommon,
  es: esCommon
};

/**
 * دریافت ترجمه بر اساس کلید
 * @param lang - کد زبان (fa, en, ar, ...)
 * @param key - کلید ترجمه با نقطه (مثلاً 'home.title')
 * @returns متن ترجمه شده یا کلید در صورت عدم یافتن
 */
export const getTranslation = (lang: string, key: string): string => {
  const dict = dictionaries[lang] || dictionaries[i18nConfig.fallbackLocale];
  
  // Split کردن کلید به بخش‌ها (برای nested objects)
  const parts = key.split('.');
  let value: any = dict;
  
  for (const part of parts) {
    value = value?.[part];
    if (value === undefined) break;
  }
  
  // اگر پیدا نشد، از fallback استفاده کن
  if (value === undefined && lang !== i18nConfig.fallbackLocale) {
    return getTranslation(i18nConfig.fallbackLocale, key);
  }
  
  return value || key;
};

/**
 * تابع کمکی برای استفاده راحت‌تر در کامپوننت‌ها
 */
export const createTranslator = (lang: string) => {
  return (key: string, params?: Record<string, string | number>) => {
    let text = getTranslation(lang, key);
    
    // جایگزینی پارامترها
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
      });
    }
    
    return text;
  };
};

/**
 * دریافت کل dictionary یک زبان
 */
export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale] || dictionaries[i18nConfig.fallbackLocale];
};

export default {
  getTranslation,
  createTranslator,
  getDictionary
};

