'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import RiskPatternList from '@/components/admin/RiskPatternList'
import UserRiskMatchList from '@/components/admin/UserRiskMatchList'

interface RiskPattern {
  id: string;
  name: string;
  keywords: string[];
  severity: string;
  message: string;
  createdAt: string;
  _count: {
    matches: number;
  };
}

export default function RiskPatternsPage() {
  const [patterns, setPatterns] = useState<RiskPattern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/risk-patterns')
      .then(res => res.json())
      .then(data => {
        setPatterns(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">📌 الگوهای خطر روانی</h1>
        <RiskPatternList />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">🚨 هشدارهای کاربران</h2>
        <UserRiskMatchList />
      </div>
    </div>
  );
} 