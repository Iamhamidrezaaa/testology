"use client";

import React, { useEffect, useState } from 'react';

interface GamificationStats {
  xp: number;
  level: number;
  medals: number;
  challengesCompleted: number;
  streakDays: number;
  progressPercentage: number;
  nextLevelXP: number;
  xpInCurrentLevel: number;
  rank: number;
  totalUsers: number;
}

export function GamificationPanel() {
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/gamification/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching gamification stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div>خطا در بارگذاری</div>;
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 border border-purple-200 dark:border-gray-700">
      {/* هدر */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span className="text-3xl">🏆</span>
          آمار گیمیفیکیشن
        </h2>
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md">
          <div className="text-xs text-gray-600 dark:text-gray-400">رتبه شما</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            #{stats.rank}
          </div>
        </div>
      </div>

      {/* سطح و XP */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-3xl font-bold text-gray-800 dark:text-white">
              سطح {stats.level}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
              ({stats.xp} XP)
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {stats.xpInCurrentLevel} / {stats.nextLevelXP - (stats.level - 1) * 1000}
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-4 rounded-full transition-all duration-500 flex items-center justify-center"
            style={{ width: `${stats.progressPercentage}%` }}
          >
            {stats.progressPercentage > 10 && (
              <span className="text-xs font-bold text-white">
                {Math.round(stats.progressPercentage)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* آمار */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
          <div className="text-3xl mb-2">🥇</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.medals}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">مدال</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.challengesCompleted}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">چالش</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.streakDays}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">روز تداوم</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalUsers}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">کاربر</div>
        </div>
      </div>

      {/* راهنما */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          <span>💡</span>
          راه‌های کسب XP
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>• انجام تست‌ها: تا 100 XP</li>
          <li>• تکمیل مأموریت‌ها: 30-100 XP</li>
          <li>• ثبت احساس روزانه: 20 XP</li>
          <li>• تکمیل تمرین‌ها: 50 XP</li>
          <li>• تکمیل چالش‌ها: 200+ XP</li>
        </ul>
      </div>
    </div>
  );
}

export default GamificationPanel;
















