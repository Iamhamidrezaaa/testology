"use client";

import React, { useEffect, useState } from 'react';

interface Exercise {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch('/api/exercises/my');
      if (response.ok) {
        const data = await response.json();
        setExercises(data);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeExercise = async (exerciseId: string) => {
    try {
      const response = await fetch('/api/exercises/my', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ تمرین تکمیل شد! +${result.xpEarned} XP`);
        fetchExercises();
      }
    } catch (error) {
      console.error('Error completing exercise:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const pendingCount = exercises.filter(e => !e.completed).length;
  const completedCount = exercises.filter(e => e.completed).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
            <span>📝</span>
            تمرین‌های من
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            تمرین‌های ارسال شده توسط درمانگر شما
          </p>
        </div>

        {/* آمار */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{pendingCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">در انتظار</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{completedCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">تکمیل شده</div>
          </div>
        </div>

        {/* لیست تمرین‌ها */}
        {exercises.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              هنوز تمرینی ندارید
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              درمانگر شما به زودی تمرین‌های شخصی‌سازی شده برای شما ارسال خواهد کرد
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 transition-all ${
                  exercise.completed
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-1 ${
                      exercise.completed
                        ? 'text-gray-500 dark:text-gray-400 line-through'
                        : 'text-gray-800 dark:text-white'
                    }`}>
                      {exercise.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(exercise.createdAt).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                  {exercise.completed ? (
                    <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium">
                      ✓ تکمیل شده
                    </span>
                  ) : (
                    <button
                      onClick={() => completeExercise(exercise.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      تکمیل (+50 XP)
                    </button>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {exercise.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
















