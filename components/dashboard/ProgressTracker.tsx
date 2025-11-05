"use client";

import React, { useEffect, useState } from 'react';
import { achievementDetails } from '@/lib/services/leveling';

interface ProgressData {
  xp: number;
  level: number;
  progress: number;
  nextLevelXP: number;
  totalTests: number;
  streakDays: number;
  achievements: string[] | any;
  lastActivity: string;
}

export function ProgressTracker() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/xp/progress');
      if (response.ok) {
        const progressData = await response.json();
        setData(progressData);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
        <p className="text-red-500">خطا در بارگذاری اطلاعات پیشرفت</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-2xl border border-blue-100 dark:border-gray-700">
      {/* هدر */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span className="text-3xl">🏁</span>
          مسیر پیشرفت شما
        </h2>
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-gray-400">سطح فعلی</div>
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {data.level}
          </div>
        </div>
      </div>

      {/* نوار پیشرفت */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            پیشرفت تا سطح بعد
          </span>
          <span className="text-sm font-bold text-gray-800 dark:text-white">
            {data.xp} / {data.nextLevelXP} XP
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-center"
            style={{ width: `${data.progress}%` }}
          >
            {data.progress > 10 && (
              <span className="text-xs font-bold text-white">
                {Math.round(data.progress)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* آمار */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md text-center border border-gray-100 dark:border-gray-700">
          <div className="text-3xl mb-1">📊</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">{data.totalTests}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">تست انجام شده</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md text-center border border-gray-100 dark:border-gray-700">
          <div className="text-3xl mb-1">🔥</div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{data.streakDays}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">روز تداوم</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md text-center border border-gray-100 dark:border-gray-700">
          <div className="text-3xl mb-1">🏆</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Array.isArray(data.achievements) ? data.achievements.length : 0}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">دستاورد</div>
        </div>
      </div>

      {/* دستاوردها */}
      {Array.isArray(data.achievements) && data.achievements.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
            <span>🎖️</span>
            آخرین دستاوردها
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.achievements.slice(-6).reverse().map((achievement: string) => {
              const details = achievementDetails[achievement];
              if (!details) return null;
              
              return (
                <div
                  key={achievement}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                  title={details.description}
                >
                  <div className="text-2xl mb-1 text-center">{details.icon}</div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center truncate">
                    {details.name}
                  </div>
                </div>
              );
            })}
          </div>
          {data.achievements.length > 6 && (
            <button className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline">
              مشاهده همه ({data.achievements.length} دستاورد)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProgressTracker;

