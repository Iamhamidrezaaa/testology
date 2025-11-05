"use client";
import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface SeoMeta {
  id: string;
  key: string;
  lang: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  createdAt: string;
  updatedAt: string;
}

interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'test' | 'exercise';
  slug: string;
  hasSeoMeta: boolean;
  seoMetaCount: number;
}

export default function SeoManagerPage() {
  const { t } = useTranslation();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [seoMetas, setSeoMetas] = useState<SeoMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      
      // Load articles
      const articlesResponse = await fetch('/api/articles');
      const articlesData = await articlesResponse.json();
      
      // Load tests
      let testsData = { tests: [] };
      try {
        const testsResponse = await fetch('/api/tests');
        testsData = await testsResponse.json();
      } catch (error) {
        console.log('Tests API not available');
      }

      const allContent: ContentItem[] = [
        ...(articlesData.articles || []).map((article: any) => ({
          id: article.id,
          title: article.title,
          type: 'article' as const,
          slug: article.slug,
          hasSeoMeta: false,
          seoMetaCount: 0
        })),
        ...(testsData.tests || []).map((test: any) => ({
          id: test.id,
          title: test.title,
          type: 'test' as const,
          slug: test.slug,
          hasSeoMeta: false,
          seoMetaCount: 0
        }))
      ];

      setContent(allContent);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSeoMetas = async (item: ContentItem) => {
    try {
      const response = await fetch(`/api/admin/seo?type=${item.type}&id=${item.id}`);
      const data = await response.json();
      
      if (data.success) {
        setSeoMetas(data.seoMetas);
      }
    } catch (error) {
      console.error('Failed to load SEO metas:', error);
    }
  };

  const handleGenerateSeo = async (item: ContentItem) => {
    setGenerating(true);
    setLogs([]);
    
    try {
      const response = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          type: item.type,
          title: item.title,
          content: `Content for ${item.title}` // در واقع باید محتوای کامل باشد
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setLogs(prev => [...prev, `✅ Generated SEO for ${result.stats.successful}/${result.stats.total} languages`]);
        await loadSeoMetas(item);
        await loadContent(); // Refresh content list
      } else {
        setLogs(prev => [...prev, `❌ SEO generation failed`]);
      }
    } catch (error) {
      console.error('SEO generation error:', error);
      setLogs(prev => [...prev, `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setGenerating(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return '📄';
      case 'test': return '🧠';
      case 'exercise': return '💪';
      default: return '📝';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'test': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'exercise': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getLanguageFlag = (lang: string) => {
    const flags: Record<string, string> = {
      'en': '🇬🇧',
      'fa': '🇮🇷',
      'ar': '🇸🇦',
      'fr': '🇫🇷',
      'ru': '🇷🇺',
      'tr': '🇹🇷',
      'es': '🇪🇸'
    };
    return flags[lang] || '🌍';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🤖 AI SEO Manager</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate multilingual SEO meta tags using AI
          </p>
        </div>
      </div>

      {/* Logs */}
      {logs.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2">📋 Generation Logs</h3>
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="text-sm font-mono">{log}</div>
            ))}
          </div>
        </div>
      )}

      {/* Content List */}
      {selectedItem ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedItem(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              ← Back to List
            </button>
            <h2 className="text-xl font-semibold">
              {getTypeIcon(selectedItem.type)} {selectedItem.title}
            </h2>
          </div>
          
          {/* SEO Meta Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {seoMetas.map((meta) => (
              <div key={meta.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getLanguageFlag(meta.lang)}</span>
                    <span className="font-medium">{meta.lang.toUpperCase()}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(meta.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Title</label>
                    <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                      {meta.title}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Description</label>
                    <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                      {meta.description}
                    </div>
                  </div>
                  
                  {meta.keywords && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Keywords</label>
                      <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                        {meta.keywords}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No Content Found</h3>
              <p>Create some articles or tests to manage their SEO.</p>
            </div>
          ) : (
            content.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedItem(item);
                  loadSeoMetas(item);
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getTypeIcon(item.type)}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                      {item.type.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {item.hasSeoMeta && (
                      <span className="text-green-500 text-sm">✓</span>
                    )}
                    <span className="text-xs text-gray-500">
                      {item.seoMetaCount} SEO
                    </span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {item.title}
                </h3>
                
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  /{item.slug}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateSeo(item);
                    }}
                    disabled={generating}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generating ? 'Generating...' : 'Generate SEO'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}














