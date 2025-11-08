"use client";
import { useLanguage } from "@/app/providers/LanguageProvider";

const languages = [
  { code: "en", label: "EN", flag: "🇬🇧", name: "English" },
  { code: "fa", label: "FA", flag: "🇮🇷", name: "فارسی" },
  { code: "ar", label: "AR", flag: "🇸🇦", name: "العربية" },
  { code: "fr", label: "FR", flag: "🇫🇷", name: "Français" },
  { code: "ru", label: "RU", flag: "🇷🇺", name: "Русский" },
  { code: "tr", label: "TR", flag: "🇹🇷", name: "Türkçe" },
  { code: "es", label: "ES", flag: "🇪🇸", name: "Español" },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex gap-1 items-center">
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code as any)}
          className={`px-2 py-1 rounded text-sm font-semibold transition-all duration-200 ${
            lang === l.code
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
          title={l.name}
        >
          {l.flag} {l.label}
        </button>
      ))}
    </div>
  );
}

// کامپوننت ساده‌تر برای mobile
export function MobileLanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex flex-wrap gap-1">
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code as any)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            lang === l.code
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <span className="mr-1">{l.flag}</span>
          {l.name}
        </button>
      ))}
    </div>
  );
}

// کامپوننت dropdown برای header
export function HeaderLanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const currentLang = languages.find(l => l.code === lang);

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="text-sm font-medium">{currentLang?.label}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code as any)}
              className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                lang === l.code
                  ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="text-lg">{l.flag}</span>
              <span>{l.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">({l.label})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}














