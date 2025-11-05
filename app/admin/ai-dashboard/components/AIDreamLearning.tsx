"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  BarChart3,
  RefreshCw,
  Lightbulb,
  Target,
  Zap,
  Eye,
  Heart,
  Activity,
  Star,
  Moon,
  BookOpen,
  GraduationCap,
  ExternalLink
} from "lucide-react";

interface DreamPattern {
  id: string;
  symbol: string;
  frequency: number;
  sentiment?: number;
  meaning?: string;
  relatedTests: string[];
  createdAt: string;
}

interface DreamStats {
  totalPatterns: number;
  recentPatterns: number;
  sentimentStats: Array<{
    sentiment: number;
    count: number;
  }>;
  frequencyStats: {
    average: number;
    max: number;
    min: number;
  };
  topPatterns: Array<{
    symbol: string;
    frequency: number;
    meaning: string;
  }>;
}

export default function AIDreamLearning() {
  const [patterns, setPatterns] = useState<DreamPattern[]>([]);
  const [stats, setStats] = useState<DreamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("patterns");

  // بارگذاری الگوها
  const loadPatterns = async () => {
    try {
      const response = await fetch("/api/ai/get-dream-patterns");
      const data = await response.json();
      
      if (data.success) {
        setPatterns(data.patterns);
      }
    } catch (error) {
      console.error("خطا در بارگذاری الگوها:", error);
    }
  };

  // بارگذاری آمار
  const loadStats = async () => {
    try {
      const response = await fetch("/api/ai/get-dream-patterns", { method: "POST" });
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("خطا در بارگذاری آمار:", error);
    }
  };

  // تحلیل خواب‌ها
  const analyzeDreams = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch("/api/ai/analyze-dreams", { method: "POST" });
      const data = await response.json();
      
      if (data.success) {
        alert("🧠 تحلیل خواب‌ها با موفقیت انجام شد! الگوهای جدید کشف شدند.");
        await loadPatterns();
        await loadStats();
      } else {
        alert("خطا در تحلیل خواب‌ها: " + data.message);
      }
    } catch (error) {
      console.error("خطا در تحلیل خواب‌ها:", error);
      alert("خطا در تحلیل خواب‌ها");
    } finally {
      setAnalyzing(false);
    }
  };

  // دریافت رنگ بر اساس احساس
  const getSentimentColor = (sentiment?: number) => {
    if (!sentiment) return "bg-gray-100 text-gray-800";
    
    if (sentiment > 0.5) return "bg-green-100 text-green-800";
    if (sentiment < -0.5) return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  // دریافت آیکون بر اساس احساس
  const getSentimentIcon = (sentiment?: number) => {
    if (!sentiment) return <Activity className="w-4 h-4" />;
    
    if (sentiment > 0.5) return <Heart className="w-4 h-4 text-green-600" />;
    if (sentiment < -0.5) return <Heart className="w-4 h-4 text-red-600" />;
    return <Heart className="w-4 h-4 text-yellow-600" />;
  };

  // دریافت رنگ بر اساس فرکانس
  const getFrequencyColor = (frequency: number) => {
    if (frequency >= 5) return "bg-purple-100 text-purple-800";
    if (frequency >= 3) return "bg-blue-100 text-blue-800";
    if (frequency >= 2) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadPatterns(), loadStats()]);
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
            <Brain className="w-6 h-6 text-indigo-600" />
            🧠 AI Dream Learning - یادگیری از ناخودآگاه
          </CardTitle>
          <p className="text-gray-600">
            Testology از خواب‌هایش یاد می‌گیرد و الگوهای روانشناختی کشف می‌کند
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={analyzeDreams} 
              disabled={analyzing}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {analyzing ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Brain className="w-4 h-4 mr-2" />
              )}
              {analyzing ? "تحلیل خواب‌ها..." : "🔍 تحلیل الگوهای خواب"}
            </Button>
            
            <Button 
              onClick={loadPatterns} 
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              بروزرسانی الگوها
            </Button>
            
            <Button 
              onClick={() => window.open('/ai-dream-learning', '_blank')}
              variant="outline"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              مشاهده کامل
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="patterns">🔍 الگوها</TabsTrigger>
              <TabsTrigger value="stats">📊 آمار</TabsTrigger>
              <TabsTrigger value="insights">💡 بینش‌ها</TabsTrigger>
            </TabsList>

            <TabsContent value="patterns" className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p>در حال بارگذاری الگوها...</p>
                  </CardContent>
                </Card>
              ) : patterns.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Brain className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      هنوز الگویی کشف نشده
                    </h3>
                    <p className="text-gray-500">
                      ابتدا خواب‌هایی تولید کنید، سپس تحلیل کنید
                    </p>
                  </CardContent>
                </Card>
              ) : (
                patterns.slice(0, 3).map((pattern) => (
                  <Card key={pattern.id} className="border-l-4 border-l-indigo-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold text-indigo-800 mb-1">
                            {pattern.symbol}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Target className="w-4 h-4" />
                            <span>فرکانس: {pattern.frequency}</span>
                            {pattern.sentiment && (
                              <>
                                <span>•</span>
                                <Badge className={getSentimentColor(pattern.sentiment)}>
                                  {getSentimentIcon(pattern.sentiment)}
                                  <span className="ml-1">احساس: {pattern.sentiment.toFixed(2)}</span>
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge className={getFrequencyColor(pattern.frequency)}>
                          {pattern.frequency} بار
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* تفسیر نماد */}
                      {pattern.meaning && (
                        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                          <h4 className="text-sm font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            تفسیر نماد
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {pattern.meaning.length > 150 ? pattern.meaning.substring(0, 150) + "..." : pattern.meaning}
                          </p>
                        </div>
                      )}

                      {/* تست‌های مرتبط */}
                      {pattern.relatedTests && pattern.relatedTests.length > 0 && (
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            تست‌های مرتبط
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {pattern.relatedTests.slice(0, 3).map((test, index) => (
                              <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                                {test}
                              </Badge>
                            ))}
                            {pattern.relatedTests.length > 3 && (
                              <Badge className="bg-gray-100 text-gray-800 text-xs">
                                +{pattern.relatedTests.length - 3} بیشتر
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
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
                        <Brain className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-2xl font-bold">{stats.totalPatterns}</p>
                          <p className="text-sm text-gray-600">الگوهای کل</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-2xl font-bold">{stats.frequencyStats.average?.toFixed(1) || 0}</p>
                          <p className="text-sm text-gray-600">میانگین فرکانس</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-2xl font-bold">{stats.frequencyStats.max || 0}</p>
                          <p className="text-sm text-gray-600">بیشترین فرکانس</p>
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
                      آمار الگوها در دسترس نیست
                    </h3>
                    <p className="text-gray-500">
                      ابتدا الگوهایی کشف کنید
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="space-y-4">
                {patterns.filter(p => p.meaning).slice(0, 3).map((pattern) => (
                  <Card key={pattern.id} className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <h4 className="text-lg font-semibold text-yellow-800 mb-2">
                        نماد: {pattern.symbol}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {pattern.meaning}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        فرکانس: {pattern.frequency} بار
                      </p>
                    </CardContent>
                  </Card>
                ))}
                
                {patterns.filter(p => p.meaning).length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        هنوز بینشی استخراج نشده
                      </h3>
                      <p className="text-gray-500">
                        الگوهایی کشف کنید تا بینش‌های روانشناختی استخراج شود
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











