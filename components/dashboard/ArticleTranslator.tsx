"use client";

import React, { useState, useEffect } from 'react';

const languages = {
  en: { flag: '🇬🇧', name: 'English' },
  ar: { flag: '🇸🇦', name: 'العربية' },
  fr: { flag: '🇫🇷', name: 'Français' },
  ru: { flag: '🇷🇺', name: 'Русский' },
  tr: { flag: '🇹🇷', name: 'Türkçe' },
  es: { flag: '🇪🇸', name: 'Español' }
};

interface ArticleTranslatorProps {
  articleId: string;
}

export default function ArticleTranslator({ articleId }: ArticleTranslatorProps) {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loadingLang, setLoadingLang] = useState<string | null>(null);
  const [editingLang, setEditingLang] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');

  useEffect(() => {
    loadTranslations();
  }, [articleId]);

  const loadTranslations = async () => {
    try {
      const response = await fetch(`/api/articles/translate?articleId=${articleId}`);
      if (response.ok) {
        const data = await response.json();
        setTranslations(data);
      }
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  };

  const handleAutoTranslate = async (language: string) => {
    setLoadingLang(language);
    try {
      const response = await fetch('/api/articles/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          language,
          mode: 'auto'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTranslations(prev => ({
          ...prev,
          [language]: data.translation.content
        }));
        alert(`✅ Successfully translated to ${languages[language as keyof typeof languages].name}`);
      } else {
        alert('❌ Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert('❌ Translation error');
    } finally {
      setLoadingLang(null);
    }
  };

  const handleSaveManual = async (language: string) => {
    try {
      const response = await fetch('/api/articles/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          language,
          mode: 'manual',
          text: editedContent
        })
      });

      if (response.ok) {
        setTranslations(prev => ({
          ...prev,
          [language]: editedContent
        }));
        setEditingLang(null);
        alert('✅ Translation saved');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ Save failed');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mt-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <span>🌐</span>
        Article Translations
      </h3>

      {/* Language Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        {Object.entries(languages).map(([code, lang]) => (
          <button
            key={code}
            onClick={() => handleAutoTranslate(code)}
            disabled={loadingLang !== null}
            className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
              translations[code]
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-purple-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="text-3xl">{lang.flag}</span>
            <span className="text-sm font-medium text-gray-800 dark:text-white">
              {code.toUpperCase()}
            </span>
            {loadingLang === code && (
              <span className="text-xs text-blue-600">Translating...</span>
            )}
            {translations[code] && !loadingLang && (
              <span className="text-xs text-green-600 dark:text-green-400">✓ Ready</span>
            )}
          </button>
        ))}
      </div>

      {/* Bulk Translate */}
      <button
        onClick={async () => {
          const untranslated = Object.keys(languages).filter(lang => !translations[lang]);
          for (const lang of untranslated) {
            await handleAutoTranslate(lang);
          }
        }}
        disabled={loadingLang !== null}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-md disabled:opacity-50"
      >
        🌍 Translate All Missing Languages
      </button>

      {/* Translations Display */}
      {Object.keys(translations).length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="font-semibold text-gray-800 dark:text-white">Saved Translations:</h4>
          
          {Object.entries(translations).map(([lang, content]) => (
            <div key={lang} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{languages[lang as keyof typeof languages].flag}</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {languages[lang as keyof typeof languages].name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setEditingLang(lang);
                    setEditedContent(content);
                  }}
                  className="text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  Edit
                </button>
              </div>

              {editingLang === lang ? (
                <div>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 min-h-[200px] dark:bg-gray-700 dark:text-white"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleSaveManual(lang)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingLang(null)}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-400 max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {content.substring(0, 300)}
                  {content.length > 300 && '...'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}















