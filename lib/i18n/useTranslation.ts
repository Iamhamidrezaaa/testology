"use client";
import { useLanguage } from "@/app/providers/LanguageProvider";
import en from "@/public/locales/en/common.json";
import ar from "@/public/locales/ar/common.json";
import fr from "@/public/locales/fr/common.json";
import ru from "@/public/locales/ru/common.json";
import tr from "@/public/locales/tr/common.json";
import es from "@/public/locales/es/common.json";

const dictionaries: Record<string, any> = { 
  en, 
  ar, 
  fr, 
  ru, 
  tr, 
  es 
};

export function useTranslation() {
  const { lang } = useLanguage();
  
  const t = (key: string, fallback?: string): string => {
    // تلاش برای پیدا کردن ترجمه در زبان فعلی
    const currentDict = dictionaries[lang];
    if (currentDict && currentDict[key]) {
      return currentDict[key];
    }
    
    // fallback به انگلیسی
    const englishDict = dictionaries['en'];
    if (englishDict && englishDict[key]) {
      return englishDict[key];
    }
    
    // fallback به مقدار پیش‌فرض یا کلید
    return fallback || key;
  };

  const tWithParams = (key: string, params: Record<string, string | number> = {}): string => {
    let translation = t(key);
    
    // جایگزینی پارامترها
    Object.entries(params).forEach(([param, value]) => {
      translation = translation.replace(`{{${param}}}`, String(value));
    });
    
    return translation;
  };

  const getDirection = (): 'rtl' | 'ltr' => {
    const rtlLanguages = ['ar', 'tr'];
    return rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
  };

  const isRTL = (): boolean => {
    return getDirection() === 'rtl';
  };

  const getLanguageName = (): string => {
    const languageNames: Record<string, string> = {
      'en': 'English',
      'ar': 'العربية',
      'fr': 'Français',
      'ru': 'Русский',
      'tr': 'Türkçe',
      'es': 'Español'
    };
    
    return languageNames[lang] || 'English';
  };

  const getLanguageFlag = (): string => {
    const languageFlags: Record<string, string> = {
      'en': '🇬🇧',
      'ar': '🇸🇦',
      'fr': '🇫🇷',
      'ru': '🇷🇺',
      'tr': '🇹🇷',
      'es': '🇪🇸'
    };
    
    return languageFlags[lang] || '🇬🇧';
  };

  return {
    t,
    tWithParams,
    lang,
    getDirection,
    isRTL,
    getLanguageName,
    getLanguageFlag,
    // Helper برای کامپوننت‌ها
    dir: getDirection(),
    rtl: isRTL()
  };
}

// Hook برای دریافت تمام زبان‌های موجود
export function useAvailableLanguages() {
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧', native: 'English' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
    { code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺', native: 'Русский' },
    { code: 'tr', name: 'Turkish', flag: '🇹🇷', native: 'Türkçe' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español' }
  ];

  return languages;
}

// Hook برای تغییر زبان
export function useLanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  
  const switchLanguage = (newLang: string) => {
    setLang(newLang as any);
    
    // ذخیره در localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('testology-language', newLang);
    }
    
    // ذخیره در cookie
    if (typeof document !== 'undefined') {
      document.cookie = `lang=${newLang}; path=/; max-age=31536000`;
    }
  };

  return {
    currentLanguage: lang,
    switchLanguage,
    availableLanguages: useAvailableLanguages()
  };
}














