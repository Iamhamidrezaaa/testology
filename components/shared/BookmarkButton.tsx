"use client";

import React, { useEffect, useState } from 'react';

interface BookmarkButtonProps {
  targetId: string;
  targetType: 'article' | 'exercise' | 'therapist' | 'live';
}

export function BookmarkButton({ targetId, targetType }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkBookmark();
  }, [targetId, targetType]);

  const checkBookmark = async () => {
    try {
      const response = await fetch(`/api/bookmarks?type=${targetType}`);
      if (response.ok) {
        const bookmarks = await response.json();
        const exists = bookmarks.some((b: any) => b.targetId === targetId);
        setIsBookmarked(exists);
      }
    } catch (error) {
      console.error('Error checking bookmark:', error);
    }
  };

  const toggleBookmark = async () => {
    setLoading(true);
    try {
      if (isBookmarked) {
        // حذف
        const response = await fetch('/api/bookmarks', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetId, targetType })
        });

        if (response.ok) {
          setIsBookmarked(false);
        }
      } else {
        // افزودن
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetId, targetType })
        });

        if (response.ok) {
          setIsBookmarked(true);
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        isBookmarked
          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200'
      }`}
      title={isBookmarked ? 'حذف از ذخیره‌ها' : 'ذخیره کردن'}
    >
      <span className="text-xl">{isBookmarked ? '❤️' : '🤍'}</span>
      <span className="text-sm">
        {isBookmarked ? 'ذخیره شده' : 'ذخیره'}
      </span>
    </button>
  );
}

export default BookmarkButton;
















