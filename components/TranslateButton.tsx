"use client";

import { useState } from 'react';

interface TranslateButtonProps {
  articleId?: string;
  content: string;
  type: 'article' | 'test';
}

export default function TranslateButton({ articleId, content, type }: TranslateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [translatedLang, setTranslatedLang] = useState<string | null>(null);
  const [translatedContent, setTranslatedContent] = useState<string>('');

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const handleTranslate = async (targetLang: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content,
          sourceLang: 'fa',
          targetLang: targetLang
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTranslatedContent(data.translation);
        setTranslatedLang(targetLang);
        
        // نمایش نتیجه
        alert(`✅ Successfully translated to ${targetLang.toUpperCase()}`);
      } else {
        alert('❌ Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert('❌ Translation error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <span>🌍</span>
        Translate {type === 'article' ? 'Article' : 'Test'}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Automatically translate this {type} using AI:
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => handleTranslate(lang.code)}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              translatedLang === lang.code
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-purple-100 dark:hover:bg-purple-900'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={lang.name}
          >
            <span className="text-xl">{lang.flag}</span>
            <span>{lang.code.toUpperCase()}</span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin text-2xl">⏳</div>
            <span className="text-blue-700 dark:text-blue-300">
              Translating with GPT-4... This may take a few seconds.
            </span>
          </div>
        </div>
      )}

      {translatedContent && (
        <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-green-700 dark:text-green-300">
              ✅ Translated to {translatedLang?.toUpperCase()}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(translatedContent);
                alert('Copied to clipboard!');
              }}
              className="text-sm px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Copy
            </button>
          </div>
          <div className="max-h-40 overflow-y-auto text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded">
            {translatedContent}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        💡 Powered by GPT-4 - Professional psychology translation
      </div>
    </div>
  );
}















