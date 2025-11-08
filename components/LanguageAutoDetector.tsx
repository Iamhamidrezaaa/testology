"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/app/providers/LanguageProvider";

const supported = ["en", "fa", "ar", "fr", "ru", "tr", "es"];

interface LanguageAutoDetectorProps {
  onLanguageDetected?: (lang: string) => void;
  autoDetect?: boolean;
}

export default function LanguageAutoDetector({ 
  onLanguageDetected, 
  autoDetect = true 
}: LanguageAutoDetectorProps) {
  const { lang, setLang } = useLanguage();
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !autoDetect || detected) return;

    const detectLanguage = () => {
      try {
        // 1. بررسی Cookie اولویت اول
        const cookieLang = document.cookie
          .split(';')
          .find(cookie => cookie.trim().startsWith('testology-language='))
          ?.split('=')[1];

        if (cookieLang && supported.includes(cookieLang)) {
          if (cookieLang !== lang) {
            setLang(cookieLang as any);
            onLanguageDetected?.(cookieLang);
          }
          setDetected(true);
          return;
        }

        // 2. بررسی localStorage
        const storedLang = localStorage.getItem('testology-language');
        if (storedLang && supported.includes(storedLang)) {
          if (storedLang !== lang) {
            setLang(storedLang as any);
            onLanguageDetected?.(storedLang);
          }
          setDetected(true);
          return;
        }

        // 3. تشخیص از مرورگر
        const browserLang = navigator.language.split("-")[0];
        if (supported.includes(browserLang) && browserLang !== lang) {
          setLang(browserLang as any);
          onLanguageDetected?.(browserLang);
          
          // ذخیره در localStorage
          localStorage.setItem('testology-language', browserLang);
        }

        // 4. تشخیص از Accept-Language header (اگر در دسترس باشد)
        const acceptLanguage = navigator.languages?.[0]?.split("-")[0];
        if (acceptLanguage && supported.includes(acceptLanguage) && acceptLanguage !== lang) {
          setLang(acceptLanguage as any);
          onLanguageDetected?.(acceptLanguage);
          
          // ذخیره در localStorage
          localStorage.setItem('testology-language', acceptLanguage);
        }

        setDetected(true);
      } catch (error) {
        console.error('Language detection error:', error);
        setDetected(true);
      }
    };

    // تأخیر کوتاه برای اطمینان از بارگذاری کامل
    const timeout = setTimeout(detectLanguage, 100);
    
    return () => clearTimeout(timeout);
  }, [lang, setLang, onLanguageDetected, autoDetect, detected]);

  // ذخیره تغییرات زبان در localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && lang) {
      localStorage.setItem('testology-language', lang);
    }
  }, [lang]);

  return null;
}

/**
 * Hook برای تشخیص زبان
 */
export function useLanguageDetection() {
  const { lang, setLang } = useLanguage();
  const [isDetecting, setIsDetecting] = useState(false);

  const detectLanguage = async () => {
    setIsDetecting(true);
    
    try {
      // درخواست به API برای تشخیص زبان
      const response = await fetch('/api/detect-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAgent: navigator.userAgent,
          languages: navigator.languages,
          cookie: document.cookie
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.language && data.language !== lang) {
          setLang(data.language);
          return data.language;
        }
      }
    } catch (error) {
      console.error('Language detection API error:', error);
    } finally {
      setIsDetecting(false);
    }

    return null;
  };

  return {
    detectLanguage,
    isDetecting,
    currentLang: lang
  };
}

/**
 * کامپوننت نمایش وضعیت تشخیص زبان
 */
export function LanguageDetectionStatus() {
  const { lang } = useLanguage();
  const [detectionHistory, setDetectionHistory] = useState<string[]>([]);

  useEffect(() => {
    const history = localStorage.getItem('testology-language-history');
    if (history) {
      setDetectionHistory(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    if (lang) {
      const newHistory = [lang, ...detectionHistory.slice(0, 4)]; // نگه داشتن 5 مورد آخر
      setDetectionHistory(newHistory);
      localStorage.setItem('testology-language-history', JSON.stringify(newHistory));
    }
  }, [lang]);

  if (typeof window === "undefined") return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 text-xs">
      <div className="font-semibold mb-1">🌍 Language Detection</div>
      <div className="text-gray-600 dark:text-gray-400">
        Current: <span className="font-medium">{lang}</span>
      </div>
      {detectionHistory.length > 1 && (
        <div className="text-gray-500 dark:text-gray-500 mt-1">
          History: {detectionHistory.slice(1, 4).join(', ')}
        </div>
      )}
    </div>
  );
}

/**
 * کامپوننت انتخاب دستی زبان
 */
export function ManualLanguageSelector() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fa", name: "فارسی", flag: "🇮🇷" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ];

  const currentLang = languages.find(l => l.code === lang);

  const handleLanguageChange = (newLang: string) => {
    setLang(newLang as any);
    setIsOpen(false);
    
    // ذخیره در localStorage
    localStorage.setItem('testology-language', newLang);
    
    // ذخیره در cookie
    document.cookie = `testology-language=${newLang}; path=/; max-age=${60 * 60 * 24 * 365}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="text-sm font-medium">{currentLang?.name}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${
                lang === language.code ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">({language.code})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}














