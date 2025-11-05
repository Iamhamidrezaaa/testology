"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface LiveSession {
  id: string;
  title: string;
  description: string;
  startTime: string;
  category: string;
  participantsCount: number;
  host: {
    name: string | null;
    image: string | null;
  };
}

export function LiveSessionsPreview() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [featureEnabled, setFeatureEnabled] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/live/sessions?upcoming=true&limit=3');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
        // فقط اگر جلسات واقعی وجود داشته باشد، کامپوننت را نمایش دهیم
        if (data && data.length > 0) {
          setFeatureEnabled(true);
        }
      } else {
        console.warn('Live sessions API not available yet');
      }
    } catch (error) {
      console.error('Error fetching live sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // اگر loading است یا feature فعال نیست، چیزی نمایش ندهیم
  if (loading || !featureEnabled) {
    return null;
  }

  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className="py-16 bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            🔴 جلسات لایو آینده
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            شرکت در جلسات آنلاین رایگان
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-white text-red-500 px-2 py-1 rounded text-xs font-bold">
                    LIVE
                  </span>
                  <span className="text-sm">{session.category}</span>
                </div>
                <h3 className="font-bold text-lg">{session.title}</h3>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {session.description}
                </p>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                    {session.host.name ? session.host.name.charAt(0) : '👨‍⚕️'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-white">
                      {session.host.name || 'نامشخص'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(session.startTime).toLocaleDateString('fa-IR')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    👥 {session.participantsCount} نفر
                  </span>
                  <Link
                    href={`/live/${session.id}`}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    ثبت‌نام
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/live"
            className="inline-block px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            مشاهده همه جلسات لایو
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LiveSessionsPreview;