import dynamic from 'next/dynamic';
import React from 'react';

// Lazy load heavy components
export const LazyPsychologistChat = dynamic(() => import('@/components/PsychologistChat'), {
  loading: () => React.createElement('div', { className: 'animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded' }),
  ssr: false
});

export const LazyMoodTrackerCard = dynamic(() => import('@/components/MoodTrackerCard'), {
  loading: () => React.createElement('div', { className: 'animate-pulse h-48 bg-gray-200 dark:bg-gray-700 rounded' }),
  ssr: false
});

export const LazyCombinedProfileCard = dynamic(() => import('@/components/CombinedProfileCard'), {
  loading: () => React.createElement('div', { className: 'animate-pulse h-48 bg-gray-200 dark:bg-gray-700 rounded' }),
  ssr: false
});

export const LazyBehavioralInsights = dynamic(() => import('@/components/BehavioralInsights'), {
  loading: () => React.createElement('div', { className: 'animate-pulse h-48 bg-gray-200 dark:bg-gray-700 rounded' }),
  ssr: false
});

// Lazy load admin components
export const LazyAdminCharts = dynamic(() => import('@/components/admin/Charts'), {
  loading: () => React.createElement('div', { className: 'animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded' }),
  ssr: false
});

// Lazy load heavy icons
export const LazyLucideIcons = dynamic(() => import('lucide-react'), {
  loading: () => React.createElement('div', { className: 'w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded' }),
  ssr: false
});

