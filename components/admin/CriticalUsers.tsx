"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";

type CriticalUser = {
  id: string;
  name: string;
  email: string;
  testName: string;
  score: number;
  category: string;
  interpretation: string;
  createdAt: string;
  hasGrowthPath: boolean;
};

export default function CriticalUsers() {
  const [users, setUsers] = useState<CriticalUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCriticalUsers = async () => {
      try {
        const res = await axios.get<{ data: CriticalUser[] }>(
          "/api/admin/critical-users"
        );
        setUsers(res.data.data);
      } catch (err) {
        console.error("Error fetching critical users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCriticalUsers();
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-gray-500 text-center">هیچ کاربر بحرانی وجود ندارد</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-bold mb-4">کاربران بحرانی اخیر</h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border-l-4 border-red-500 bg-red-50 p-4 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-red-800">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <span className="text-xs text-gray-500">
                {format(new Date(user.createdAt), "PPP", { locale: faIR })}
              </span>
            </div>
            <div className="mt-2">
              <p className="text-sm text-red-700">
                تست: {user.testName} - امتیاز: {user.score}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {user.interpretation}
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <a
                href={`/admin/users/${user.id}`}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                مشاهده پروفایل
              </a>
              {user.hasGrowthPath && (
                <a
                  href={`/admin/users/${user.id}/growth-path`}
                  className="text-sm text-green-600 hover:text-green-800"
                >
                  مشاهده مسیر رشد
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 