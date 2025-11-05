"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Stethoscope, 
  Brain, 
  Target, 
  TrendingUp, 
  BarChart3,
  RefreshCw,
  Lightbulb,
  Activity,
  Heart,
  Star,
  Zap,
  BookOpen,
  GraduationCap,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Users,
  TestTube,
  FileText,
  Calendar,
  Clock
} from "lucide-react";

interface ClinicalReport {
  id: string;
  userId: string;
  summary: string;
  mood?: string;
  anxiety?: string;
  motivation?: string;
  relationships?: string;
  selfEsteem?: string;
  focus?: string;
  recommendation?: string;
  createdAt: string;
}

interface ReportStats {
  totalReports: number;
  recentReports: number;
  firstReport: {
    id: string;
    createdAt: string;
  } | null;
  lastReport: {
    id: string;
    createdAt: string;
  } | null;
  timeSpan: {
    days: number;
  } | null;
}

export default function AIClinicalEngine() {
  const [reports, setReports] = useState<ClinicalReport[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("reports");
  
  // در آینده از session گرفته می‌شود
  const userId = "demo-user-123";

  // بارگذاری گزارش‌ها
  const loadReports = async () => {
    try {
      const response = await fetch(`/api/ai/get-clinical-reports?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setReports(data.reports);
      }
    } catch (error) {
      console.error("خطا در بارگذاری گزارش‌ها:", error);
    }
  };

  // بارگذاری آمار
  const loadStats = async () => {
    try {
      const response = await fetch("/api/ai/get-clinical-reports", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("خطا در بارگذاری آمار:", error);
    }
  };

  // تولید گزارش جدید
  const generateReport = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/ai/generate-clinical-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      
      if (data.success) {
        alert("🧠 گزارش بالینی جدید تولید شد! تحلیل روان‌شناسی انجام شد.");
        await loadReports();
        await loadStats();
      } else {
        alert("خطا در تولید گزارش: " + data.message);
      }
    } catch (error) {
      console.error("خطا در تولید گزارش:", error);
      alert("خطا در تولید گزارش");
    } finally {
      setGenerating(false);
    }
  };

  // دریافت رنگ بر اساس تاریخ
  const getDateColor = (date: string) => {
    const reportDate = new Date(date);
    const now = new Date();
    const diffDays = Math.ceil((now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return "bg-green-100 text-green-800";
    if (diffDays <= 7) return "bg-yellow-100 text-yellow-800";
    if (diffDays <= 30) return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
  };

  // دریافت آیکون بر اساس تاریخ
  const getDateIcon = (date: string) => {
    const reportDate = new Date(date);
    const now = new Date();
    const diffDays = Math.ceil((now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return <Clock className="w-4 h-4 text-green-600" />;
    if (diffDays <= 7) return <Clock className="w-4 h-4 text-yellow-600" />;
    if (diffDays <= 30) return <Clock className="w-4 h-4 text-orange-600" />;
    return <Clock className="w-4 h-4 text-gray-600" />;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadReports(), loadStats()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* هدر */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-indigo-600" />
            🧠 AI Clinical Engine - موتور تحلیل روان‌شناسی بالینی
          </CardTitle>
          <p className="text-gray-600">
            تولید گزارش بالینی هوشمند - گزارش اولیه روان‌شناس بر اساس تحلیل تست‌ها
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={generateReport} 
              disabled={generating}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {generating ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Stethoscope className="w-4 h-4 mr-2" />
              )}
              {generating ? "تحلیل روان‌شناسی..." : "🧠 تولید گزارش جدید"}
            </Button>
            
            <Button 
              onClick={loadReports} 
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              بروزرسانی گزارش‌ها
            </Button>
            
            <Button 
              onClick={() => window.open('/dashboard/clinical-report', '_blank')}
              variant="outline"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              مشاهده کامل
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reports">🧠 گزارش‌ها</TabsTrigger>
              <TabsTrigger value="stats">📊 آمار</TabsTrigger>
              <TabsTrigger value="insights">💡 بینش‌ها</TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p>در حال بارگذاری گزارش‌ها...</p>
                  </CardContent>
                </Card>
              ) : reports.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Stethoscope className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      هنوز گزارشی تولید نشده
                    </h3>
                    <p className="text-gray-500">
                      روی دکمه "تولید گزارش جدید" کلیک کنید
                    </p>
                  </CardContent>
                </Card>
              ) : (
                reports.slice(0, 2).map((report, index) => (
                  <Card key={report.id} className="border-l-4 border-l-indigo-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold text-indigo-800 mb-1">
                            گزارش بالینی #{index + 1}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>تاریخ: {new Date(report.createdAt).toLocaleDateString("fa-IR")}</span>
                            <Badge className={getDateColor(report.createdAt)}>
                              {getDateIcon(report.createdAt)}
                              <span className="ml-1">
                                {new Date(report.createdAt).toLocaleDateString("fa-IR")}
                              </span>
                            </Badge>
                          </div>
                        </div>
                        <Badge className="bg-indigo-100 text-indigo-800">
                          گزارش #{index + 1}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* محتوای گزارش */}
                      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                        <h4 className="text-sm font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          گزارش بالینی
                        </h4>
                        <div className="text-gray-700 text-sm leading-relaxed">
                          {report.summary.length > 300 ? report.summary.substring(0, 300) + "..." : report.summary}
                        </div>
                      </div>

                      {/* اطلاعات تکمیلی */}
                      <div className="text-sm text-gray-500">
                        <span>کاربر: {report.userId}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-2xl font-bold">{stats.totalReports}</p>
                          <p className="text-sm text-gray-600">گزارش‌های کل</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-2xl font-bold">{stats.recentReports}</p>
                          <p className="text-sm text-gray-600">گزارش‌های اخیر</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-2xl font-bold">
                            {stats.timeSpan ? stats.timeSpan.days : 0}
                          </p>
                          <p className="text-sm text-gray-600">روز فعالیت</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      آمار گزارش‌ها در دسترس نیست
                    </h3>
                    <p className="text-gray-500">
                      ابتدا گزارش‌هایی تولید کنید
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="space-y-4">
                {reports.slice(0, 2).map((report, index) => (
                  <Card key={report.id} className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <h4 className="text-lg font-semibold text-yellow-800 mb-2">
                        گزارش #{index + 1}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {report.summary.length > 200 ? report.summary.substring(0, 200) + "..." : report.summary}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        تاریخ: {new Date(report.createdAt).toLocaleDateString("fa-IR")}
                      </p>
                    </CardContent>
                  </Card>
                ))}
                
                {reports.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        هنوز بینشی استخراج نشده
                      </h3>
                      <p className="text-gray-500">
                        گزارش‌هایی تولید کنید تا بینش‌های بالینی استخراج شود
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}











