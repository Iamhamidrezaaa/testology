"use client";

import React, { useEffect, useState } from 'react';

interface TherapyGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isMember: boolean;
  role: string | null;
}

export function GroupTherapyList() {
  const [groups, setGroups] = useState<TherapyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/groups/list');
      if (response.ok) {
        const data = await response.json();
        setGroups(data);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId: string) => {
    try {
      const response = await fetch('/api/groups/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId })
      });

      if (response.ok) {
        alert('✅ با موفقیت به گروه پیوستید');
        fetchGroups();
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const startLive = async (groupId: string) => {
    try {
      const response = await fetch('/api/groups/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId })
      });

      if (response.ok) {
        const { liveUrl } = await response.json();
        window.open(liveUrl, '_blank');
      }
    } catch (error) {
      console.error('Error starting live:', error);
    }
  };

  if (loading) {
    return <div className="animate-pulse">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div
          key={group.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {group.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {group.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  👥 {group.memberCount} عضو
                </span>
                {group.isMember && (
                  <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                    ✓ عضو
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {group.isMember ? (
                <button
                  onClick={() => startLive(group.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  🔴 لایو
                </button>
              ) : (
                <button
                  onClick={() => joinGroup(group.id)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  پیوستن
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GroupTherapyList;
















