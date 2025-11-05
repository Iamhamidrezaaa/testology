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
  AlertCircle
} from "lucide-react";

interface TestRecommendation {
  id: string;
  userId: string;
  testName: string;
  score: number;
  reason: string;
  createdAt: string;
}

interface RecommendationStats {
  totalRecommendations: number;
  recentRecommendations: number;
  testStats: Array<{
    testName: string;
    count: number;
  }>;
  priorityStats: {
    average: number;
    max: number;
    min: number;
  };
  lastRecommendation: TestRecommendation | null;
}

export default function AISmartTestRecommender() {
  const [recommendations, setRecommendations] = useState<TestRecommendation[]>([]);
  const [stats, setStats] = useState<RecommendationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("recommendations");
  
  // در آینده از session گرفته می‌شود
  const userId = "demo-user-123";

  // بارگذاری پیشنهادها
  const loadRecommendations = async () => {
    try {
      const response = await fetch(`/api/ai/get-user-recommendations?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error("خطا در بارگذاری پیشنهادها:", error);
    }
  };

  // بارگذاری آمار
  const loadStats = async () => {
    try {
      const response = await fetch("/api/ai/get-user-recommendations", { 
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

  // تولید پیشنهادهای جدید
  const generateRecommendations = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/ai/recommend-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      
      if (data.success) {
        alert("🩺 پیشنهادهای بالینی جدید تولید شد! تحلیل بالینی انجام شد.");
        await loadRecommendations();
        await loadStats();
      } else {
        alert("خطا در تولید پیشنهادها: " + data.message);
      }
    } catch (error) {
      console.error("خطا در تولید پیشنهادها:", error);
      alert("خطا در تولید پیشنهادها");
    } finally {
      setGenerating(false);
    }
  };

  // دریافت رنگ بر اساس اولویت
  const getPriorityColor = (score: number) => {
    if (score >= 0.8) return "bg-red-100 text-red-800";
    if (score >= 0.6) return "bg-orange-100 text-orange-800";
    if (score >= 0.4) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  // دریافت آیکون بر اساس اولویت
  const getPriorityIcon = (score: number) => {
    if (score >= 0.8) return <AlertCircle className="w-4 h-4 text-red-600" />;
    if (score >= 0.6) return <AlertCircle className="w-4 h-4 text-orange-600" />;
    if (score >= 0.4) return <CheckCircle className="w-4 h-4 text-yellow-600" />;
    return <CheckCircle className="w-4 h-4 text-green-600" />;
  };

  // دریافت رنگ بر اساس نوع تست
  const getTestColor = (testName: string) => {
    if (testName.includes("اضطراب")) return "bg-red-100 text-red-800";
    if (testName.includes("افسردگی")) return "bg-blue-100 text-blue-800";
    if (testName.includes("استرس")) return "bg-orange-100 text-orange-800";
    if (testName.includes("عزت نفس")) return "bg-green-100 text-green-800";
    if (testName.includes("خواب")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadRecommendations(), loadStats()]);
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
            <Stethoscope className="w-6 h-6 text-teal-600" />
            🩺 AI Smart Test Recommender - سیستم پیشنهاد تست هوشمند
          </CardTitle>
          <p className="text-gray-600">
            تحلیل بالینی داده‌محور Testology - پیشنهاد تست‌های شخصی‌سازی‌شده بر اساس تحلیل روانشناختی
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={generateRecommendations} 
              disabled={generating}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {generating ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Stethoscope className="w-4 h-4 mr-2" />
              )}
              {generating ? "تحلیل بالینی..." : "🩺 تولید پیشنهادهای جدید"}
            </Button>
            
            <Button 
              onClick={loadRecommendations} 
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              بروزرسانی پیشنهادها
            </Button>
            
            <Button 
              onClick={() => window.open('/recommended-tests', '_blank')}
              variant="outline"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              مشاهده کامل
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recommendations">🩺 پیشنهادها</TabsTrigger>
              <TabsTrigger value="stats">📊 آمار</TabsTrigger>
              <TabsTrigger value="insights">💡 بینش‌ها</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p>در حال بارگذاری پیشنهادها...</p>
                  </CardContent>
                </Card>
              ) : recommendations.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Stethoscope className="w-16 h-16 text-teal-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      هنوز پیشنهادی تولید نشده
                    </h3>
                    <p className="text-gray-500">
                      روی دکمه "تولید پیشنهادهای جدید" کلیک کنید
                    </p>
                  </CardContent>
                </Card>
              ) : (
                recommendations.slice(0, 3).map((rec) => (
                  <Card key={rec.id} className="border-l-4 border-l-teal-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold text-teal-800 mb-1">
                            {rec.testName}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Target className="w-4 h-4" />
                            <span>اولویت: {(rec.score * 100).toFixed(0)}%</span>
                            <Badge className={getTestColor(rec.testName)}>
                              {rec.testName}
                            </Badge>
                          </div>
                        </div>
                        <Badge className={getPriorityColor(rec.score)}>
                          {getPriorityIcon(rec.score)}
                          <span className="ml-1">{(rec.score * 100).toFixed(0)}%</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* دلیل بالینی */}
                      <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                        <h4 className="text-sm font-semibold text-teal-800 mb-2 flex items-center gap-2">
                          <Brain className="w-4 h-4" />
                          تحلیل بالینی
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {rec.reason.length > 150 ? rec.reason.substring(0, 150) + "..." : rec.reason}
                        </p>
                      </div>

                      {/* اطلاعات تکمیلی */}
                      <div className="text-sm text-gray-500">
                        <span>تولید شده: {new Date(rec.createdAt).toLocaleString("fa-IR")}</span>
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
                        <Stethoscope className="w-5 h-5 text-teal-600" />
                        <div>
                          <p className="text-2xl font-bold">{stats.totalRecommendations}</p>
                          <p className="text-sm text-gray-600">پیشنهادهای کل</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-2xl font-bold">{(stats.priorityStats.average * 100).toFixed(0)}%</p>
                          <p className="text-sm text-gray-600">میانگین اولویت</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-2xl font-bold">{(stats.priorityStats.max * 100).toFixed(0)}%</p>
                          <p className="text-sm text-gray-600">بیشترین اولویت</p>
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
                      آمار پیشنهادها در دسترس نیست
                    </h3>
                    <p className="text-gray-500">
                      ابتدا پیشنهادهایی تولید کنید
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="space-y-4">
                {recommendations.slice(0, 3).map((rec) => (
                  <Card key={rec.id} className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <h4 className="text-lg font-semibold text-yellow-800 mb-2">
                        {rec.testName}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {rec.reason}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        اولویت: {(rec.score * 100).toFixed(0)}%
                      </p>
                    </CardContent>
                  </Card>
                ))}
                
                {recommendations.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        هنوز بینشی استخراج نشده
                      </h3>
                      <p className="text-gray-500">
                        پیشنهادهایی تولید کنید تا بینش‌های بالینی استخراج شود
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











