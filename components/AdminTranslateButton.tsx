"use client";

import { useState } from 'react';

interface AdminTranslateButtonProps {
  type: 'article' | 'test' | 'exercise';
  id: string;
  content: string;
  onComplete?: () => void;
}

export default function AdminTranslateButton({ type, id, content, onComplete }: AdminTranslateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string>('');

  const handleTranslate = async () => {
    if (!confirm(`Translate this ${type} to 6 languages? This will use OpenAI credits.`)) {
      return;
    }

    setLoading(true);
    setProgress('Starting translation...');

    try {
      const response = await fetch('/api/auto-translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          id,
          content,
          sourceLang: 'fa'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProgress('Translation complete!');
        
        alert(
          `✅ Translation Completed!\n\n` +
          `Translated to: ${data.translatedCount} languages\n` +
          `Saved to database and JSON files\n` +
          (data.errors ? `\nErrors: ${data.errors.join(', ')}` : '')
        );

        onComplete?.();
      } else {
        const error = await response.json();
        alert(`❌ Translation failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert('❌ Translation error occurred');
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  return (
    <div className="inline-block">
      <button
        onClick={handleTranslate}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-medium transition-all shadow-md disabled:cursor-not-allowed"
      >
        <span className="text-xl">🌍</span>
        <span>{loading ? 'Translating...' : 'Translate All Languages'}</span>
      </button>

      {progress && (
        <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
          {progress}
        </div>
      )}

      {loading && (
        <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin text-2xl">⏳</div>
            <div>
              <div className="font-medium text-blue-900 dark:text-blue-300">
                Translating with GPT-4...
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-400">
                Processing 6 languages. This may take 30-60 seconds.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}















