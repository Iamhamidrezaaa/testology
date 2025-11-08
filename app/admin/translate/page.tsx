"use client";
import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import TranslationEditor from '../components/TranslationEditor';

interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'test' | 'exercise';
  createdAt: string;
  hasTranslations: boolean;
}

export default function TranslationManagementPage() {
  const { t } = useTranslation();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'articles' | 'tests' | 'exercises'>('all');

  useEffect(() => {
    loadContent();
  }, [filter]);

  const loadContent = async () => {
    try {
      setLoading(true);
      
      // Load articles
      const articlesResponse = await fetch('/api/articles');
      const articlesData = await articlesResponse.json();
      
      // Load tests (if API exists)
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
          createdAt: article.createdAt,
          hasTranslations: false // This would need to be checked
        })),
        ...(testsData.tests || []).map((test: any) => ({
          id: test.id,
          title: test.title,
          type: 'test' as const,
          createdAt: test.createdAt,
          hasTranslations: false
        }))
      ];

      // Filter content
      const filterToTypeMap: Record<'articles' | 'tests' | 'exercises', 'article' | 'test' | 'exercise'> = {
        articles: 'article',
        tests: 'test',
        exercises: 'exercise'
      };
      
      const filteredContent = filter === 'all' 
        ? allContent 
        : allContent.filter(item => item.type === filterToTypeMap[filter as 'articles' | 'tests' | 'exercises']);

      setContent(filteredContent.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-bold">🌍 Translation Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage translations for your content
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {[
          { key: 'all', label: 'All Content', icon: '📚' },
          { key: 'articles', label: 'Articles', icon: '📄' },
          { key: 'tests', label: 'Tests', icon: '🧠' },
          { key: 'exercises', label: 'Exercises', icon: '💪' }
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span className="mr-2">{icon}</span>
            {label}
          </button>
        ))}
      </div>

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
          
          <TranslationEditor
            type={selectedItem.type}
            referenceId={selectedItem.id}
            title={selectedItem.title}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No Content Found</h3>
              <p>Create some articles or tests to manage their translations.</p>
            </div>
          ) : (
            content.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getTypeIcon(item.type)}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                      {item.type.toUpperCase()}
                    </span>
                  </div>
                  
                  {item.hasTranslations && (
                    <span className="text-green-500 text-sm">✓</span>
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {item.title}
                </h3>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Created: {new Date(item.createdAt).toLocaleDateString()}
                </div>
                
                <div className="mt-3 text-sm text-blue-600 dark:text-blue-400">
                  Click to manage translations →
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}














