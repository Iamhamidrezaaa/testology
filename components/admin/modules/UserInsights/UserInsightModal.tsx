'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserAnalyticsGraph } from './UserAnalyticsGraph';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';

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

interface UserInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    user: {
      id: string;
      name: string;
      email: string;
    };
    insights: UserAnalytics[];
    stats: {
      totalTests: number;
      completedTests: number;
      averageDuration: number;
      lastVisit: string | null;
    };
  };
}

export function UserInsightModal({ isOpen, onClose, userData }: UserInsightModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            تحلیل رفتار کاربر: {userData.user.name || userData.user.email}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">نمای کلی</TabsTrigger>
            <TabsTrigger value="graph">نمودارها</TabsTrigger>
            <TabsTrigger value="details">جزئیات</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">آمار کلی</h3>
                <div className="space-y-2">
                  <p>تعداد کل تست‌ها: {userData.stats.totalTests}</p>
                  <p>تست‌های تکمیل شده: {userData.stats.completedTests}</p>
                  <p>درصد تکمیل: {((userData.stats.completedTests / userData.stats.totalTests) * 100).toFixed(1)}%</p>
                  <p>میانگین زمان: {Math.round(userData.stats.averageDuration)} ثانیه</p>
                  <p>آخرین بازدید: {userData.stats.lastVisit ? formatDistanceToNow(new Date(userData.stats.lastVisit), { addSuffix: true, locale: faIR }) : 'بدون بازدید'}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="graph">
            <div className="space-y-4">
              <UserAnalyticsGraph
                data={userData.insights}
                type="line"
                title="روند فعالیت کاربر"
              />
              <UserAnalyticsGraph
                data={userData.insights}
                type="bar"
                title="توزیع زمانی فعالیت"
              />
            </div>
          </TabsContent>

          <TabsContent value="details">
            <div className="space-y-4">
              {userData.insights.map((insight) => (
                <div key={insight.id} className="p-4 bg-white rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{insight.test?.title || 'بدون عنوان'}</h4>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(insight.visitedAt), {
                          addSuffix: true,
                          locale: faIR,
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p>مدت زمان: {insight.durationSeconds} ثانیه</p>
                      <p className={`text-sm ${
                        insight.completed ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {insight.completed ? 'تکمیل شده' : 'ناتمام'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 