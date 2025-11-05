'use client';

import React, { useState, useEffect } from 'react';

interface Analytics {
  views: number;
  likes: number;
}

interface AnalyticsSectionProps {
  blogId: string;
}

export default function AnalyticsSection({ blogId }: AnalyticsSectionProps) {
  const [analytics, setAnalytics] = useState<Analytics>({ views: 0, likes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    recordView();
  }, [blogId]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/blog/analytics?blogId=${blogId}`);
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('خطا در دریافت آمار:', error);
    } finally {
      setLoading(false);
    }
  };

  const recordView = async () => {
    try {
      await fetch('/api/blog/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogId,
          action: 'view'
        })
      });
    } catch (error) {
      console.error('خطا در ثبت بازدید:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch('/api/blog/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogId,
          action: 'like'
        })
      });

      if (response.ok) {
        setAnalytics(prev => ({
          ...prev,
          likes: prev.likes + 1
        }));
      }
    } catch (error) {
      console.error('خطا در ثبت لایک:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="text-gray-600">در حال بارگذاری آمار...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 space-x-reverse">
          <div className="flex items-center space-x-2 space-x-reverse">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-gray-700 font-medium">{analytics.views} بازدید</span>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={handleLike}
              className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-red-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-medium">{analytics.likes} لایک</span>
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          آخرین بروزرسانی: {new Date().toLocaleDateString('fa-IR')}
        </div>
      </div>
    </div>
  );
}
















