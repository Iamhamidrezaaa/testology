"use client";

import React from 'react';
import Link from 'next/link';

interface TestCardProps {
  test: {
    slug: string;
    name: string;
    score: number;
    completedAt: string;
  };
}

export default function TestCard({ test }: TestCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border">
      <h4 className="font-semibold text-lg mb-2">{test.name}</h4>
      <p className="text-gray-600 mb-2">نمره: {test.score}/100</p>
      <p className="text-sm text-gray-500 mb-3">
        تکمیل شده: {new Date(test.completedAt).toLocaleDateString('fa-IR')}
      </p>
      <Link 
        href={`/tests/${test.slug}`}
        className="text-blue-600 hover:text-blue-800 text-sm"
      >
        مشاهده جزئیات →
      </Link>
    </div>
  );
}
















