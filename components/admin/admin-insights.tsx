'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

interface AdminInsightsProps {
  className?: string;
}

interface BlogStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  averageViewsPerArticle: number;
  topArticles: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
  }>;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  userEngagement: number;
}

interface TestStats {
  totalTests: number;
  completedTests: number;
  averageCompletionRate: number;
  popularTests: Array<{
    name: string;
    completions: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AdminInsights({ className }: AdminInsightsProps) {
  const [blogStats, setBlogStats] = useState<BlogStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [testStats, setTestStats] = useState<TestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchInsights();
  }, [timeRange]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      
      // Fetch blog statistics
      const blogResponse = await fetch('/api/admin/blogs');
      const blogData = await blogResponse.json();
      
      if (blogData.success) {
        const blogs = blogData.blogs;
        const totalViews = blogs.reduce((sum: number, blog: any) => sum + blog.views, 0);
        const totalLikes = blogs.reduce((sum: number, blog: any) => sum + blog.likes, 0);
        const totalComments = blogs.reduce((sum: number, blog: any) => sum + (blog.comments?.length || 0), 0);
        
        setBlogStats({
          totalArticles: blogs.length,
          publishedArticles: blogs.filter((blog: any) => blog.published).length,
          draftArticles: blogs.filter((blog: any) => !blog.published).length,
          totalViews,
          totalLikes,
          totalComments,
          averageViewsPerArticle: blogs.length > 0 ? Math.round(totalViews / blogs.length) : 0,
          topArticles: blogs
            .sort((a: any, b: any) => b.views - a.views)
            .slice(0, 5)
            .map((blog: any) => ({
              id: blog.id,
              title: blog.title,
              views: blog.views,
              likes: blog.likes,
              comments: blog.comments?.length || 0
            }))
        });
      }

      // Mock data for user and test stats (replace with actual API calls)
      setUserStats({
        totalUsers: 1250,
        activeUsers: 890,
        newUsers: 45,
        userEngagement: 78
      });

      setTestStats({
        totalTests: 15,
        completedTests: 2340,
        averageCompletionRate: 85,
        popularTests: [
          { name: 'تست اضطراب', completions: 450 },
          { name: 'تست افسردگی', completions: 380 },
          { name: 'تست عزت نفس', completions: 320 },
          { name: 'تست استرس', completions: 290 },
          { name: 'تست رضایت از زندگی', completions: 250 }
        ]
      });

    } catch (error) {
      console.error('خطا در دریافت آمار:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'شنبه', views: 120, likes: 45, comments: 12 },
    { name: 'یکشنبه', views: 190, likes: 67, comments: 18 },
    { name: 'دوشنبه', views: 300, likes: 89, comments: 25 },
    { name: 'سه‌شنبه', views: 280, likes: 76, comments: 22 },
    { name: 'چهارشنبه', views: 189, likes: 54, comments: 16 },
    { name: 'پنج‌شنبه', views: 239, likes: 68, comments: 19 },
    { name: 'جمعه', views: 349, likes: 92, comments: 28 }
  ];

  const pieData = [
    { name: 'مقالات منتشر شده', value: blogStats?.publishedArticles || 0 },
    { name: 'مقالات پیش‌نویس', value: blogStats?.draftArticles || 0 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">داشبورد تحلیل‌های مدیریتی</h1>
        <div className="flex gap-2">
          <Button 
            variant={timeRange === '7d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('7d')}
          >
            7 روز گذشته
          </Button>
          <Button 
            variant={timeRange === '30d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('30d')}
          >
            30 روز گذشته
          </Button>
          <Button 
            variant={timeRange === '90d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('90d')}
          >
            90 روز گذشته
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل مقالات</CardTitle>
            <Badge variant="secondary">{blogStats?.totalArticles || 0}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogStats?.totalArticles || 0}</div>
            <p className="text-xs text-muted-foreground">
              {blogStats?.publishedArticles || 0} منتشر شده
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل بازدیدها</CardTitle>
            <Badge variant="secondary">{blogStats?.totalViews || 0}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogStats?.totalViews || 0}</div>
            <p className="text-xs text-muted-foreground">
              میانگین {blogStats?.averageViewsPerArticle || 0} بازدید در مقاله
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل لایک‌ها</CardTitle>
            <Badge variant="secondary">{blogStats?.totalLikes || 0}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogStats?.totalLikes || 0}</div>
            <p className="text-xs text-muted-foreground">
              {blogStats?.totalComments || 0} نظر
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کاربران فعال</CardTitle>
            <Badge variant="secondary">{userStats?.activeUsers || 0}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {userStats?.newUsers || 0} کاربر جدید
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نمای کلی</TabsTrigger>
          <TabsTrigger value="articles">مقالات</TabsTrigger>
          <TabsTrigger value="users">کاربران</TabsTrigger>
          <TabsTrigger value="tests">تست‌ها</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>روند بازدیدها در هفته گذشته</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="views" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>وضعیت مقالات</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="articles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>مقالات پربازدید</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blogStats?.topArticles.map((article, index) => (
                  <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <h4 className="font-medium">{article.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {article.views} بازدید • {article.likes} لایک • {article.comments} نظر
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      مشاهده
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>آمار کاربران</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>کل کاربران:</span>
                    <Badge>{userStats?.totalUsers || 0}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>کاربران فعال:</span>
                    <Badge variant="secondary">{userStats?.activeUsers || 0}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>کاربران جدید:</span>
                    <Badge variant="outline">{userStats?.newUsers || 0}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>درگیری کاربران:</span>
                    <Badge variant="default">{userStats?.userEngagement || 0}%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>روند فعالیت کاربران</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تست‌های محبوب</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={testStats?.popularTests || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completions" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}