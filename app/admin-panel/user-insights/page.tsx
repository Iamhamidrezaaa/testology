'use client';

import { useState, useEffect } from 'react';
import { UserAnalyticsTable } from '@/components/admin/modules/UserInsights/UserAnalyticsTable';
import { UserAnalyticsGraph } from '@/components/admin/modules/UserInsights/UserAnalyticsGraph';
import { UserInsightModal } from '@/components/admin/modules/UserInsights/UserInsightModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserAnalytics {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  test: {
    id: string;
    title: string;
  } | null;
  durationSeconds: number;
  completed: boolean;
  visitedAt: string;
}

export default function UserInsightsPage() {
  const [analytics, setAnalytics] = useState<UserAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/user-insights');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/user-insights/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      setUserData(data);
      setSelectedUser(userId);
      setIsModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const filteredAnalytics = analytics.filter(insight => {
    const matchesSearch = 
      insight.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insight.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insight.test?.title.toLowerCase().includes(searchTerm.toLowerCase());

    if (dateRange === 'all') return matchesSearch;

    const insightDate = new Date(insight.visitedAt);
    const now = new Date();
    const daysAgo = (now.getTime() - insightDate.getTime()) / (1000 * 60 * 60 * 24);

    switch (dateRange) {
      case 'today':
        return matchesSearch && daysAgo < 1;
      case 'week':
        return matchesSearch && daysAgo < 7;
      case 'month':
        return matchesSearch && daysAgo < 30;
      default:
        return matchesSearch;
    }
  });

  if (loading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا: {error}</div>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">تحلیل رفتار کاربران</h1>
        <div className="flex gap-4">
          <Input
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="بازه زمانی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="today">امروز</SelectItem>
              <SelectItem value="week">هفته</SelectItem>
              <SelectItem value="month">ماه</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalytics}>بروزرسانی</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="col-span-2">
          <UserAnalyticsGraph
            data={filteredAnalytics}
            type="line"
            title="روند کلی فعالیت کاربران"
          />
        </div>
        <div className="col-span-2">
          <UserAnalyticsTable
            data={filteredAnalytics}
            onUserClick={handleUserClick}
          />
        </div>
      </div>

      {selectedUser && userData && (
        <UserInsightModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userData={userData}
        />
      )}
    </div>
  );
} 