'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/admin/ui/DateRangePicker';
import { format } from 'date-fns-jalali';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { DateRange } from 'react-day-picker';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface StatsData {
  users: {
    usersPerDay: Array<{ date: string; count: number }>;
    totalNewUsers: number;
    usersByGender: Array<{ gender: string; _count: number }>;
    usersByAge: Array<{ ageGroup: string; _count: number }>;
  } | null;
  categories: {
    categoryStats: Array<{ category: string; _count: { category: number } }>;
    totalTests: number;
    categoryScores: Array<{ category: string; _avg: { score: number } }>;
  } | null;
  answers: {
    scoresOverTime: Array<{ createdAt: string; _avg: { score: number } }>;
    scoresByTestType: Array<{ testType: string; _avg: { score: number } }>;
    scoreDistribution: Array<{ score: number; _count: number }>;
  } | null;
}

export default function StatsPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData>({
    users: null,
    categories: null,
    answers: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!dateRange.from || !dateRange.to) return;

        const [usersRes, categoriesRes, answersRes] = await Promise.all([
          fetch(`/api/admin/stats/users?startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`),
          fetch(`/api/admin/stats/categories?startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`),
          fetch(`/api/admin/stats/answers?startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`)
        ]);

        if (!usersRes.ok || !categoriesRes.ok || !answersRes.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const [usersData, categoriesData, answersData] = await Promise.all([
          usersRes.json(),
          categoriesRes.json(),
          answersRes.json()
        ]);

        setStats({
          users: usersData,
          categories: categoriesData,
          answers: answersData
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">آمار و تحلیل</h1>
        <DateRangePicker
          date={dateRange}
          onDateChange={(date) => setDateRange(date || { from: undefined, to: undefined })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* کاربران جدید */}
        <Card>
          <CardHeader>
            <CardTitle>کاربران جدید</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.users && (
              <Chart
                type="line"
                height={300}
                series={[{
                  name: 'تعداد کاربران',
                  data: stats.users.usersPerDay.map(u => u.count)
                }]}
                options={{
                  chart: {
                    toolbar: { show: false },
                    fontFamily: 'Vazirmatn'
                  },
                  xaxis: {
                    categories: stats.users.usersPerDay.map(u => 
                      format(new Date(u.date), 'yyyy/MM/dd')
                    ),
                    labels: {
                      style: { fontFamily: 'Vazirmatn' }
                    }
                  },
                  yaxis: {
                    labels: {
                      style: { fontFamily: 'Vazirmatn' }
                    }
                  },
                  tooltip: {
                    theme: 'light',
                    x: {
                      format: 'yyyy/MM/dd'
                    }
                  }
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* دسته‌بندی‌های محبوب */}
        <Card>
          <CardHeader>
            <CardTitle>دسته‌بندی‌های محبوب</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.categories && (
              <Chart
                type="bar"
                height={300}
                series={[{
                  name: 'تعداد تست‌ها',
                  data: stats.categories.categoryStats.map(c => c._count.category)
                }]}
                options={{
                  chart: {
                    toolbar: { show: false },
                    fontFamily: 'Vazirmatn'
                  },
                  xaxis: {
                    categories: stats.categories.categoryStats.map(c => c.category || 'نامشخص'),
                    labels: {
                      style: { fontFamily: 'Vazirmatn' }
                    }
                  },
                  yaxis: {
                    labels: {
                      style: { fontFamily: 'Vazirmatn' }
                    }
                  }
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* میانگین نمرات */}
        <Card>
          <CardHeader>
            <CardTitle>میانگین نمرات</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.answers && (
              <Chart
                type="radar"
                height={300}
                series={[{
                  name: 'میانگین نمره',
                  data: stats.answers.scoresByTestType.map(s => s._avg.score)
                }]}
                options={{
                  chart: {
                    toolbar: { show: false },
                    fontFamily: 'Vazirmatn'
                  },
                  xaxis: {
                    categories: stats.answers.scoresByTestType.map(s => s.testType),
                    labels: {
                      style: { fontFamily: 'Vazirmatn' }
                    }
                  },
                  yaxis: {
                    labels: {
                      style: { fontFamily: 'Vazirmatn' }
                    }
                  }
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 