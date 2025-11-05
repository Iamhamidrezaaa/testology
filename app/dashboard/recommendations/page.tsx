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
  TestTube
} from "lucide-react";

interface TestRecommendation {
  testName: string;
  weight: number;
  reason: string;
}

interface BehaviorPattern {
  id: string;
  keyword: string;
  frequency: number;
  sentiment?: number;
  meaning?: string;
  relatedTests?: string;
  createdAt: string;
}

export default function DashboardRecommendations() {
  const [recommendations, setRecommendations] = useState<TestRecommendation[]>([]);
  const [patterns, setPatterns] = useState<BehaviorPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("recommendations");
  
  // در آینده از session گرفته می‌شود
  const userId = "demo-user-123";

  // بارگذاری پیشنهادات
  const loadRecommendations = async () => {
    try {
      const response = await fetch("/api/ai/recommend-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error("خطا در بارگذاری پیشنهادات:", error);
    }
  };

  // بارگذاری الگوهای رفتاری
  const loadPatterns = async () => {
    try {
      const response = await fetch("/api/ai/get-behavior-patterns");
      const data = await response.json();
      
      if (data.success) {
        setPatterns(data.patterns);
      }
    } catch (error) {
      console.error("خطا در بارگذاری الگوها:", error);
    }
  };

  // تحلیل الگوهای رفتاری
  const analyzeBehaviors = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch("/api/ai/analyze-behaviors", { method: "POST" });
      const data = await response.json();
      
      if (data.success) {
        alert("🧠 تحلیل الگوهای رفتاری با موفقیت انجام شد! الگوهای جدید کشف شدند.");
        await loadPatterns();
        await loadRecommendations();
      } else {
        alert("خطا در تحلیل الگوها: " + data.message);
      }
    } catch (error) {
      console.error("خطا در تحلیل الگوها:", error);
      alert("خطا در تحلیل الگوها");
    } finally {
      setAnalyzing(false);
    }
  };

  // بروزرسانی وزن‌ها
  const updateWeights = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch("/api/ai/update-recommendations", { method: "POST" });
      const data = await response.json();
      
      if (data.success) {
        alert("⚖️ وزن‌دهی تست‌ها با موفقیت انجام شد! پیشنهادات بروزرسانی شدند.");
        await loadRecommendations();
      } else {
        alert("خطا در وزن‌دهی: " + data.message);
      }
    } catch (error) {
      console.error("خطا در وزن‌دهی:", error);
      alert("خطا در وزن‌دهی");
    } finally {
      setAnalyzing(false);
    }
  };

  // دریافت رنگ بر اساس وزن
  const getWeightColor = (weight: number) => {
    if (weight >= 0.8) return "bg-red-100 text-red-800";
    if (weight >= 0.6) return "bg-orange-100 text-orange-800";
    if (weight >= 0.4) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  // دریافت آیکون بر اساس وزن
  const getWeightIcon = (weight: number) => {
    if (weight >= 0.8) return <AlertCircle className="w-4 h-4 text-red-600" />;
    if (weight >= 0.6) return <AlertCircle className="w-4 h-4 text-orange-600" />;
    if (weight >= 0.4) return <CheckCircle className="w-4 h-4 text-yellow-600" />;
    return <CheckCircle className="w-4 h-4 text-green-600" />;
  };

  // دریافت رنگ بر اساس احساس
  const getSentimentColor = (sentiment?: number) => {
    if (!sentiment) return "bg-gray-100 text-gray-800";
    
    if (sentiment > 0.5) return "bg-green-100 text-green-800";
    if (sentiment < -0.5) return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadRecommendations(), loadPatterns()]);
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
            🩺 Recommended Tests
          </h1>
          <p className="text-xl text-teal-200 mb-6">
            سیستم پیشنهاد تست هوشمند - تحلیل بالینی داده‌محور Testology
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button
              onClick={analyzeBehaviors}
              disabled={analyzing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-lg font-semibold"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                  تحلیل الگوها...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  🧠 تحلیل الگوهای رفتاری
                </>
              )}
            </Button>
            
            <Button
              onClick={updateWeights}
              disabled={analyzing}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl text-lg font-semibold"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                  وزن‌دهی...
                </>
              ) : (
                <>
                  <Target className="w-5 h-5 mr-2" />
                  ⚖️ بروزرسانی وزن‌ها
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="recommendations">🩺 پیشنهادات</TabsTrigger>
            <TabsTrigger value="patterns">🧠 الگوها</TabsTrigger>
            <TabsTrigger value="insights">💡 بینش‌ها</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            {loading ? (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p>در حال بارگذاری پیشنهادات...</p>
                </CardContent>
              </Card>
            ) : recommendations.length === 0 ? (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <Stethoscope className="w-16 h-16 text-teal-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">هنوز پیشنهادی تولید نشده</h3>
                  <p className="text-teal-200 mb-4">
                    ابتدا الگوهای رفتاری را تحلیل کنید، سپس وزن‌ها را بروزرسانی کنید
                  </p>
                </CardContent>
              </Card>
            ) : (
              recommendations.map((rec, index) => (
                <Card key={index} className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold text-teal-300 mb-2">
                          {rec.testName}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-teal-200">
                          <Target className="w-4 h-4" />
                          <span>وزن: {(rec.weight * 100).toFixed(0)}%</span>
                          <Badge className={getWeightColor(rec.weight)}>
                            {getWeightIcon(rec.weight)}
                            <span className="ml-1">{(rec.weight * 100).toFixed(0)}%</span>
                          </Badge>
                        </div>
                      </div>
                      <Badge className="bg-teal-100 text-teal-800">
                        #{index + 1}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* دلیل پیشنهاد */}
                    <div className="bg-teal-500/10 rounded-lg p-4 border border-teal-500/30">
                      <h4 className="text-lg font-semibold text-teal-300 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        دلیل پیشنهاد
                      </h4>
                      <p className="text-gray-200 leading-relaxed">
                        {rec.reason}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            {loading ? (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p>در حال بارگذاری الگوها...</p>
                </CardContent>
              </Card>
            ) : patterns.length === 0 ? (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <Brain className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">هنوز الگویی کشف نشده</h3>
                  <p className="text-indigo-200 mb-4">
                    روی دکمه "تحلیل الگوهای رفتاری" کلیک کنید
                  </p>
                </CardContent>
              </Card>
            ) : (
              patterns.map((pattern) => (
                <Card key={pattern.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold text-indigo-300 mb-2">
                          {pattern.keyword}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-indigo-200">
                          <Target className="w-4 h-4" />
                          <span>فرکانس: {pattern.frequency}</span>
                          {pattern.sentiment && (
                            <>
                              <span>•</span>
                              <Badge className={getSentimentColor(pattern.sentiment)}>
                                احساس: {pattern.sentiment.toFixed(2)}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                      <Badge className="bg-indigo-100 text-indigo-800">
                        {pattern.frequency} بار
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* تفسیر بالینی */}
                    {pattern.meaning && (
                      <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/30">
                        <h4 className="text-lg font-semibold text-indigo-300 mb-3 flex items-center gap-2">
                          <Brain className="w-5 h-5" />
                          تفسیر بالینی
                        </h4>
                        <p className="text-gray-200 leading-relaxed">
                          {pattern.meaning}
                        </p>
                      </div>
                    )}

                    {/* تست‌های مرتبط */}
                    {pattern.relatedTests && (
                      <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                        <h4 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
                          <TestTube className="w-5 h-5" />
                          تست‌های مرتبط
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {JSON.parse(pattern.relatedTests).map((test: string, index: number) => (
                            <Badge key={index} className="bg-green-100 text-green-800">
                              {test}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-300">
                  <Lightbulb className="w-5 h-5" />
                  بینش‌های استخراج شده از الگوهای رفتاری
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patterns.slice(0, 5).map((pattern) => (
                    <div key={pattern.id} className="bg-black/20 rounded-lg p-4 border border-teal-500/30">
                      <h4 className="text-lg font-semibold text-teal-300 mb-2">
                        الگو: {pattern.keyword}
                      </h4>
                      <p className="text-gray-200 leading-relaxed mb-2">
                        {pattern.meaning}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>فرکانس: {pattern.frequency}</span>
                        {pattern.sentiment && (
                          <span>احساس: {pattern.sentiment.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {patterns.length === 0 && (
                    <div className="text-center py-8">
                      <Lightbulb className="w-16 h-16 text-teal-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">هنوز بینشی استخراج نشده</h3>
                      <p className="text-teal-200">
                        الگوهایی کشف کنید تا بینش‌های بالینی استخراج شود
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* راهنمای سیستم */}
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
                    <h4 className="font-semibold text-teal-300 mb-2">1. تحلیل الگوهای رفتاری</h4>
                    <p className="text-gray-200 text-sm">
                      سیستم داده‌های تست‌های کاربران را تحلیل می‌کند و الگوهای رفتاری تکراری را شناسایی می‌کند.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <h4 className="font-semibold text-green-300 mb-2">2. وزن‌دهی تست‌ها</h4>
                    <p className="text-gray-200 text-sm">
                      بر اساس الگوهای کشف شده، وزن تست‌ها محاسبه و بروزرسانی می‌شود.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                    <h4 className="font-semibold text-yellow-300 mb-2">3. پیشنهاد شخصی‌سازی‌شده</h4>
                    <p className="text-gray-200 text-sm">
                      بر اساس وزن‌ها و تاریخچه تست‌های کاربر، پیشنهادات شخصی‌سازی‌شده ارائه می‌شود.
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











