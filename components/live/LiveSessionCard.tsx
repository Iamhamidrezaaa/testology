'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface LiveSessionProps {
  session: {
    id: string;
    title: string;
    slug: string;
    description: string;
    startTime: string;
    category: string;
    maxParticipants: number | null;
    participantsCount: number;
    host: {
      name: string | null;
      image: string | null;
      specialty: string | null;
    };
    registrations: any[];
  };
}

export default function LiveSessionCard({ session }: LiveSessionProps) {
  const { data: sessionData } = useSession();
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(
    session.registrations?.some(r => r.userId === sessionData?.user?.id)
  );

  const register = async () => {
    if (!sessionData) {
      alert('Please login first');
      return;
    }

    setRegistering(true);
    try {
      const response = await fetch(`/api/live/sessions/${session.id}/register`, {
        method: 'POST'
      });

      if (response.ok) {
        setIsRegistered(true);
        alert('✅ Successfully registered!');
      } else {
        const error = await response.json();
        alert(error.error || 'Error registering');
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Error registering');
    } finally {
      setRegistering(false);
    }
  };

  const isFull = session.maxParticipants && session.participantsCount >= session.maxParticipants;
  const startDate = new Date(session.startTime);
  const isUpcoming = startDate > new Date();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-white text-red-500 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
            🔴 LIVE
          </span>
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
            {session.category}
          </span>
        </div>
        <h2 className="text-2xl font-bold">{session.title}</h2>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {session.description}
        </p>

        {/* Host */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
            {session.host.name ? session.host.name.charAt(0) : '👨‍⚕️'}
          </div>
          <div>
            <div className="font-semibold text-gray-800 dark:text-white">
              {session.host.name || 'Anonymous'}
            </div>
            <div className="text-sm text-gray-500">
              {session.host.specialty || 'Psychologist'}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">📅</span>
            <span className="text-gray-800 dark:text-white">
              {startDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">🕐</span>
            <span className="text-gray-800 dark:text-white">
              {startDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">👥</span>
            <span className="text-gray-800 dark:text-white">
              {session.participantsCount} registered
              {session.maxParticipants && ` / ${session.maxParticipants} max`}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {isRegistered ? (
          <div className="space-y-3">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
              <span className="text-green-700 dark:text-green-400 font-medium">
                ✅ You are registered
              </span>
            </div>
            {isUpcoming && (
              <Link
                href={`/live/${session.slug}/join`}
                className="block w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-center transition-colors"
              >
                🔴 Join Live Session
              </Link>
            )}
          </div>
        ) : isFull ? (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Session is full
            </span>
          </div>
        ) : (
          <button
            onClick={register}
            disabled={registering}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-bold transition-all shadow-md"
          >
            {registering ? 'Registering...' : 'Register for Session'}
          </button>
        )}
      </div>
    </div>
  );
}
















