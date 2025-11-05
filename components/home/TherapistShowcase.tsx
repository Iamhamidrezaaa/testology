"use client";

import React from 'react';
import Link from 'next/link';
import { therapists } from '@/data/therapists';

export function TherapistShowcase() {
  // انتخاب ۴ درمانگر برتر (آنلاین‌ها اولویت دارند)
  const topTherapists = therapists
    .sort((a, b) => {
      // آنلاین‌ها اول
      if (a.status === "آنلاین" && b.status !== "آنلاین") return -1;
      if (a.status !== "آنلاین" && b.status === "آنلاین") return 1;
      return 0;
    })
    .slice(0, 4);

  return (
    <div className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            درمانگران برتر Testology
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            مشاوره با متخصصان روان‌شناسی
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topTherapists.map((therapist) => (
            <div
              key={therapist.id}
              className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 text-center border border-gray-200 dark:border-gray-700"
            >
              <div className="relative inline-block mb-4">
                <img
                  src={therapist.image}
                  alt={therapist.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                />
                {therapist.status === "آنلاین" && (
                  <div className="absolute bottom-0 right-0 bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
                    ●
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                {therapist.name}
              </h3>

              <p className="text-sm text-purple-600 dark:text-purple-400 mb-3">
                {therapist.specialty}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {therapist.experience}
              </p>

              <div className="flex items-center justify-center gap-1 mb-4">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  therapist.status === "آنلاین"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {therapist.status}
                </span>
              </div>

              <Link
                href={`/therapists/${therapist.slug}`}
                className="block w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                مشاهده پروفایل
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 mb-0">
          <Link
            href="/therapists"
            className="inline-block px-8 py-3 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            مشاهده همه درمانگران
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TherapistShowcase;