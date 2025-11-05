'use client';

import { useEffect, useState } from 'react';

export default function DashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [habitsRes, missionsRes, moodRes] = await Promise.all([
        fetch('/api/habit/stats'),
        fetch('/api/missions/today'),
        fetch('/api/mood/history?limit=7')
      ]);

      if (habitsRes.ok && missionsRes.ok && moodRes.ok) {
        const habits = await habitsRes.json();
        const missions = await missionsRes.json();
        const mood = await moodRes.json();
        
        setStats({ habits, missions, mood });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        ))}
      </div>
    );
  }

  const completedMissions = Array.isArray(stats?.missions) 
    ? stats.missions.filter((m: any) => m.isCompleted).length 
    : 0;
  const totalMissions = Array.isArray(stats?.missions) ? stats.missions.length : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Habits */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Habit Tracking</h3>
          <span className="text-3xl">🎯</span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Active Habits:</span>
            <span className="font-bold text-gray-800 dark:text-white">
              {stats?.habits?.activeHabits || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Longest Streak:</span>
            <span className="font-bold text-orange-600 dark:text-orange-400">
              {stats?.habits?.longestStreak || 0} days
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
            <span className="font-bold text-green-600 dark:text-green-400">
              {stats?.habits?.successRate || 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Missions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Today's Missions</h3>
          <span className="text-3xl">✅</span>
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{completedMissions} / {totalMissions}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 transition-all"
              style={{ width: `${totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Complete all missions to earn bonus XP!
        </p>
      </div>

      {/* Mood */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Recent Moods</h3>
          <span className="text-3xl">😊</span>
        </div>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {stats?.mood?.history?.slice(0, 7).map((entry: any, i: number) => (
            <div
              key={i}
              className="text-3xl"
              title={new Date(entry.date).toLocaleDateString()}
            >
              {entry.mood === 'خیلی خوب' || entry.mood === 'very_good' ? '😄' :
               entry.mood === 'خوب' || entry.mood === 'good' ? '🙂' :
               entry.mood === 'معمولی' || entry.mood === 'normal' ? '😐' :
               entry.mood === 'بد' || entry.mood === 'bad' ? '😟' : '😢'}
            </div>
          )) || <span className="text-gray-400 text-sm">No mood entries yet</span>}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
          Last 7 days
        </p>
      </div>
    </div>
  );
}
















