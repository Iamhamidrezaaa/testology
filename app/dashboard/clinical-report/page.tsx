"use client";

import { useState, useEffect } from "react";
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

export default function ClinicalReportPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* هدر */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Stethoscope className="w-12 h-12 text-indigo-400" />
            🧠 AI Clinical Report
          </h1>
          <p className="text-xl text-indigo-200 mb-6">
            موتور تحلیل روان‌شناسی بالینی هوشمند - گزارش اولیه روان‌شناس
          </p>
          
          <Button
            onClick={generateReport}
            disabled={generating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-lg font-semibold"
          >
            {generating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                تحلیل روان‌شناسی...
              </>
            ) : (
              <>
                <Stethoscope className="w-5 h-5 mr-2" />
                🩺 تولید گزارش جدید
              </>
            )}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="reports">🧠 گزارش‌ها</TabsTrigger>
            <TabsTrigger value="stats">📊 آمار</TabsTrigger>
            <TabsTrigger value="insights">💡 بینش‌ها</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            {loading ? (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p>در حال بارگذاری گزارش‌ها...</p>
                </CardContent>
              </Card>
            ) : reports.length === 0 ? (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <Stethoscope className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">هنوز گزارشی تولید نشده</h3>
                  <p className="text-indigo-200 mb-4">
                    روی دکمه "تولید گزارش جدید" کلیک کنید تا تحلیل روان‌شناسی انجام شود
                  </p>
                </CardContent>
              </Card>
            ) : (
              reports.map((report, index) => (
                <Card key={report.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold text-indigo-300 mb-2">
                          گزارش بالینی #{index + 1}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-indigo-200">
                          <Calendar className="w-4 h-4" />
                          <span>تاریخ: {new Date(report.createdAt).toLocaleString("fa-IR")}</span>
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
                    <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/30">
                      <h4 className="text-lg font-semibold text-indigo-300 mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        گزارش بالینی
                      </h4>
                      <div className="text-gray-200 leading-relaxed whitespace-pre-line">
                        {report.summary}
                      </div>
                    </div>

                    {/* اطلاعات تکمیلی */}
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>کاربر: {report.userId}</span>
                      <span>تولید شده: {new Date(report.createdAt).toLocaleString("fa-IR")}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            {stats ? (
              <>
                {/* آمار کلی */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-6 text-center">
                      <Stethoscope className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">{stats.totalReports}</div>
                      <div className="text-indigo-200">گزارش‌های کل</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">{stats.recentReports}</div>
                      <div className="text-indigo-200">گزارش‌های اخیر</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-6 text-center">
                      <Calendar className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">
                        {stats.timeSpan ? stats.timeSpan.days : 0}
                      </div>
                      <div className="text-indigo-200">روز فعالیت</div>
                    </CardContent>
                  </Card>
                </div>

                {/* تاریخچه گزارش‌ها */}
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-300">
                      <BarChart3 className="w-5 h-5" />
                      تاریخچه گزارش‌ها
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.firstReport && (
                        <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                          <div>
                            <span className="text-white font-semibold">اولین گزارش</span>
                            <p className="text-sm text-gray-300">
                              {new Date(stats.firstReport.createdAt).toLocaleString("fa-IR")}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            شروع
                          </Badge>
                        </div>
                      )}
                      
                      {stats.lastReport && (
                        <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                          <div>
                            <span className="text-white font-semibold">آخرین گزارش</span>
                            <p className="text-sm text-gray-300">
                              {new Date(stats.lastReport.createdAt).toLocaleString("fa-IR")}
                            </p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            جدید
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <BarChart3 className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">آمار گزارش‌ها در دسترس نیست</h3>
                  <p className="text-indigo-200">
                    ابتدا گزارش‌هایی تولید کنید تا آمار نمایش داده شود
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-300">
                  <Lightbulb className="w-5 h-5" />
                  بینش‌های استخراج شده از گزارش‌های بالینی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.slice(0, 3).map((report, index) => (
                    <div key={report.id} className="bg-black/20 rounded-lg p-4 border border-indigo-500/30">
                      <h4 className="text-lg font-semibold text-indigo-300 mb-2">
                        گزارش #{index + 1}
                      </h4>
                      <p className="text-gray-200 leading-relaxed mb-2">
                        {report.summary.length > 200 ? report.summary.substring(0, 200) + "..." : report.summary}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>تاریخ: {new Date(report.createdAt).toLocaleDateString("fa-IR")}</span>
                        <span>کاربر: {report.userId}</span>
                      </div>
                    </div>
                  ))}
                  
                  {reports.length === 0 && (
                    <div className="text-center py-8">
                      <Lightbulb className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">هنوز بینشی استخراج نشده</h3>
                      <p className="text-indigo-200">
                        گزارش‌هایی تولید کنید تا بینش‌های بالینی استخراج شود
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* راهنمای سیستم بالینی */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-300">
                  <BookOpen className="w-5 h-5" />
                  راهنمای موتور تحلیل روان‌شناسی بالینی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
                    <h4 className="font-semibold text-indigo-300 mb-2">1. تحلیل تست‌ها</h4>
                    <p className="text-gray-200 text-sm">
                      سیستم تمام تست‌های انجام شده توسط کاربر را جمع‌آوری و تحلیل می‌کند.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <h4 className="font-semibold text-green-300 mb-2">2. تولید گزارش بالینی</h4>
                    <p className="text-gray-200 text-sm">
                      بر اساس تحلیل تست‌ها، گزارش روان‌شناسی چندبُعدی تولید می‌شود.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                    <h4 className="font-semibold text-yellow-300 mb-2">3. بینش‌های بالینی</h4>
                    <p className="text-gray-200 text-sm">
                      گزارش شامل تحلیل خلق، اضطراب، انگیزش، روابط، تمرکز و عزت‌نفس است.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                    <h4 className="font-semibold text-purple-300 mb-2">4. پیشنهادات حرفه‌ای</h4>
                    <p className="text-gray-200 text-sm">
                      سیستم پیشنهادات حرفه‌ای برای مراحل بعدی ارائه می‌دهد.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}











