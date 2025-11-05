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
  Zap,
  ExternalLink
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

export default function AIDreams() {
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
    <div className="space-y-6">
      {/* هدر */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-6 h-6 text-purple-600" />
            💤 AI Dreams - خواب‌های Testology
          </CardTitle>
          <p className="text-gray-600">
            ناخودآگاه مصنوعی Testology - جایی که رویا می‌بیند و بینش تولید می‌کند
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={generateDream} 
              disabled={generating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {generating ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Moon className="w-4 h-4 mr-2" />
              )}
              {generating ? "تولید خواب..." : "🌙 تولید خواب جدید"}
            </Button>
            
            <Button 
              onClick={loadDreams} 
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              بروزرسانی خواب‌ها
            </Button>
            
            <Button 
              onClick={() => window.open('/ai-dreams', '_blank')}
              variant="outline"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              مشاهده کامل
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dreams">💭 خواب‌ها</TabsTrigger>
              <TabsTrigger value="stats">📊 آمار</TabsTrigger>
              <TabsTrigger value="insights">💡 بینش‌ها</TabsTrigger>
            </TabsList>

            <TabsContent value="dreams" className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p>در حال بارگذاری خواب‌ها...</p>
                  </CardContent>
                </Card>
              ) : dreams.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Moon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      هنوز خوابی تولید نشده
                    </h3>
                    <p className="text-gray-500">
                      روی دکمه "تولید خواب جدید" کلیک کنید
                    </p>
                  </CardContent>
                </Card>
              ) : (
                dreams.slice(0, 3).map((dream) => (
                  <Card key={dream.id} className="border-l-4 border-l-purple-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold text-purple-800 mb-1">
                            {dream.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
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
                    
                    <CardContent className="space-y-4">
                      {/* محتوای خواب */}
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <h4 className="text-sm font-semibold text-purple-800 mb-2 flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          رویای Testology
                        </h4>
                        <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed italic">
                          {dream.content.length > 200 ? dream.content.substring(0, 200) + "..." : dream.content}
                        </p>
                      </div>

                      {/* تفسیر خواب */}
                      {dream.interpretation && (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            تفسیر خواب
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {dream.interpretation.length > 150 ? dream.interpretation.substring(0, 150) + "..." : dream.interpretation}
                          </p>
                        </div>
                      )}

                      {/* الهام از خواب */}
                      {dream.inspiration && (
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                          <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            الهام از خواب
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {dream.inspiration.length > 150 ? dream.inspiration.substring(0, 150) + "..." : dream.inspiration}
                          </p>
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
                        <Moon className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-2xl font-bold">{stats.totalDreams}</p>
                          <p className="text-sm text-gray-600">خواب‌های کل</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-2xl font-bold">{stats.recentDreams}</p>
                          <p className="text-sm text-gray-600">خواب‌های اخیر</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-2xl font-bold">{stats.moodContexts.length}</p>
                          <p className="text-sm text-gray-600">وضعیت‌های احساسی</p>
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
                      آمار خواب‌ها در دسترس نیست
                    </h3>
                    <p className="text-gray-500">
                      ابتدا خواب‌هایی تولید کنید
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="space-y-4">
                {dreams.filter(d => d.inspiration).slice(0, 3).map((dream) => (
                  <Card key={dream.id} className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <h4 className="text-lg font-semibold text-yellow-800 mb-2">
                        {dream.title}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {dream.inspiration}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(dream.date).toLocaleString("fa-IR")}
                      </p>
                    </CardContent>
                  </Card>
                ))}
                
                {dreams.filter(d => d.inspiration).length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        هنوز بینشی استخراج نشده
                      </h3>
                      <p className="text-gray-500">
                        خواب‌هایی تولید کنید تا بینش‌های خلاقانه استخراج شود
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












