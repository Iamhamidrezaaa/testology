"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar' | 'fr' | 'ru' | 'tr' | 'es' | 'fa';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
  isRTL: false,
  loading: false
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // بارگذاری زبان از localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Language;
    if (savedLang && ['en', 'ar', 'fr', 'ru', 'tr', 'es', 'fa'].includes(savedLang)) {
      setLangState(savedLang);
    } else {
      // تشخیص از مرورگر
      const browserLang = navigator.language.split('-')[0] as Language;
      if (['en', 'ar', 'fr', 'ru', 'tr', 'es', 'fa'].includes(browserLang)) {
        setLangState(browserLang);
      }
    }
  }, []);

  // بارگذاری ترجمه‌ها
  useEffect(() => {
    async function loadTranslations() {
      setLoading(true);
      try {
        const res = await fetch(`/locales/${lang}/common.json`);
        if (res.ok) {
          const data = await res.json();
          setTranslations(flattenObject(data));
        }
      } catch (error) {
        console.warn(`Could not load translations for ${lang}`, error);
      } finally {
        setLoading(false);
      }
    }

    loadTranslations();
  }, [lang]);

  // ذخیره در localStorage و Cookie
  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
    document.cookie = `lang=${newLang}; path=/; max-age=31536000`;
    
    // تنظیم جهت صفحه
    document.documentElement.dir = ['fa', 'ar', 'tr'].includes(newLang) ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  // تابع ترجمه
  const t = (key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  };

  const isRTL = ['fa', 'ar', 'tr'].includes(lang);

  // تنظیم direction در mount
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

/**
 * تبدیل nested object به flat object
 */
function flattenObject(obj: any, prefix = ''): Record<string, string> {
  const flattened: Record<string, string> = {};

  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(flattened, flattenObject(obj[key], newKey));
    } else {
      flattened[newKey] = String(obj[key]);
    }
  }

  return flattened;
}

export default LanguageProvider;















