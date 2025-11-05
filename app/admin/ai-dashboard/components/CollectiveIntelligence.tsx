"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Users, 
  Brain, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  MapPin,
  Clock,
  Heart,
  Activity,
  RefreshCw,
  Trash2,
  Eye,
  Lightbulb
} from "lucide-react";

interface CollectiveReport {
  timestamp: string;
  total_users: number;
  psychology_analysis: {
    mental_health_index: number;
    psychological_stats: Record<string, any>;
    region_distribution: Record<string, number>;
    age_distribution: Record<string, number>;
    gender_distribution: Record<string, number>;
  };
  clustering_analysis: {
    clusters: Record<string, any>;
    cluster_personalities: Record<string, string>;
  };
  trends_analysis: {
    concerning_trends: string[];
    daily_trends: Record<string, any>;
    regional_trends: Record<string, any>;
  };
  collective_insights: string[];
  collective_intelligence_level: string;
}

interface CollectiveStats {
  total_users: number;
  insights_count: number;
  mental_health_index: number;
  clusters_count: number;
  concerning_trends: number;
  last_analysis: string;
  mental_health_status: string;
  regional_distribution: Record<string, number>;
  age_distribution: Record<string, number>;
  gender_distribution: Record<string, number>;
}

export default function CollectiveIntelligence() {
  const [report, setReport] = useState<CollectiveReport | null>(null);
  const [stats, setStats] = useState<CollectiveStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // بارگذاری گزارش هوش جمعی
  const loadReport = async () => {
    try {
      const response = await fetch("/api/ml/collective-intelligence");
      const data = await response.json();
      
      if (data.success) {
        setReport(data.report);
      }
    } catch (error) {
      console.error("خطا در بارگذاری گزارش:", error);
    }
  };

  // بارگذاری آمار هوش جمعی
  const loadStats = async () => {
    try {
      const response = await fetch("/api/ml/collective-intelligence", { method: "PUT" });
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("خطا در بارگذاری آمار:", error);
    }
  };

  // اجرای تحلیل هوش جمعی
  const runAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ml/collective-intelligence", { method: "POST" });
      const data = await response.json();
      
      if (data.success) {
        alert("🌍 تحلیل هوش جمعی اجرا شد! Testology حالا یک مغز جمعی است!");
        await loadReport();
        await loadStats();
      } else {
        alert("خطا در اجرای تحلیل هوش جمعی");
      }
    } catch (error) {
      console.error("خطا در اجرای تحلیل:", error);
      alert("خطا در اجرای تحلیل هوش جمعی");
    } finally {
      setIsLoading(false);
    }
  };

  // پاک کردن داده‌ها
  const clearData = async () => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید تمام داده‌های هوش جمعی را پاک کنید؟")) {
      return;
    }

    try {
      const response = await fetch("/api/ml/collective-intelligence", { method: "DELETE" });
      const data = await response.json();
      
      if (data.success) {
        alert("✅ داده‌های هوش جمعی پاک شدند");
        await loadReport();
        await loadStats();
      }
    } catch (error) {
      console.error("خطا در پاک کردن داده‌ها:", error);
    }
  };

  // دریافت رنگ بر اساس سطح سلامت روان
  const getMentalHealthColor = (index: number) => {
    if (index > 0.7) return "text-green-600";
    if (index > 0.4) return "text-yellow-600";
    return "text-red-600";
  };

  // دریافت آیکون بر اساس سطح سلامت روان
  const getMentalHealthIcon = (index: number) => {
    if (index > 0.7) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (index > 0.4) return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <AlertTriangle className="w-4 h-4 text-red-600" />;
  };

  // دریافت رنگ بر اساس سطح هوش جمعی
  const getIntelligenceColor = (level: string) => {
    switch (level) {
      case "high": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    loadReport();
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* هدر */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            🌍 AI Collective Intelligence
          </CardTitle>
          <p className="text-gray-600">
            Testology حالا یک مغز جمعی است که از رفتار و احساسات تمام کاربران یاد می‌گیرد
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={runAnalysis} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Globe className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "در حال تحلیل..." : "اجرای تحلیل هوش جمعی"}
            </Button>
            
            <Button 
              onClick={loadStats} 
              variant="outline"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              بروزرسانی آمار
            </Button>
            
            <Button 
              onClick={clearData} 
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              پاک کردن داده‌ها
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">📊 نمای کلی</TabsTrigger>
              <TabsTrigger value="psychology">🧠 روانشناسی جمعی</TabsTrigger>
              <TabsTrigger value="clusters">👥 خوشه‌بندی</TabsTrigger>
              <TabsTrigger value="insights">💡 بینش‌ها</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* آمار کلی */}
              {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-2xl font-bold">{stats.total_users}</p>
                          <p className="text-sm text-gray-600">کاربران کل</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        {getMentalHealthIcon(stats.mental_health_index)}
                        <div>
                          <p className="text-2xl font-bold">{(stats.mental_health_index * 100).toFixed(1)}%</p>
                          <p className="text-sm text-gray-600">شاخص سلامت روان</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-2xl font-bold">{stats.clusters_count}</p>
                          <p className="text-sm text-gray-600">خوشه‌های کاربری</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-2xl font-bold">{stats.insights_count}</p>
                          <p className="text-sm text-gray-600">بینش‌های جمعی</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      هنوز تحلیل هوش جمعی انجام نشده
                    </h3>
                    <p className="text-gray-500">
                      روی دکمه "اجرای تحلیل هوش جمعی" کلیک کنید
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* سطح هوش جمعی */}
              {report && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      سطح هوش جمعی
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">سطح هوش جمعی</span>
                      <Badge className={getIntelligenceColor(report.collective_intelligence_level)}>
                        {report.collective_intelligence_level}
                      </Badge>
                    </div>
                    <Progress 
                      value={report.collective_intelligence_level === 'high' ? 100 : 
                             report.collective_intelligence_level === 'medium' ? 60 : 30} 
                      className="h-3"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      آخرین تحلیل: {new Date(report.timestamp).toLocaleString("fa-IR")}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="psychology" className="space-y-4">
              {/* تحلیل روانشناسی جمعی */}
              {report?.psychology_analysis ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-600" />
                        شاخص سلامت روان جمعی
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold">شاخص کلی</span>
                        <span className={`text-2xl font-bold ${getMentalHealthColor(report.psychology_analysis.mental_health_index)}`}>
                          {(report.psychology_analysis.mental_health_index * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={report.psychology_analysis.mental_health_index * 100} 
                        className="h-3"
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        وضعیت: {stats?.mental_health_status || 'نامشخص'}
                      </p>
                    </CardContent>
                  </Card>

                  {/* توزیع منطقه‌ای */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        توزیع منطقه‌ای کاربران
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(stats?.regional_distribution || {}).map(([region, count]) => (
                          <div key={region} className="flex justify-between items-center">
                            <span>{region}</span>
                            <Badge variant="outline">{count} کاربر</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* توزیع سنی */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        توزیع سنی کاربران
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(stats?.age_distribution || {}).map(([age, count]) => (
                          <div key={age} className="flex justify-between items-center">
                            <span>{age} سال</span>
                            <Badge variant="outline">{count} کاربر</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      تحلیل روانشناسی در دسترس نیست
                    </h3>
                    <p className="text-gray-500">
                      ابتدا تحلیل هوش جمعی را اجرا کنید
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="clusters" className="space-y-4">
              {/* خوشه‌بندی کاربران */}
              {report?.clustering_analysis?.clusters ? (
                <div className="space-y-4">
                  {Object.entries(report.clustering_analysis.clusters).map(([clusterId, clusterData]) => (
                    <Card key={clusterId}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-purple-600" />
                          خوشه {clusterId}: {clusterData.personality}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">تعداد کاربران</p>
                            <p className="text-2xl font-bold">{clusterData.size}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">درصد</p>
                            <p className="text-2xl font-bold">{clusterData.percentage.toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">شخصیت</p>
                            <Badge variant="outline">{clusterData.personality}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      تحلیل خوشه‌بندی در دسترس نیست
                    </h3>
                    <p className="text-gray-500">
                      ابتدا تحلیل هوش جمعی را اجرا کنید
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              {/* بینش‌های جمعی */}
              {report?.collective_insights ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        بینش‌های جمعی Testology
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {report.collective_insights.map((insight, index) => (
                          <div key={index} className="p-3 bg-yellow-50 rounded-lg border-l-4 border-l-yellow-500">
                            <p className="text-gray-800">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* ترندهای نگران‌کننده */}
                  {report.trends_analysis?.concerning_trends && report.trends_analysis.concerning_trends.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          ترندهای نگران‌کننده
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {report.trends_analysis.concerning_trends.map((trend, index) => (
                            <div key={index} className="p-2 bg-red-50 rounded-lg border-l-4 border-l-red-500">
                              <p className="text-red-800 text-sm">{trend}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      بینش‌های جمعی در دسترس نیست
                    </h3>
                    <p className="text-gray-500">
                      ابتدا تحلیل هوش جمعی را اجرا کنید
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}












