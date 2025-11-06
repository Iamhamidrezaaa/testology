'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminInsights from '@/components/admin/admin-insights';
import UserFeedbackChart from '@/components/admin/user-feedback-chart';
import { ContentApprovalService, ContentApprovalItem, ApprovalStats } from '@/components/admin/content-approval';

export default function AdminInsightsPage() {
  const [pendingItems, setPendingItems] = useState<ContentApprovalItem[]>([]);
  const [approvalStats, setApprovalStats] = useState<ApprovalStats | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      try {
        const items = await ContentApprovalService.getPendingItems();
        const stats = await ContentApprovalService.getApprovalStats();
        setPendingItems(items);
        setApprovalStats(stats);
      } catch (error) {
        console.error('خطا در دریافت داده‌ها:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (itemId: string, type: 'blog' | 'comment') => {
    try {
      const success = await ContentApprovalService.approveItem(itemId, type);
      if (success) {
        await fetchData();
      }
    } catch (error) {
      console.error('خطا در تأیید:', error);
    }
  };

  const handleReject = async (itemId: string, type: 'blog' | 'comment', reason: string) => {
    try {
      const success = await ContentApprovalService.rejectItem(itemId, type, reason);
      if (success) {
        await fetchData();
      }
    } catch (error) {
      console.error('خطا در رد:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">پنل مدیریت پیشرفته</h1>
        <p className="text-gray-600">تحلیل‌های جامع و مدیریت محتوای تستولوژی</p>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">تحلیل‌ها</TabsTrigger>
          <TabsTrigger value="feedback">واکنش کاربران</TabsTrigger>
          <TabsTrigger value="approval">تأیید محتوا</TabsTrigger>
          <TabsTrigger value="stats">آمار کلی</TabsTrigger>
        </TabsList>

        <TabsContent value="insights">
          <AdminInsights />
        </TabsContent>

        <TabsContent value="feedback">
          <UserFeedbackChart />
        </TabsContent>

        <TabsContent value="approval" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">در انتظار تأیید</CardTitle>
                <Badge variant="secondary">{approvalStats?.totalPending || 0}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvalStats?.totalPending || 0}</div>
                <p className="text-xs text-muted-foreground">
                  آیتم‌های در انتظار بررسی
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">تأیید شده</CardTitle>
                <Badge variant="secondary">{approvalStats?.totalApproved || 0}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvalStats?.totalApproved || 0}</div>
                <p className="text-xs text-muted-foreground">
                  آیتم‌های تأیید شده
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">نرخ تأیید</CardTitle>
                <Badge variant="secondary">{approvalStats?.approvalRate || 0}%</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvalStats?.approvalRate || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  میانگین زمان تأیید: {approvalStats?.averageApprovalTime || 0} ساعت
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>آیتم‌های در انتظار تأیید</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    هیچ آیتمی در انتظار تأیید نیست
                  </div>
                ) : (
                  pendingItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}>
                          {item.priority === 'high' ? 'بالا' : item.priority === 'medium' ? 'متوسط' : 'پایین'}
                        </Badge>
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.content}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            نویسنده: {item.author} • {item.createdAt.toLocaleDateString('fa-IR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {item.type === 'blog' || item.type === 'comment' ? (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => {
                                const type = item.type === 'blog' ? 'blog' as const : 'comment' as const;
                                handleApprove(item.id, type);
                              }}
                            >
                              تأیید
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                const type = item.type === 'blog' ? 'blog' as const : 'comment' as const;
                                handleReject(item.id, type, 'رد شده توسط ادمین');
                              }}
                            >
                              رد
                            </Button>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">نوع محتوا پشتیبانی نمی‌شود</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">کل کاربران</CardTitle>
                <Badge variant="secondary">1,250</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,250</div>
                <p className="text-xs text-muted-foreground">
                  +45 کاربر جدید این ماه
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">تست‌های انجام شده</CardTitle>
                <Badge variant="secondary">2,340</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,340</div>
                <p className="text-xs text-muted-foreground">
                  +180 تست این هفته
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">مقالات</CardTitle>
                <Badge variant="secondary">50</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">50</div>
                <p className="text-xs text-muted-foreground">
                  {approvalStats?.totalApproved || 0} منتشر شده
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">نرخ درگیری</CardTitle>
                <Badge variant="secondary">78%</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">
                  +5% نسبت به ماه گذشته
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>خلاصه عملکرد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>تست‌های محبوب:</span>
                  <Badge>تست اضطراب (450 تکمیل)</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>مقالات پربازدید:</span>
                  <Badge>راه‌های کاهش اضطراب (120 بازدید)</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>کاربران فعال:</span>
                  <Badge>890 کاربر فعال</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>نرخ تأیید محتوا:</span>
                  <Badge variant="secondary">{approvalStats?.approvalRate || 0}%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
















