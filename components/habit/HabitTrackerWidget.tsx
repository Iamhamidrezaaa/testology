"use client";

import React, { useEffect, useState } from 'react';

interface Habit {
  id: string;
  habit: string;
  goalDays: number;
  currentStreak: number;
  longestStreak: number;
  progressPercentage: number;
  daysRemaining: number;
  isCompleted: boolean;
  checkedToday: boolean;
}

export function HabitTrackerWidget() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habit/list');
      if (response.ok) {
        const data = await response.json();
        setHabits(data);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkHabit = async (habitId: string) => {
    try {
      const response = await fetch('/api/habit/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ ثبت شد! Streak: ${result.currentStreak} روز`);
        fetchHabits();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Error checking habit:', error);
    }
  };

  if (loading) {
    return <div className="animate-pulse">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-4">
      {habits.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-gray-500 dark:text-gray-400">هنوز عادتی ثبت نکرده‌اید</p>
        </div>
      ) : (
        habits.map((habit) => (
          <div
            key={habit.id}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 ${
              habit.isCompleted
                ? 'border-green-500'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {habit.habit}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {habit.currentStreak} / {habit.goalDays} روز
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  🔥 {habit.currentStreak}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Streak</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all"
                  style={{ width: `${habit.progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                <span>{habit.progressPercentage}%</span>
                <span>{habit.daysRemaining} روز باقیمانده</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                بهترین: {habit.longestStreak} روز
              </div>
              {!habit.isCompleted && (
                <button
                  onClick={() => checkHabit(habit.id)}
                  disabled={habit.checkedToday}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    habit.checkedToday
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {habit.checkedToday ? '✓ ثبت شد' : 'ثبت امروز'}
                </button>
              )}
              {habit.isCompleted && (
                <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-4 py-2 rounded-lg text-sm font-medium">
                  🎉 تکمیل شد!
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default HabitTrackerWidget;
















