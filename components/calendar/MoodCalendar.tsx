"use client";

import React, { useEffect, useState } from 'react';

interface MoodEntry {
  date: string;
  mood: string;
  note?: string | null;
}

const MOODS = {
  'خیلی خوب': { emoji: '😄', color: 'bg-green-500' },
  'خوب': { emoji: '🙂', color: 'bg-blue-500' },
  'معمولی': { emoji: '😐', color: 'bg-yellow-500' },
  'بد': { emoji: '😟', color: 'bg-orange-500' },
  'خیلی بد': { emoji: '😢', color: 'bg-red-500' }
};

export function MoodCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [moodData, setMoodData] = useState<Record<string, MoodEntry>>({});
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [note, setNote] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoodData();
  }, [currentMonth]);

  const fetchMoodData = async () => {
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const response = await fetch(`/api/mood/calendar?year=${year}&month=${month}`);
      
      if (response.ok) {
        const data = await response.json();
        const moodMap: Record<string, MoodEntry> = {};
        data.forEach((entry: MoodEntry) => {
          moodMap[entry.date] = entry;
        });
        setMoodData(moodMap);
      }
    } catch (error) {
      console.error('Error fetching mood data:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitMood = async () => {
    if (!selectedMood) return;

    try {
      const response = await fetch('/api/mood/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood, note })
      });

      if (response.ok) {
        alert('✅ احساس شما ثبت شد! +20 XP');
        setShowModal(false);
        setSelectedMood('');
        setNote('');
        fetchMoodData();
      }
    } catch (error) {
      console.error('Error submitting mood:', error);
    }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // روزهای ماه قبل
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // روزهای ماه جاری
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const days = getDaysInMonth();
  const monthName = currentMonth.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long' });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* هدر */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span className="text-3xl">📅</span>
          تقویم احساسات
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all shadow-md"
        >
          + ثبت احساس امروز
        </button>
      </div>

      {/* ناوبری ماه */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => changeMonth(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{monthName}</h3>
        <button
          onClick={() => changeMonth(1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* روزهای هفته */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* تقویم */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dateStr = formatDate(day.date);
          const moodEntry = moodData[dateStr];
          const isToday = dateStr === formatDate(new Date());

          return (
            <div
              key={index}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center p-2 transition-all ${
                day.isCurrentMonth
                  ? 'bg-gray-50 dark:bg-gray-700'
                  : 'bg-gray-100 dark:bg-gray-800 opacity-50'
              } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
              title={moodEntry?.note || ''}
            >
              <div className={`text-sm ${
                day.isCurrentMonth
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-gray-400 dark:text-gray-600'
              }`}>
                {day.date.getDate()}
              </div>
              {moodEntry && (
                <div className="text-2xl mt-1">
                  {MOODS[moodEntry.mood as keyof typeof MOODS]?.emoji || '😐'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* راهنما */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {Object.entries(MOODS).map(([mood, { emoji, color }]) => (
          <div key={mood} className="flex items-center gap-2">
            <span className="text-2xl">{emoji}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{mood}</span>
          </div>
        ))}
      </div>

      {/* مودال ثبت احساس */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              امروز چطور احساس می‌کنید؟
            </h3>

            {/* انتخاب mood */}
            <div className="grid grid-cols-5 gap-3 mb-4">
              {Object.entries(MOODS).map(([mood, { emoji }]) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`p-3 rounded-lg text-3xl transition-all ${
                    selectedMood === mood
                      ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500 scale-110'
                      : 'bg-gray-100 dark:bg-gray-700 hover:scale-105'
                  }`}
                  title={mood}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* یادداشت */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                یادداشت (اختیاری)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={3}
                placeholder="چه اتفاقی افتاد؟ چرا این‌طور احساس می‌کنید؟"
              />
            </div>

            {/* دکمه‌ها */}
            <div className="flex gap-3">
              <button
                onClick={submitMood}
                disabled={!selectedMood}
                className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                ثبت (+20 XP)
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedMood('');
                  setNote('');
                }}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-lg transition-colors"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoodCalendar;
















