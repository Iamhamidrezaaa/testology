"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Room {
  id: string;
  title: string;
  category: string;
  description: string | null;
  messageCount: number;
  lastMessage: any;
}

export default function CommunityPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/community/rooms');
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 text-center">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-3">
          <span>💬</span>
          اتاق‌های گفت‌وگو
        </h1>

        {rooms.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-500">هنوز اتاقی وجود ندارد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <Link
                key={room.id}
                href={`/community/${room.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {room.title}
                  </h3>
                  <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-medium">
                    {room.category}
                  </span>
                </div>

                {room.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {room.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>💬 {room.messageCount} پیام</span>
                  {room.lastMessage && (
                    <span className="text-xs">
                      آخرین پیام: {new Date(room.lastMessage.createdAt).toLocaleDateString('fa-IR')}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
















