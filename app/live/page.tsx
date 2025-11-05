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
  };
}

export default function LivePage() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/live/sessions?upcoming=true');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 text-center">در حال بارگذاری...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-3">
          <span>🔴</span>
          جلسات لایو روان‌شناسی
        </h1>

        {sessions.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-500">جلسه لایوی در آینده نزدیک وجود ندارد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
              >
                <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 text-white">
                  <span className="bg-white text-red-500 px-2 py-1 rounded text-xs font-bold">
                    LIVE
                  </span>
                  <h3 className="font-bold text-lg mt-2">{session.title}</h3>
                </div>

                <div className="p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {session.description}
                  </p>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{new Date(session.startTime).toLocaleDateString('fa-IR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👥</span>
                      <span>{session.participantsCount} نفر ثبت‌نام کرده‌اند</span>
                    </div>
                  </div>

                  <Link
                    href={`/live/${session.id}`}
                    className="block w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-center transition-colors"
                  >
                    ثبت‌نام
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
















