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
  AreaChart,
  Scatter,
  ScatterChart,
  RadialBarChart,
  RadialBar
} from 'recharts';

interface UserFeedbackChartProps {
  className?: string;
}

interface FeedbackData {
  date: string;
  likes: number;
  dislikes: number;
  comments: number;
  shares: number;
  views: number;
  engagement: number;
}

interface SentimentData {
  positive: number;
  negative: number;
  neutral: number;
}

interface UserEngagement {
  userId: string;
  userName: string;
  totalInteractions: number;
  likes: number;
  comments: number;
  shares: number;
  lastActive: string;
}

interface ArticleFeedback {
  articleId: string;
  articleTitle: string;
  likes: number;
  dislikes: number;
  comments: number;
  shares: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function UserFeedbackChart({ className }: UserFeedbackChartProps) {
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [userEngagement, setUserEngagement] = useState<UserEngagement[]>([]);
  const [articleFeedback, setArticleFeedback] = useState<ArticleFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchFeedbackData();
  }, [timeRange]);

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      const mockFeedbackData: FeedbackData[] = [
        { date: 'شنبه', likes: 45, dislikes: 3, comments: 12, shares: 8, views: 120, engagement: 68 },
        { date: 'یکشنبه', likes: 67, dislikes: 5, comments: 18, shares: 12, views: 190, engagement: 72 },
        { date: 'دوشنبه', likes: 89, dislikes: 7, comments: 25, shares: 15, views: 300, engagement: 75 },
        { date: 'سه‌شنبه', likes: 76, dislikes: 4, comments: 22, shares: 11, views: 280, engagement: 73 },
        { date: 'چهارشنبه', likes: 54, dislikes: 6, comments: 16, shares: 9, views: 189, engagement: 70 },
        { date: 'پنج‌شنبه', likes: 68, dislikes: 2, comments: 19, shares: 13, views: 239, engagement: 74 },
        { date: 'جمعه', likes: 92, dislikes: 8, comments: 28, shares: 17, views: 349, engagement: 78 }
      ];

      const mockSentimentData: SentimentData = {
        positive: 65,
        negative: 15,
        neutral: 20
      };

      const mockUserEngagement: UserEngagement[] = [
        { userId: '1', userName: 'علی احمدی', totalInteractions: 45, likes: 30, comments: 10, shares: 5, lastActive: '2 ساعت پیش' },
        { userId: '2', userName: 'فاطمه رضایی', totalInteractions: 38, likes: 25, comments: 8, shares: 5, lastActive: '1 ساعت پیش' },
        { userId: '3', userName: 'محمد کریمی', totalInteractions: 32, likes: 20, comments: 7, shares: 5, lastActive: '3 ساعت پیش' },
        { userId: '4', userName: 'زهرا نوری', totalInteractions: 28, likes: 18, comments: 6, shares: 4, lastActive: '4 ساعت پیش' },
        { userId: '5', userName: 'حسن محمدی', totalInteractions: 25, likes: 15, comments: 5, shares: 5, lastActive: '5 ساعت پیش' }
      ];

      const mockArticleFeedback: ArticleFeedback[] = [
        { articleId: '1', articleTitle: 'راه‌های کاهش اضطراب', likes: 45, dislikes: 3, comments: 12, shares: 8, sentiment: 'positive' },
        { articleId: '2', articleTitle: 'تکنیک‌های مدیریت استرس', likes: 38, dislikes: 2, comments: 10, shares: 6, sentiment: 'positive' },
        { articleId: '3', articleTitle: 'افزایش عزت نفس', likes: 42, dislikes: 5, comments: 15, shares: 9, sentiment: 'positive' },
        { articleId: '4', articleTitle: 'مدیریت خشم', likes: 35, dislikes: 4, comments: 8, shares: 5, sentiment: 'neutral' },
        { articleId: '5', articleTitle: 'تکنیک‌های خواب بهتر', likes: 28, dislikes: 6, comments: 6, shares: 4, sentiment: 'positive' }
      ];

      setFeedbackData(mockFeedbackData);
      setSentimentData(mockSentimentData);
      setUserEngagement(mockUserEngagement);
      setArticleFeedback(mockArticleFeedback);

    } catch (error) {
      console.error('خطا در دریافت داده‌های واکنش کاربران:', error);
    } finally {
      setLoading(false);
    }
  };

  const sentimentPieData = sentimentData ? [
    { name: 'مثبت', value: sentimentData.positive, color: '#00C49F' },
    { name: 'منفی', value: sentimentData.negative, color: '#FF8042' },
    { name: 'خنثی', value: sentimentData.neutral, color: '#FFBB28' }
  ] : [];

  const radialData = [
    { name: 'درگیری بالا', value: 35, fill: '#0088FE' },
    { name: 'درگیری متوسط', value: 45, fill: '#00C49F' },
    { name: 'درگیری پایین', value: 20, fill: '#FFBB28' }
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
        <h1 className="text-3xl font-bold text-gray-900">نمودارهای واکنش کاربران</h1>
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
            <CardTitle className="text-sm font-medium">کل واکنش‌ها</CardTitle>
            <Badge variant="secondary">
              {feedbackData.reduce((sum, item) => sum + item.likes + item.comments + item.shares, 0)}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedbackData.reduce((sum, item) => sum + item.likes + item.comments + item.shares, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              میانگین {Math.round(feedbackData.reduce((sum, item) => sum + item.engagement, 0) / feedbackData.length)}% درگیری
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">لایک‌ها</CardTitle>
            <Badge variant="secondary">
              {feedbackData.reduce((sum, item) => sum + item.likes, 0)}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedbackData.reduce((sum, item) => sum + item.likes, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {feedbackData.reduce((sum, item) => sum + item.dislikes, 0)} دیس‌لایک
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نظرات</CardTitle>
            <Badge variant="secondary">
              {feedbackData.reduce((sum, item) => sum + item.comments, 0)}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedbackData.reduce((sum, item) => sum + item.comments, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              میانگین {Math.round(feedbackData.reduce((sum, item) => sum + item.comments, 0) / feedbackData.length)} نظر در روز
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">اشتراک‌گذاری</CardTitle>
            <Badge variant="secondary">
              {feedbackData.reduce((sum, item) => sum + item.shares, 0)}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedbackData.reduce((sum, item) => sum + item.shares, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {feedbackData.reduce((sum, item) => sum + item.views, 0)} بازدید کل
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نمای کلی</TabsTrigger>
          <TabsTrigger value="sentiment">تحلیل احساسات</TabsTrigger>
          <TabsTrigger value="engagement">درگیری کاربران</TabsTrigger>
          <TabsTrigger value="articles">واکنش مقالات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>روند واکنش‌ها در هفته گذشته</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={feedbackData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="likes" stackId="1" stroke="#00C49F" fill="#00C49F" />
                    <Area type="monotone" dataKey="comments" stackId="1" stroke="#0088FE" fill="#0088FE" />
                    <Area type="monotone" dataKey="shares" stackId="1" stroke="#FFBB28" fill="#FFBB28" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توزیع واکنش‌ها</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'لایک', value: feedbackData.reduce((sum, item) => sum + item.likes, 0) },
                        { name: 'نظر', value: feedbackData.reduce((sum, item) => sum + item.comments, 0) },
                        { name: 'اشتراک', value: feedbackData.reduce((sum, item) => sum + item.shares, 0) }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1, 2].map((entry, index) => (
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

        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>تحلیل احساسات</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sentimentPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sentimentPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>روند احساسات</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={feedbackData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="engagement" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>کاربران فعال</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userEngagement.map((user, index) => (
                  <div key={user.userId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <h4 className="font-medium">{user.userName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {user.totalInteractions} واکنش • {user.likes} لایک • {user.comments} نظر • {user.shares} اشتراک
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{user.lastActive}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>واکنش مقالات</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={articleFeedback}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="articleTitle" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="likes" fill="#00C49F" name="لایک" />
                  <Bar dataKey="comments" fill="#0088FE" name="نظر" />
                  <Bar dataKey="shares" fill="#FFBB28" name="اشتراک" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}