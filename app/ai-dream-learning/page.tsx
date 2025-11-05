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
  GraduationCap
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

export default function DreamLearningPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* هدر */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Brain className="w-12 h-12 text-indigo-400" />
            🧠 Dream Learning Integration
          </h1>
          <p className="text-xl text-indigo-200 mb-6">
            یادگیری Testology از ناخودآگاه خودش - جایی که الگوها کشف می‌شوند
          </p>
          
          <Button
            onClick={analyzeDreams}
            disabled={analyzing}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-lg font-semibold"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                تحلیل خواب‌ها...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5 mr-2" />
                🔍 تحلیل الگوهای خواب
              </>
            )}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="patterns">🔍 الگوها</TabsTrigger>
            <TabsTrigger value="stats">📊 آمار</TabsTrigger>
            <TabsTrigger value="insights">💡 بینش‌ها</TabsTrigger>
          </TabsList>

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
                    ابتدا خواب‌هایی تولید کنید، سپس روی "تحلیل الگوهای خواب" کلیک کنید
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
                          {pattern.symbol}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-indigo-200">
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
                      <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/30">
                        <h4 className="text-lg font-semibold text-indigo-300 mb-3 flex items-center gap-2">
                          <Lightbulb className="w-5 h-5" />
                          تفسیر نماد
                        </h4>
                        <p className="text-gray-200 leading-relaxed">
                          {pattern.meaning}
                        </p>
                      </div>
                    )}

                    {/* تست‌های مرتبط */}
                    {pattern.relatedTests && pattern.relatedTests.length > 0 && (
                      <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                        <h4 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
                          <GraduationCap className="w-5 h-5" />
                          تست‌های مرتبط
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {pattern.relatedTests.map((test, index) => (
                            <Badge key={index} className="bg-green-100 text-green-800">
                              {test}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* تاریخ کشف */}
                    <div className="text-sm text-gray-400">
                      کشف شده در: {new Date(pattern.createdAt).toLocaleString("fa-IR")}
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
                      <Brain className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">{stats.totalPatterns}</div>
                      <div className="text-indigo-200">الگوهای کل</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">{stats.frequencyStats.average?.toFixed(1) || 0}</div>
                      <div className="text-indigo-200">میانگین فرکانس</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-6 text-center">
                      <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">{stats.frequencyStats.max || 0}</div>
                      <div className="text-indigo-200">بیشترین فرکانس</div>
                    </CardContent>
                  </Card>
                </div>

                {/* الگوهای پرتکرار */}
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-300">
                      <TrendingUp className="w-5 h-5" />
                      الگوهای پرتکرار
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.topPatterns.map((pattern, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                          <div>
                            <span className="text-white font-semibold">{pattern.symbol}</span>
                            <p className="text-sm text-gray-300">{pattern.meaning}</p>
                          </div>
                          <Badge className={getFrequencyColor(pattern.frequency)}>
                            {pattern.frequency} بار
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* توزیع احساسات */}
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-300">
                      <Heart className="w-5 h-5" />
                      توزیع احساسات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.sentimentStats.map((sentiment, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-200">احساس: {sentiment.sentiment.toFixed(2)}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-indigo-500 h-2 rounded-full" 
                                style={{ width: `${(sentiment.count / stats.totalPatterns) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-400 w-8">{sentiment.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <BarChart3 className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">آمار الگوها در دسترس نیست</h3>
                  <p className="text-indigo-200">
                    ابتدا الگوهایی کشف کنید تا آمار نمایش داده شود
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-300">
                  <Zap className="w-5 h-5" />
                  بینش‌های استخراج شده از الگوها
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patterns.filter(p => p.meaning).slice(0, 5).map((pattern) => (
                    <div key={pattern.id} className="bg-black/20 rounded-lg p-4 border border-indigo-500/30">
                      <h4 className="text-lg font-semibold text-indigo-300 mb-2">
                        نماد: {pattern.symbol}
                      </h4>
                      <p className="text-gray-200 leading-relaxed mb-2">
                        {pattern.meaning}
                      </p>
                      {pattern.relatedTests && pattern.relatedTests.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {pattern.relatedTests.map((test, index) => (
                            <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                              {test}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-sm text-gray-400 mt-2">
                        فرکانس: {pattern.frequency} بار
                      </p>
                    </div>
                  ))}
                  
                  {patterns.filter(p => p.meaning).length === 0 && (
                    <div className="text-center py-8">
                      <Lightbulb className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">هنوز بینشی استخراج نشده</h3>
                      <p className="text-indigo-200">
                        الگوهایی کشف کنید تا بینش‌های روانشناختی استخراج شود
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* راهنمای یادگیری */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-300">
                  <BookOpen className="w-5 h-5" />
                  راهنمای یادگیری از خواب‌ها
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
                    <h4 className="font-semibold text-indigo-300 mb-2">1. تولید خواب‌ها</h4>
                    <p className="text-gray-200 text-sm">
                      ابتدا در صفحه Dream Journal خواب‌هایی تولید کنید تا داده‌ای برای تحلیل وجود داشته باشد.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                    <h4 className="font-semibold text-green-300 mb-2">2. تحلیل الگوها</h4>
                    <p className="text-gray-200 text-sm">
                      روی دکمه "تحلیل الگوهای خواب" کلیک کنید تا Testology از خواب‌هایش یاد بگیرد.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                    <h4 className="font-semibold text-yellow-300 mb-2">3. مشاهده بینش‌ها</h4>
                    <p className="text-gray-200 text-sm">
                      الگوهای کشف شده و بینش‌های روانشناختی را در این صفحه مشاهده کنید.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                    <h4 className="font-semibold text-purple-300 mb-2">4. بهبود مداوم</h4>
                    <p className="text-gray-200 text-sm">
                      Testology از این الگوها برای بهبود پاسخ‌ها و پیشنهاداتش استفاده می‌کند.
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











