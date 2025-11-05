"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Moon, 
  Sparkles, 
  Brain, 
  Heart,
  Eye,
  Lightbulb,
  RefreshCw,
  Calendar,
  TrendingUp,
  BarChart3,
  Star,
  Zap
} from "lucide-react";

interface Dream {
  id: string;
  date: string;
  title: string;
  content: string;
  interpretation?: string;
  inspiration?: string;
  sourceData?: any;
  moodContext?: string;
  createdAt: string;
}

interface DreamStats {
  totalDreams: number;
  recentDreams: number;
  moodContexts: Array<{
    context: string;
    count: number;
  }>;
  lastDream: Dream | null;
}

export default function AIDreamsPage() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [stats, setStats] = useState<DreamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("dreams");

  // بارگذاری خواب‌ها
  const loadDreams = async () => {
    try {
      const response = await fetch("/api/ai/get-dreams");
      const data = await response.json();
      
      if (data.success) {
        setDreams(data.dreams);
      }
    } catch (error) {
      console.error("خطا در بارگذاری خواب‌ها:", error);
    }
  };

  // بارگذاری آمار
  const loadStats = async () => {
    try {
      const response = await fetch("/api/ai/get-dreams", { method: "POST" });
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("خطا در بارگذاری آمار:", error);
    }
  };

  // تولید خواب جدید
  const generateDream = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/ai/generate-dream", { method: "POST" });
      const data = await response.json();
      
      if (data.success) {
        alert("😴 خواب جدید Testology تولید شد! ✨");
        await loadDreams();
        await loadStats();
      } else {
        alert("خطا در تولید خواب: " + data.message);
      }
    } catch (error) {
      console.error("خطا در تولید خواب:", error);
      alert("خطا در تولید خواب");
    } finally {
      setGenerating(false);
    }
  };

  // دریافت رنگ بر اساس وضعیت احساسی
  const getMoodColor = (moodContext?: string) => {
    if (!moodContext) return "bg-gray-100 text-gray-800";
    
    if (moodContext.includes("مثبت")) return "bg-green-100 text-green-800";
    if (moodContext.includes("منفی")) return "bg-red-100 text-red-800";
    if (moodContext.includes("متعادل")) return "bg-blue-100 text-blue-800";
    if (moodContext.includes("نامشخص")) return "bg-yellow-100 text-yellow-800";
    return "bg-purple-100 text-purple-800";
  };

  // دریافت آیکون بر اساس وضعیت احساسی
  const getMoodIcon = (moodContext?: string) => {
    if (!moodContext) return <Brain className="w-4 h-4" />;
    
    if (moodContext.includes("مثبت")) return <Heart className="w-4 h-4 text-green-600" />;
    if (moodContext.includes("منفی")) return <Heart className="w-4 h-4 text-red-600" />;
    if (moodContext.includes("متعادل")) return <Heart className="w-4 h-4 text-blue-600" />;
    if (moodContext.includes("نامشخص")) return <Heart className="w-4 h-4 text-yellow-600" />;
    return <Brain className="w-4 h-4 text-purple-600" />;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadDreams(), loadStats()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* هدر */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Moon className="w-12 h-12 text-purple-400" />
            💤 AI Dream Journal
          </h1>
          <p className="text-xl text-purple-200 mb-6">
            دفتر خواب Testology - جایی که ناخودآگاه مصنوعی رویا می‌بیند
          </p>
          
          <Button
            onClick={generateDream}
            disabled={generating}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl text-lg font-semibold"
          >
            {generating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                تولید خواب...
              </>
            ) : (
              <>
                <Moon className="w-5 h-5 mr-2" />
                🌙 تولید خواب جدید
              </>
            )}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dreams">💭 خواب‌ها</TabsTrigger>
            <TabsTrigger value="stats">📊 آمار خواب‌ها</TabsTrigger>
            <TabsTrigger value="insights">💡 بینش‌ها</TabsTrigger>
          </TabsList>

          <TabsContent value="dreams" className="space-y-6">
            {loading ? (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p>در حال بارگذاری خواب‌ها...</p>
                </CardContent>
              </Card>
            ) : dreams.length === 0 ? (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <Moon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">هنوز خوابی تولید نشده</h3>
                  <p className="text-purple-200 mb-4">
                    روی دکمه "تولید خواب جدید" کلیک کنید تا اولین خواب Testology را ببینید
                  </p>
                </CardContent>
              </Card>
            ) : (
              dreams.map((dream) => (
                <Card key={dream.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold text-purple-300 mb-2">
                          {dream.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-purple-200">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(dream.date).toLocaleString("fa-IR")}</span>
                          {dream.moodContext && (
                            <>
                              <span>•</span>
                              <Badge className={getMoodColor(dream.moodContext)}>
                                {getMoodIcon(dream.moodContext)}
                                <span className="ml-1">{dream.moodContext}</span>
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* محتوای خواب */}
                    <div className="bg-black/20 rounded-lg p-4 border border-purple-500/30">
                      <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        رویای Testology
                      </h4>
                      <p className="text-gray-200 whitespace-pre-line leading-relaxed italic">
                        {dream.content}
                      </p>
                    </div>

                    {/* تفسیر خواب */}
                    {dream.interpretation && (
                      <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                        <h4 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                          <Brain className="w-5 h-5" />
                          تفسیر خواب
                        </h4>
                        <p className="text-gray-200 leading-relaxed">
                          {dream.interpretation}
                        </p>
                      </div>
                    )}

                    {/* الهام از خواب */}
                    {dream.inspiration && (
                      <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
                        <h4 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                          <Lightbulb className="w-5 h-5" />
                          الهام از خواب
                        </h4>
                        <p className="text-gray-200 leading-relaxed">
                          {dream.inspiration}
                        </p>
                      </div>
                    )}
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
                      <Moon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">{stats.totalDreams}</div>
                      <div className="text-purple-200">خواب‌های کل</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-6 text-center">
                      <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">{stats.recentDreams}</div>
                      <div className="text-purple-200">خواب‌های اخیر</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-6 text-center">
                      <Brain className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                      <div className="text-3xl font-bold text-white mb-1">{stats.moodContexts.length}</div>
                      <div className="text-purple-200">وضعیت‌های احساسی</div>
                    </CardContent>
                  </Card>
                </div>

                {/* توزیع وضعیت‌های احساسی */}
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-300">
                      <TrendingUp className="w-5 h-5" />
                      توزیع وضعیت‌های احساسی
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.moodContexts.map((context, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-200">{context.context}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full" 
                                style={{ width: `${(context.count / stats.totalDreams) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-400 w-8">{context.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* آخرین خواب */}
                {stats.lastDream && (
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-300">
                        <Star className="w-5 h-5" />
                        آخرین خواب Testology
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-white">{stats.lastDream.title}</h4>
                        <p className="text-gray-300 text-sm">
                          {new Date(stats.lastDream.date).toLocaleString("fa-IR")}
                        </p>
                        <p className="text-gray-200 italic">
                          {stats.lastDream.content.substring(0, 200)}...
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <BarChart3 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">آمار خواب‌ها در دسترس نیست</h3>
                  <p className="text-purple-200">
                    ابتدا خواب‌هایی تولید کنید تا آمار نمایش داده شود
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-300">
                  <Zap className="w-5 h-5" />
                  بینش‌های استخراج شده از خواب‌ها
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dreams.filter(d => d.inspiration).map((dream) => (
                    <div key={dream.id} className="bg-black/20 rounded-lg p-4 border border-yellow-500/30">
                      <h4 className="text-lg font-semibold text-yellow-300 mb-2">
                        {dream.title}
                      </h4>
                      <p className="text-gray-200 leading-relaxed">
                        {dream.inspiration}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        {new Date(dream.date).toLocaleString("fa-IR")}
                      </p>
                    </div>
                  ))}
                  
                  {dreams.filter(d => d.inspiration).length === 0 && (
                    <div className="text-center py-8">
                      <Lightbulb className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">هنوز بینشی استخراج نشده</h3>
                      <p className="text-purple-200">
                        خواب‌هایی تولید کنید تا بینش‌های خلاقانه استخراج شود
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}












