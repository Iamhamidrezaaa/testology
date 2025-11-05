"use client";
import { useLanguageSwitcher } from "@/lib/i18n/useTranslation";
import { useRouter, usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const { currentLanguage, switchLanguage, availableLanguages } = useLanguageSwitcher();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLang: string) => {
    switchLanguage(newLang);
    
    // تغییر URL برای حفظ مسیر فعلی
    const segments = pathname.split('/');
    if (availableLanguages.some(lang => lang.code === segments[1])) {
      // اگر زبان در URL موجود است، آن را جایگزین کن
      segments[1] = newLang;
    } else {
      // اگر زبان در URL نیست، آن را اضافه کن
      segments.splice(1, 0, newLang);
    }
    
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <div className="relative">
      <select
        value={currentLanguage}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label="Select Language"
      >
        {availableLanguages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.flag} {language.native}
          </option>
        ))}
      </select>
      
      {/* آیکون dropdown */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

// کامپوننت ساده‌تر برای استفاده در navbar
export function SimpleLanguageSwitcher() {
  const { currentLanguage, switchLanguage, availableLanguages } = useLanguageSwitcher();

  return (
    <div className="flex items-center space-x-2">
      {availableLanguages.map((language) => (
        <button
          key={language.code}
          onClick={() => switchLanguage(language.code)}
          className={`px-2 py-1 rounded text-sm transition-colors ${
            currentLanguage === language.code
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title={language.name}
        >
          {language.flag}
        </button>
      ))}
    </div>
  );
}

// کامپوننت dropdown برای استفاده در mobile
export function MobileLanguageSwitcher() {
  const { currentLanguage, switchLanguage, availableLanguages } = useLanguageSwitcher();
  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
        <span>{currentLang?.flag}</span>
        <span>{currentLang?.native}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {availableLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => switchLanguage(language.code)}
              className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                currentLanguage === language.code
                  ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span>{language.native}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">({language.name})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}