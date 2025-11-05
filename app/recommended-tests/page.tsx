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

export default function RecommendedTestsPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* هدر */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Stethoscope className="w-12 h-12 text-teal-400" />
            🩺 Smart Test Recommender
          </h1>
          <p className="text-xl text-teal-200 mb-6">
            سیستم پیشنهاد تست هوشمند - تحلیل بالینی داده‌محور Testology
          </p>
          
          <Button
            onClick={generateRecommendations}
            disabled={generating}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl text-lg font-semibold"
          >
            {generating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                تحلیل بالینی...
              </>
            ) : (
              <>
                <Stethoscope className="w-5 h-5 mr-2" />
                🔄 تولید پیشنهادهای جدید
              </>
            )}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="recommendations">🩺 پیشنهادها</TabsTrigger>
            <TabsTrigger value="stats">📊 آمار</TabsTrigger>
            <TabsTrigger value="insights">💡 بینش‌ها</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            {loading ? (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p>در حال بارگذاری پیشنهادها...</p>
                </CardContent>
              </Card>
            ) : recommendations.length === 0 ? (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <Stethoscope className="w-16 h-16 text-teal-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">هنوز پیشنهادی تولید نشده</h3>
                  <p className="text-teal-200 mb-4">
                    روی دکمه "تولید پیشنهادهای جدید" کلیک کنید تا تحلیل بالینی انجام شود
                  </p>
                </CardContent>
              </Card>
            ) : (
              recommendations.map((rec) => (
                <Card key={rec.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold text-teal-300 mb-2">
                          {rec.testName}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-teal-200">
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
                    <div className="bg-teal-500/10 rounded-lg p-4 border border-teal-500/30">
                      <h4 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        تحلیل بالینی
                      </h4>
                      <p className="text-gray-200 leading-relaxed">
                        {rec.reason}
                      </p>
                    </div>

                    {/* اطلاعات تکمیلی */}
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>تولید شده: {new Date(rec.createdAt).toLocaleString("fa-IR")}</span>
                      <span>کاربر: {rec.userId}</span>
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
                      <Stethoscope className="w-8 h-8 text-teal-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">{stats.totalRecommendations}</div>
                      <div className="text-teal-200">پیشنهادهای کل</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">{(stats.priorityStats.average * 100).toFixed(0)}%</div>
                      <div className="text-teal-200">میانگین اولویت</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-6 text-center">
                      <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">{(stats.priorityStats.max * 100).toFixed(0)}%</div>
                      <div className="text-teal-200">بیشترین اولویت</div>
                    </CardContent>
                  </Card>
                </div>

                {/* توزیع تست‌ها */}
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-teal-300">
                      <BarChart3 className="w-5 h-5" />
                      توزیع تست‌های پیشنهادی
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.testStats.map((test, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-200">{test.testName}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-teal-500 h-2 rounded-full" 
                                style={{ width: `${(test.count / stats.totalRecommendations) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-400 w-8">{test.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* آخرین پیشنهاد */}
                {stats.lastRecommendation && (
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-teal-300">
                        <Zap className="w-5 h-5" />
                        آخرین پیشنهاد بالینی
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-white">{stats.lastRecommendation.testName}</h4>
                        <p className="text-gray-300 text-sm">
                          اولویت: {(stats.lastRecommendation.score * 100).toFixed(0)}%
                        </p>
                        <p className="text-gray-200 italic">
                          {stats.lastRecommendation.reason}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <BarChart3 className="w-16 h-16 text-teal-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">آمار پیشنهادها در دسترس نیست</h3>
                  <p className="text-teal-200">
                    ابتدا پیشنهادهایی تولید کنید تا آمار نمایش داده شود
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-300">
                  <Lightbulb className="w-5 h-5" />
                  بینش‌های بالینی استخراج شده
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.slice(0, 5).map((rec) => (
                    <div key={rec.id} className="bg-black/20 rounded-lg p-4 border border-teal-500/30">
                      <h4 className="text-lg font-semibold text-teal-300 mb-2">
                        {rec.testName}
                      </h4>
                      <p className="text-gray-200 leading-relaxed mb-2">
                        {rec.reason}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>اولویت: {(rec.score * 100).toFixed(0)}%</span>
                        <span>•</span>
                        <span>{new Date(rec.createdAt).toLocaleString("fa-IR")}</span>
                      </div>
                    </div>
                  ))}
                  
                  {recommendations.length === 0 && (
                    <div className="text-center py-8">
                      <Lightbulb className="w-16 h-16 text-teal-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">هنوز بینشی استخراج نشده</h3>
                      <p className="text-teal-200">
                        پیشنهادهایی تولید کنید تا بینش‌های بالینی استخراج شود
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* راهنمای سیستم بالینی */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-300">
                  <BookOpen className="w-5 h-5" />
                  راهنمای سیستم پیشنهاد تست هوشمند
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-teal-500/10 rounded-lg border border-teal-500/30">
                    <h4 className="font-semibold text-teal-300 mb-2">1. تحلیل بالینی</h4>
                    <p className="text-gray-200 text-sm">
                      سیستم بر اساس نتایج تست‌های اخیر، احساسات و الگوهای رفتاری کاربر تحلیل بالینی انجام می‌دهد.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <h4 className="font-semibold text-green-300 mb-2">2. پیشنهاد شخصی‌سازی‌شده</h4>
                    <p className="text-gray-200 text-sm">
                      بر اساس تحلیل بالینی، تست‌های مرتبط با اولویت مشخص پیشنهاد می‌شود.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                    <h4 className="font-semibold text-yellow-300 mb-2">3. استدلال بالینی</h4>
                    <p className="text-gray-200 text-sm">
                      برای هر پیشنهاد، دلیل بالینی و استدلال روانشناختی ارائه می‌شود.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                    <h4 className="font-semibold text-purple-300 mb-2">4. بهبود مداوم</h4>
                    <p className="text-gray-200 text-sm">
                      سیستم با هر تحلیل جدید، دقت پیشنهاداتش را بهبود می‌دهد.
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











