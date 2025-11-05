"use client";
import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface Translation {
  id: string;
  language: string;
  content: string;
  translated: boolean;
  updatedAt: string;
}

interface TranslationEditorProps {
  type: 'article' | 'test' | 'exercise';
  referenceId: string;
  title: string;
}

const languageNames: Record<string, string> = {
  'ar': 'العربية',
  'fr': 'Français', 
  'ru': 'Русский',
  'tr': 'Türkçe',
  'es': 'Español'
};

const languageFlags: Record<string, string> = {
  'ar': '🇸🇦',
  'fr': '🇫🇷',
  'ru': '🇷🇺', 
  'tr': '🇹🇷',
  'es': '🇪🇸'
};

export default function TranslationEditor({ type, referenceId, title }: TranslationEditorProps) {
  const { t } = useTranslation();
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [autoTranslating, setAutoTranslating] = useState(false);

  useEffect(() => {
    loadTranslations();
  }, [type, referenceId]);

  const loadTranslations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/translate?type=${type}&id=${referenceId}`);
      const data = await response.json();
      
      if (data.success) {
        setTranslations(data.translations);
      }
    } catch (error) {
      console.error('Failed to load translations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoTranslate = async () => {
    try {
      setAutoTranslating(true);
      const response = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: referenceId,
          type,
          content: 'Auto-translate request'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        await loadTranslations();
        alert(`Successfully translated ${result.stats.successful}/${result.stats.total} languages`);
      } else {
        alert('Auto-translation failed');
      }
    } catch (error) {
      console.error('Auto-translation error:', error);
      alert('Auto-translation failed');
    } finally {
      setAutoTranslating(false);
    }
  };

  const handleSaveTranslation = async (language: string, content: string) => {
    try {
      setSaving(language);
      const response = await fetch('/api/admin/translate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: referenceId,
          type,
          language,
          content
        })
      });

      const result = await response.json();
      
      if (result.success) {
        await loadTranslations();
      } else {
        alert('Failed to save translation');
      }
    } catch (error) {
      console.error('Save translation error:', error);
      alert('Failed to save translation');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">🌍 {t('language')} Translations</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {title} - {type.toUpperCase()}
          </p>
        </div>
        
        <button
          onClick={handleAutoTranslate}
          disabled={autoTranslating}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {autoTranslating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Translating...</span>
            </>
          ) : (
            <>
              <span>🤖</span>
              <span>Auto Translate</span>
            </>
          )}
        </button>
      </div>

      {/* Translations */}
      {translations.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No translations available</p>
          <p className="text-sm">Click "Auto Translate" to generate translations</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {translations.map((translation) => (
            <TranslationCard
              key={translation.id}
              translation={translation}
              onSave={handleSaveTranslation}
              saving={saving === translation.language}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TranslationCardProps {
  translation: Translation;
  onSave: (language: string, content: string) => void;
  saving: boolean;
}

function TranslationCard({ translation, onSave, saving }: TranslationCardProps) {
  const [content, setContent] = useState(translation.content);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setContent(translation.content);
  }, [translation.content]);

  const handleSave = () => {
    onSave(translation.language, content);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(translation.content);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{languageFlags[translation.language]}</span>
          <span className="font-medium">{languageNames[translation.language]}</span>
          {translation.translated ? (
            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
              Auto
            </span>
          ) : (
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
              Manual
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter translation..."
          />
        ) : (
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
              {content}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Updated: {new Date(translation.updatedAt).toLocaleString()}
      </div>
    </div>
  );
}














