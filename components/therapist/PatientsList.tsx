"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Patient {
  id: string;
  patientId: string;
  status: string;
  notes?: string;
  startDate: string;
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    image: string | null;
  };
  recentTests?: Array<{
    id: string;
    testName: string | null;
    score: number | null;
    severity: string | null;
    createdAt: string;
  }>;
  progress?: {
    xp: number;
    level: number;
    totalTests: number;
    streakDays: number;
  } | null;
}

export function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/therapist/patients');
      if (response.ok) {
        const data = await response.json();
        setPatients(data.patients || []);
      } else {
        const error = await response.json();
        setError(error.error || 'خطا در دریافت اطلاعات بیماران');
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('خطا در برقراری ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="text-6xl mb-4">🏥</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            هنوز بیماری ندارید
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            برای شروع، بیماران جدید را اضافه کنید
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span>👥</span>
          بیماران من ({patients.length})
        </h2>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          + افزودن بیمار
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <Link
            key={patient.id}
            href={`/therapist/patients/${patient.patientId}`}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500"
          >
            {/* آواتار */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                {patient.user?.name ? patient.user.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {patient.user?.name || 'نام نامشخص'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {patient.user?.email || 'ایمیل نامشخص'}
                </p>
              </div>
            </div>

            {/* وضعیت */}
            <div className="mb-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  patient.status === 'active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {patient.status === 'active' ? 'فعال' : patient.status}
              </span>
            </div>

            {/* آمار پیشرفت */}
            {patient.progress && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {patient.progress.level}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">سطح</div>
                </div>
                <div className="text-center bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2">
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {patient.progress.totalTests}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">تست</div>
                </div>
                <div className="text-center bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2">
                  <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    {patient.progress.streakDays}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">روز</div>
                </div>
              </div>
            )}

            {/* آخرین تست‌ها */}
            {patient.recentTests && patient.recentTests.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">آخرین تست:</p>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {patient.recentTests[0].testName || patient.recentTests[0].id}
                  {patient.recentTests[0].severity && (
                    <span
                      className={`mr-2 text-xs ${
                        patient.recentTests[0].severity === 'شدید' ||
                        patient.recentTests[0].severity === 'severe'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-yellow-600 dark:text-yellow-400'
                      }`}
                    >
                      ({patient.recentTests[0].severity})
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* یادداشت */}
            {patient.notes && (
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic truncate">
                💭 {patient.notes}
              </div>
            )}

            {/* تاریخ شروع */}
            <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
              شروع: {new Date(patient.startDate).toLocaleDateString('fa-IR')}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PatientsList;
















