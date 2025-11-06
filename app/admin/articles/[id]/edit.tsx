"use client";
import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";

type Params = { id?: string | string[] };

interface Article {
  id: string;
  title: string;
  content: string;
  description: string;
}

const languageOptions = [
  { code: "fa", name: "Persian (FA)", flag: "🇮🇷" },
  { code: "ar", name: "Arabic (AR)", flag: "🇸🇦" },
  { code: "fr", name: "French (FR)", flag: "🇫🇷" },
  { code: "ru", name: "Russian (RU)", flag: "🇷🇺" },
  { code: "tr", name: "Turkish (TR)", flag: "🇹🇷" },
  { code: "es", name: "Spanish (ES)", flag: "🇪🇸" },
];

export default function ArticleTranslationEditor() {
  const params = useParams<Params>();
  const { t } = useTranslation();
  
  // id را امن استخراج کن (string یا undefined)
  const articleId =
    typeof params?.id === 'string'
      ? params.id
      : Array.isArray(params?.id)
      ? params?.id[0]
      : undefined;

  // اگر id نبود: 404 بده
  if (!articleId) return notFound();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState("fa");
  const [translatedText, setTranslatedText] = useState("");
  const [saving, setSaving] = useState(false);
  const [existingTranslations, setExistingTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        // بارگذاری مقاله
        const res = await fetch(`/api/articles/${articleId}`);
        if (!res.ok) throw new Error('Failed to load article');
        const data = await res.json();
        
        if (!cancelled) {
          if (data.success) {
            setArticle(data.article);
          }
        }

        // بارگذاری ترجمه‌های موجود
        const transRes = await fetch(`/api/admin/translate?type=article&id=${articleId}`);
        if (transRes.ok) {
          const transData = await transRes.json();
          if (transData.success && !cancelled) {
            const translations: Record<string, string> = {};
            transData.translations.forEach((t: any) => {
              translations[t.lang] = t.text;
            });
            setExistingTranslations(translations);
          }
        }
      } catch (e) {
        console.error('Failed to load article:', e);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [articleId]);

  const handleLanguageChange = (lang: string) => {
    setSelectedLang(lang);
    setTranslatedText(existingTranslations[lang] || "");
  };

  const handleAutoTranslate = async () => {
    if (!article) return;

    setLoading(true);
    try {
      const response = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: articleId,
          type: "article",
          content: article.content,
          title: article.title,
          description: article.description
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // بارگذاری مجدد ترجمه‌ها
        const transRes = await fetch(`/api/admin/translate?type=article&id=${articleId}`);
        if (transRes.ok) {
          const transData = await transRes.json();
          if (transData.success) {
            const translations: Record<string, string> = {};
            transData.translations.forEach((t: any) => {
              translations[t.lang] = t.text;
            });
            setExistingTranslations(translations);
          }
        }
        alert(`✅ Successfully translated ${result.stats.successful}/${result.stats.total} languages!`);
      } else {
        alert("❌ Auto-translation failed");
      }
    } catch (error) {
      console.error('Auto-translation error:', error);
      alert("❌ Auto-translation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTranslation = async () => {
    if (!translatedText.trim()) {
      alert("Please enter translation text");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/translate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: articleId,
          type: "article",
          language: selectedLang,
          content: translatedText
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // به‌روزرسانی ترجمه‌های موجود
        setExistingTranslations(prev => ({
          ...prev,
          [selectedLang]: translatedText
        }));
        alert("✅ Translation saved successfully!");
      } else {
        alert("❌ Failed to save translation");
      }
    } catch (error) {
      console.error('Save translation error:', error);
      alert("❌ Failed to save translation");
    } finally {
      setSaving(false);
    }
  };

  if (!article) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🌍 Article Translation Editor</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {article.title}
          </p>
        </div>
        
        <button
          onClick={handleAutoTranslate}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Translating...</span>
            </>
          ) : (
            <>
              <span>🤖</span>
              <span>Auto Translate All</span>
            </>
          )}
        </button>
      </div>

      {/* Language Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4">Select Language</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {languageOptions.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                selectedLang === lang.code
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="text-2xl mb-1">{lang.flag}</div>
              <div className="text-sm font-medium">{lang.name}</div>
              {existingTranslations[lang.code] && (
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Translated</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Translation Editor */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {languageOptions.find(l => l.code === selectedLang)?.flag} 
            {languageOptions.find(l => l.code === selectedLang)?.name} Translation
          </h3>
          
          <div className="flex space-x-2">
            <button
              onClick={handleSaveTranslation}
              disabled={saving || !translatedText.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Translation'}
            </button>
          </div>
        </div>

        <textarea
          value={translatedText}
          onChange={(e) => setTranslatedText(e.target.value)}
          className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Enter translation here..."
        />
        
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Characters: {translatedText.length}
        </div>
      </div>

      {/* Original Content Preview */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Original Content</h3>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <div className="font-medium mb-2">{article.title}</div>
          <div className="whitespace-pre-wrap">{article.content.substring(0, 200)}...</div>
        </div>
      </div>
    </div>
  );
}














