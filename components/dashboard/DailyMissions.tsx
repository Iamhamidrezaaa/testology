"use client";

import React, { useEffect, useState } from 'react';

interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  isCompleted: boolean;
  date: string;
}

export function DailyMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const response = await fetch('/api/missions/today');
      if (response.ok) {
        const data = await response.json();
        setMissions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeMission = async (missionId: string) => {
    try {
      const response = await fetch('/api/missions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId })
      });

      if (response.ok) {
        const result = await response.json();
        setMissions(missions.map(m =>
          m.id === missionId ? { ...m, isCompleted: true } : m
        ));
        // نمایش toast موفقیت
        alert(`✅ مأموریت تکمیل شد! +${result.xpEarned} XP`);
      }
    } catch (error) {
      console.error('Error completing mission:', error);
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

  const completedCount = missions.filter(m => m.isCompleted).length;
  const totalXP = missions.reduce((sum, m) => sum + (m.isCompleted ? m.xpReward : 0), 0);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 border border-purple-100 dark:border-gray-700">
      {/* هدر */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            مأموریت‌های امروز
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {completedCount} از {missions.length} تکمیل شده
          </p>
        </div>
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {totalXP}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">XP کسب شده</div>
        </div>
      </div>

      {/* نوار پیشرفت کلی */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / missions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* لیست مأموریت‌ها */}
      <div className="space-y-3">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className={`bg-white dark:bg-gray-800 rounded-lg p-4 border-2 transition-all ${
              mission.isCompleted
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* چک‌باکس */}
              <button
                onClick={() => !mission.isCompleted && completeMission(mission.id)}
                disabled={mission.isCompleted}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  mission.isCompleted
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-500'
                }`}
              >
                {mission.isCompleted && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* محتوا */}
              <div className="flex-1">
                <h3 className={`font-semibold mb-1 ${
                  mission.isCompleted
                    ? 'text-gray-500 dark:text-gray-400 line-through'
                    : 'text-gray-800 dark:text-white'
                }`}>
                  {mission.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {mission.description}
                </p>
              </div>

              {/* پاداش */}
              <div className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium ${
                mission.isCompleted
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
              }`}>
                +{mission.xpReward} XP
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* پیام تبریک */}
      {completedCount === missions.length && missions.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-4 text-white text-center">
          <div className="text-3xl mb-2">🎉</div>
          <div className="font-bold text-lg">عالی! همه مأموریت‌ها تکمیل شد!</div>
          <div className="text-sm opacity-90">فردا برای مأموریت‌های جدید برگردید</div>
        </div>
      )}
    </div>
  );
}

export default DailyMissions;
















