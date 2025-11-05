"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Bookmark {
  id: string;
  targetId: string;
  targetType: string;
  createdAt: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchBookmarks();
  }, [filter]);

  const fetchBookmarks = async () => {
    try {
      const url = filter === 'all' 
        ? '/api/bookmarks' 
        : `/api/bookmarks?type=${filter}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (targetId: string, targetType: string) => {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId, targetType })
      });

      if (response.ok) {
        setBookmarks(bookmarks.filter(b => b.targetId !== targetId || b.targetType !== targetType));
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 text-center">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
            <span>❤️</span>
            ذخیره‌های من
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            محتوای ذخیره شده برای مطالعه بعدی
          </p>
        </div>

        {/* فیلتر */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'همه' },
            { value: 'article', label: '📚 مقالات' },
            { value: 'exercise', label: '💪 تمرین‌ها' },
            { value: 'therapist', label: '👨‍⚕️ درمانگران' },
            { value: 'live', label: '🔴 لایوها' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === value
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* لیست */}
        {bookmarks.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              هنوز چیزی ذخیره نکرده‌اید
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              با کلیک روی دکمه ❤️ محتوای مورد علاقه خود را ذخیره کنید
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">
                        {bookmark.targetType === 'article' ? '📚' :
                         bookmark.targetType === 'exercise' ? '💪' :
                         bookmark.targetType === 'therapist' ? '👨‍⚕️' : '🔴'}
                      </span>
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded">
                        {bookmark.targetType}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ذخیره شده در: {new Date(bookmark.createdAt).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                  <button
                    onClick={() => removeBookmark(bookmark.targetId, bookmark.targetType)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                    title="حذف"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
















