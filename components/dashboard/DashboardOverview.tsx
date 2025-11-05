'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function DashboardOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [progressRes, gamificationRes] = await Promise.all([
        fetch('/api/xp/progress'),
        fetch('/api/gamification/stats')
      ]);

      if (progressRes.ok && gamificationRes.ok) {
        const progress = await progressRes.json();
        const gamification = await gamificationRes.json();
        
        setStats({ progress, gamification });
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
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {session?.user?.name || 'User'}! 👋
        </h1>
        <p className="opacity-90">
          Ready to continue your mental health journey?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {stats?.progress?.level || 1}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Current Level</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="text-3xl mb-2">💎</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats?.progress?.xp || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total XP</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats?.progress?.totalTests || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Tests Completed</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {stats?.progress?.streakDays || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/tests"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-purple-500"
        >
          <div className="text-4xl mb-3">🧠</div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Take a Test</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Complete a psychology test and earn XP
          </p>
        </Link>

        <Link
          href="/mood"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-purple-500"
        >
          <div className="text-4xl mb-3">📅</div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Log Mood</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track your daily emotions (+20 XP)
          </p>
        </Link>

        <Link
          href="/dashboard/missions"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-purple-500"
        >
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Daily Missions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Complete missions and earn rewards
          </p>
        </Link>
      </div>
    </div>
  );
}
















