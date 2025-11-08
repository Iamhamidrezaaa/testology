'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import UserMonthlyChart from '../_components/UserMonthlyChart'
import TestPopularityChart from '../_components/TestPopularityChart'
import PopularTestsPieChart from '../_components/PopularTestsPieChart'

interface ReportData {
  userGrowth: Array<{ date: string; users: number; tests: number }>
  testPopularity: Array<{ testName: string; count: number; percentage: number }>
  scoreDistribution: Array<{ range: string; count: number }>
  monthlyStats: Array<{ month: string; users: number; tests: number; analyses: number }>
  categoryStats: Array<{ category: string; count: number; color: string }>
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')

  useEffect(() => {
    console.log('Fetching reports for period:', selectedPeriod)
    
    // بررسی localStorage برای authentication
    const role = localStorage.getItem("testology_role");
    const email = localStorage.getItem("testology_email");
    
    if (!role || role !== "ADMIN") {
      console.error("Unauthorized access to reports");
      setLoading(false);
      return;
    }
    
    fetch(`/api/admin/reports?period=${selectedPeriod}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
      .then(res => {
        console.log('Response status:', res.status)
        if (!res.ok) {
          // اگر خطای 401 یا 403 بود، احتمالاً مشکل session است
          if (res.status === 401 || res.status === 403) {
            throw new Error('دسترسی غیرمجاز. لطفاً دوباره وارد شوید.')
          }
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        console.log('Report data received:', data)
        if (data.error) {
          throw new Error(data.error)
        }
        setReportData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching reports:', err)
        setLoading(false)
        // نمایش پیام خطا به کاربر
        alert(`خطا در دریافت گزارش: ${err.message}`)
      })
  }, [selectedPeriod])

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* هدر */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">گزارش‌های آماری</h1>
          <p className="text-gray-600">تحلیل و گزارش‌گیری از عملکرد سیستم</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={selectedPeriod === 'week' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('week')}
          >
            هفتگی
          </Button>
          <Button
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('month')}
          >
            ماهانه
          </Button>
          <Button
            variant={selectedPeriod === 'year' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('year')}
          >
            سالانه
          </Button>
        </div>
      </div>

      {/* آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">👥 کاربران جدید</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData?.userGrowth?.[reportData.userGrowth?.length - 1]?.users || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              در {selectedPeriod === 'week' ? 'این هفته' : selectedPeriod === 'month' ? 'این ماه' : 'این سال'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">🧪 تست‌های انجام‌شده</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData?.userGrowth?.[reportData.userGrowth?.length - 1]?.tests || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              در {selectedPeriod === 'week' ? 'این هفته' : selectedPeriod === 'month' ? 'این ماه' : 'این سال'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">📊 محبوب‌ترین تست</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData?.testPopularity?.[0]?.testName || '—'}
            </div>
            <p className="text-xs text-muted-foreground">
              {reportData?.testPopularity?.[0]?.count || 0} بار انجام شده
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">📈 رشد کلی</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              نسبت به دوره قبل
            </p>
          </CardContent>
        </Card>
      </div>

      {/* نمودار رشد کاربران */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserMonthlyChart />
        
        <Card>
          <CardHeader>
            <CardTitle>📈 رشد کاربران و تست‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportData?.userGrowth || []}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorTests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                  <Area
                    type="monotone"
                    dataKey="tests"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorTests)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* نمودار محبوب‌ترین تست‌ها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TestPopularityChart />
        <PopularTestsPieChart />
      </div>

      {/* توزیع امتیازات */}
      <Card>
        <CardHeader>
          <CardTitle>📈 توزیع امتیازات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData?.scoreDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* آمار ماهانه */}
      <Card>
        <CardHeader>
          <CardTitle>📅 آمار ماهانه</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4">ماه</th>
                  <th className="text-right py-3 px-4">کاربران جدید</th>
                  <th className="text-right py-3 px-4">تست‌ها</th>
                  <th className="text-right py-3 px-4">تحلیل‌ها</th>
                </tr>
              </thead>
              <tbody>
                {(reportData?.monthlyStats || []).map((stat, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{stat.month}</td>
                    <td className="py-3 px-4">{stat.users}</td>
                    <td className="py-3 px-4">{stat.tests}</td>
                    <td className="py-3 px-4">{stat.analyses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
