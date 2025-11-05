'use client';

import { BookmarkButton } from '@/components/shared/BookmarkButton';
import Link from 'next/link';

interface TherapistProfileProps {
  profile: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    specialty: string | null;
    therapistProfile: {
      bio: string | null;
      specialties: string;
      location: string | null;
      rating: number;
      sessionsCount: number;
      verified: boolean;
    } | null;
  };
}

export default function TherapistProfileCard({ profile }: TherapistProfileProps) {
  const specialties = profile.therapistProfile?.specialties 
    ? JSON.parse(profile.therapistProfile.specialties) 
    : [];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-purple-600 text-4xl font-bold">
                {profile.name ? profile.name.charAt(0).toUpperCase() : '👨‍⚕️'}
              </div>
              {profile.therapistProfile?.verified && (
                <div className="absolute bottom-0 right-0 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  ✓
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{profile.name || 'Therapist'}</h1>
              <p className="text-lg opacity-90">{profile.specialty || 'Psychologist'}</p>
              {profile.therapistProfile?.location && (
                <p className="text-sm opacity-75 mt-1">
                  📍 {profile.therapistProfile.location}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="text-center">
              <div className="text-3xl font-bold">{profile.therapistProfile?.rating.toFixed(1) || '0.0'}</div>
              <div className="text-sm opacity-75">Rating</div>
              <div className="flex items-center justify-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= (profile.therapistProfile?.rating || 0) ? 'text-yellow-300' : 'text-gray-400'}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {/* Bio */}
          {profile.therapistProfile?.bio && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">About</h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {profile.therapistProfile.bio}
              </p>
            </div>
          )}

          {/* Specialties */}
          {specialties.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty: string, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-sm font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {profile.therapistProfile?.sessionsCount || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sessions Completed</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {profile.therapistProfile?.verified ? 'Verified' : 'Pending'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href={`/therapist/${profile.id}/book`}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium text-center transition-all shadow-md"
            >
              Book Session
            </Link>
            <BookmarkButton targetId={profile.id} targetType="therapist" />
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3">ℹ️ Professional Information</h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>✓ Licensed psychologist</li>
          <li>✓ Verified by Testology</li>
          <li>✓ Available for online sessions</li>
          <li>✓ Response time: Usually within 24 hours</li>
        </ul>
      </div>
    </div>
  );
}
















