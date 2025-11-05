"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Heart, 
  Target, 
  Star,
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  Radar as RadarIcon,
  Calendar,
  Clock,
  Users,
  Award,
  Zap,
  Shield,
  Eye,
  MessageSquare,
  BookOpen,
  Download,
  RefreshCw,
  Filter,
  Search,
  Settings,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

interface BehavioralInsight {
  id: string;
  category: string;
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  trend: 'improving' | 'stable' | 'declining';
  recommendation: string;
  createdAt: string;
  tags: string[];
}

interface PersonalityTrait {
  name: string;
  score: number;
  description: string;
  color: string;
}

interface BehavioralPattern {
  pattern: string;
  frequency: number;
  intensity: number;
  context: string;
  suggestion: string;
}

interface ProgressMetric {
  metric: string;
  current: number;
  previous: number;
  change: number;
  target: number;
  unit: string;
}

export default function BehavioralInsightsPage() {
  const [insights, setInsights] = useState<BehavioralInsight[]>([]);
  const [personalityTraits, setPersonalityTraits] = useState<PersonalityTrait[]>([]);
  const [behavioralPatterns, setBehavioralPatterns] = useState<BehavioralPattern[]>([]);
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [timeRange, setTimeRange] = useState("30");

  // دریافت داده‌های بینش‌های رفتاری
  const fetchInsights = async () => {
    try {
      setLoading(true);
      const userEmail = localStorage.getItem("testology_email");
      
      if (!userEmail) {
        console.error("ایمیل کاربر یافت نشد");
        return;
      }

      const response = await fetch(`/api/user/behavioral-insights?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      
      if (data.success) {
        setInsights(data.insights || []);
        setPersonalityTraits(data.personalityTraits || []);
        setBehavioralPatterns(data.behavioralPatterns || []);
        setProgressMetrics(data.progressMetrics || []);
      }
    } catch (error) {
      console.error("خطا در دریافت بینش‌های رفتاری:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [selectedCategory, timeRange]);

  // رنگ‌ها برای نمودارها
  const colors = {
    primary: "#3b82f6",
    secondary: "#8b5cf6", 
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#06b6d4",
    purple: "#8b5cf6",
    pink: "#ec4899",
    indigo: "#6366f1",
    teal: "#14b8a6"
  };

  // داده‌های نمونه برای نمودارها
  const chartData = [
    { date: "1403/01/01", anxiety: 65, mood: 70, focus: 60, selfEsteem: 55, motivation: 75 },
    { date: "1403/01/02", anxiety: 60, mood: 75, focus: 65, selfEsteem: 60, motivation: 80 },
    { date: "1403/01/03", anxiety: 55, mood: 80, focus: 70, selfEsteem: 65, motivation: 85 },
    { date: "1403/01/04", anxiety: 50, mood: 85, focus: 75, selfEsteem: 70, motivation: 90 },
    { date: "1403/01/05", anxiety: 45, mood: 90, focus: 80, selfEsteem: 75, motivation: 95 },
    { date: "1403/01/06", anxiety: 40, mood: 85, focus: 85, selfEsteem: 80, motivation: 90 },
    { date: "1403/01/07", anxiety: 35, mood: 80, focus: 90, selfEsteem: 85, motivation: 85 }
  ];

  const personalityData = [
    { trait: "برون‌گرایی", score: 75, fullMark: 100 },
    { trait: "وجدان‌گرایی", score: 85, fullMark: 100 },
    { trait: "باز بودن به تجربه", score: 70, fullMark: 100 },
    { trait: "توافق‌پذیری", score: 80, fullMark: 100 },
    { trait: "روان‌رنجوری", score: 40, fullMark: 100 }
  ];

  const patternData = [
    { pattern: "اضطراب صبحگاهی", frequency: 85, intensity: 70 },
    { pattern: "افزایش انرژی عصر", frequency: 90, intensity: 80 },
    { pattern: "کاهش تمرکز بعد از ناهار", frequency: 75, intensity: 60 },
    { pattern: "بهبود خلق در طبیعت", frequency: 95, intensity: 85 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">در حال تحلیل بینش‌های رفتاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto p-8">
        {/* هدر */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                بینش‌های رفتاری
              </h1>
              <p className="text-xl text-gray-300 mt-2">
                تحلیل عمیق الگوهای رفتاری و شخصیتی شما
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button
              onClick={fetchInsights}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-lg font-semibold"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              بروزرسانی تحلیل
            </Button>
            
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white/10 px-8 py-3 rounded-xl text-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              دانلود گزارش
            </Button>
          </div>
        </div>

        {/* فیلترها */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <label className="text-gray-300">دسته‌بندی:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            >
              <option value="all">همه</option>
              <option value="personality">شخصیت</option>
              <option value="mood">خلق و خو</option>
              <option value="anxiety">اضطراب</option>
              <option value="focus">تمرکز</option>
              <option value="social">اجتماعی</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <label className="text-gray-300">بازه زمانی:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            >
              <option value="7">7 روز گذشته</option>
              <option value="30">30 روز گذشته</option>
              <option value="90">90 روز گذشته</option>
              <option value="365">یک سال گذشته</option>
            </select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 border border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
              <Eye className="w-4 h-4 mr-2" />
              نمای کلی
            </TabsTrigger>
            <TabsTrigger value="personality" className="data-[state=active]:bg-white/20">
              <Brain className="w-4 h-4 mr-2" />
              شخصیت
            </TabsTrigger>
            <TabsTrigger value="patterns" className="data-[state=active]:bg-white/20">
              <Activity className="w-4 h-4 mr-2" />
              الگوها
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-white/20">
              <TrendingUp className="w-4 h-4 mr-2" />
              پیشرفت
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-white/20">
              <Lightbulb className="w-4 h-4 mr-2" />
              توصیه‌ها
            </TabsTrigger>
          </TabsList>

          {/* نمای کلی */}
          <TabsContent value="overview" className="space-y-8">
            {/* آمار کلی */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-400/30">
                <CardContent className="p-6 text-center">
                  <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">12</div>
                  <div className="text-blue-200">بینش کشف شده</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400/30">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">+15%</div>
                  <div className="text-green-200">بهبود کلی</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-400/30">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">8</div>
                  <div className="text-purple-200">هدف فعال</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-400/30">
                <CardContent className="p-6 text-center">
                  <Award className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">85%</div>
                  <div className="text-orange-200">دقت تحلیل</div>
                </CardContent>
              </Card>
            </div>

            {/* نمودار روند کلی */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <LineChartIcon className="w-8 h-8 text-blue-400" />
                  روند کلی روان‌شناختی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="anxiety" stroke={colors.danger} strokeWidth={3} dot={{ r: 6 }} name="اضطراب" />
                    <Line type="monotone" dataKey="mood" stroke={colors.success} strokeWidth={3} dot={{ r: 6 }} name="خلق و خو" />
                    <Line type="monotone" dataKey="focus" stroke={colors.primary} strokeWidth={3} dot={{ r: 6 }} name="تمرکز" />
                    <Line type="monotone" dataKey="selfEsteem" stroke={colors.purple} strokeWidth={3} dot={{ r: 6 }} name="عزت نفس" />
                    <Line type="monotone" dataKey="motivation" stroke={colors.warning} strokeWidth={3} dot={{ r: 6 }} name="انگیزه" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* بینش‌های کلیدی */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-400">
                    <CheckCircle className="w-6 h-6" />
                    نقاط قوت
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="font-semibold text-white">مدیریت اضطراب</div>
                      <div className="text-sm text-green-200">15% بهبود در 30 روز گذشته</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                    <Heart className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="font-semibold text-white">خلق و خو</div>
                      <div className="text-sm text-green-200">ثبات عاطفی بالا</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-orange-400">
                    <AlertTriangle className="w-6 h-6" />
                    نقاط بهبود
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg">
                    <Target className="w-5 h-5 text-orange-400" />
                    <div>
                      <div className="font-semibold text-white">تمرکز</div>
                      <div className="text-sm text-orange-200">نیاز به تقویت در ساعات عصر</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg">
                    <Users className="w-5 h-5 text-orange-400" />
                    <div>
                      <div className="font-semibold text-white">روابط اجتماعی</div>
                      <div className="text-sm text-orange-200">افزایش تعاملات اجتماعی</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* تحلیل شخصیت */}
          <TabsContent value="personality" className="space-y-8">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Brain className="w-8 h-8 text-purple-400" />
                  تحلیل شخصیت پنج عاملی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={personalityData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="trait" tick={{ fill: '#9ca3af' }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
                    <Radar
                      name="امتیاز شما"
                      dataKey="score"
                      stroke={colors.purple}
                      fill={colors.purple}
                      fillOpacity={0.3}
                      strokeWidth={3}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {personalityData.map((trait, index) => (
                <Card key={index} className="bg-white/10 border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">{trait.trait}</h3>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                        {trait.score}/100
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${trait.score}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {trait.score > 80 ? "سطح بالا" : trait.score > 60 ? "سطح متوسط" : "سطح پایین"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* الگوهای رفتاری */}
          <TabsContent value="patterns" className="space-y-8">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Activity className="w-8 h-8 text-blue-400" />
                  الگوهای رفتاری شناسایی شده
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={patternData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="pattern" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="frequency" fill={colors.primary} name="فراوانی (%)" />
                    <Bar dataKey="intensity" fill={colors.warning} name="شدت (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {patternData.map((pattern, index) => (
                <Card key={index} className="bg-white/10 border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Activity className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{pattern.pattern}</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">فراوانی:</span>
                        <span className="text-blue-400 font-semibold">{pattern.frequency}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">شدت:</span>
                        <span className="text-orange-400 font-semibold">{pattern.intensity}%</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                      <p className="text-sm text-blue-200">
                        این الگو در {pattern.frequency}% از موارد مشاهده شده و شدت آن {pattern.intensity}% است.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* پیشرفت */}
          <TabsContent value="progress" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400/30">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">+23%</div>
                  <div className="text-green-200">بهبود اضطراب</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-400/30">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">+18%</div>
                  <div className="text-blue-200">افزایش تمرکز</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-400/30">
                <CardContent className="p-6 text-center">
                  <Heart className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">+12%</div>
                  <div className="text-purple-200">بهبود خلق</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <AreaChartIcon className="w-8 h-8 text-green-400" />
                  روند پیشرفت در طول زمان
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="mood" stackId="1" stroke={colors.success} fill={colors.success} fillOpacity={0.6} name="خلق و خو" />
                    <Area type="monotone" dataKey="focus" stackId="1" stroke={colors.primary} fill={colors.primary} fillOpacity={0.6} name="تمرکز" />
                    <Area type="monotone" dataKey="selfEsteem" stackId="1" stroke={colors.purple} fill={colors.purple} fillOpacity={0.6} name="عزت نفس" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* توصیه‌ها */}
          <TabsContent value="recommendations" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-400">
                    <Lightbulb className="w-6 h-6" />
                    توصیه‌های فوری
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-500/10 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">تمرینات تنفسی</h4>
                    <p className="text-sm text-blue-200">برای کاهش اضطراب صبحگاهی، 5 دقیقه تمرین تنفس عمیق انجام دهید.</p>
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">مدیریت زمان</h4>
                    <p className="text-sm text-blue-200">برای بهبود تمرکز، کارهای مهم را در ساعات صبح انجام دهید.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-purple-400">
                    <Target className="w-6 h-6" />
                    اهداف بلندمدت
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-500/10 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">تقویت عزت نفس</h4>
                    <p className="text-sm text-purple-200">روزانه 3 موفقیت کوچک خود را یادداشت کنید.</p>
                  </div>
                  <div className="p-4 bg-purple-500/10 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">افزایش انگیزه</h4>
                    <p className="text-sm text-purple-200">اهداف کوتاه‌مدت و قابل دستیابی تعیین کنید.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <BookOpen className="w-8 h-8 text-green-400" />
                  برنامه بهبود شخصی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-green-500/10 rounded-lg">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">هفته 1-2: مدیریت اضطراب</h4>
                      <p className="text-sm text-green-200">تمرینات تنفسی و مدیتیشن روزانه</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-blue-500/10 rounded-lg">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Clock className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">هفته 3-4: بهبود تمرکز</h4>
                      <p className="text-sm text-blue-200">تکنیک‌های تمرکز و مدیریت زمان</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-purple-500/10 rounded-lg">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Heart className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">هفته 5-6: تقویت عزت نفس</h4>
                      <p className="text-sm text-purple-200">تمرینات مثبت‌نگری و خودشناسی</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* اطلاعات فنی */}
        <Card className="bg-gray-500/10 border-gray-500/30 mt-12">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Info className="w-8 h-8 text-gray-400 mt-1" />
              <div>
                <h4 className="text-xl font-semibold text-gray-300 mb-4">
                  اطلاعات فنی و روش‌شناسی
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-400 text-sm">
                  <div>
                    <h5 className="font-semibold text-gray-300 mb-2">منابع داده:</h5>
                    <ul className="space-y-1">
                      <li>• نتایج تست‌های روان‌شناختی</li>
                      <li>• داده‌های خلق و خو روزانه</li>
                      <li>• الگوهای رفتاری شناسایی شده</li>
                      <li>• تعاملات با سیستم هوش مصنوعی</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-300 mb-2">الگوریتم‌های تحلیل:</h5>
                    <ul className="space-y-1">
                      <li>• یادگیری ماشین برای شناسایی الگوها</li>
                      <li>• تحلیل آماری پیشرفته</li>
                      <li>• مدل‌های پیش‌بینی روند</li>
                      <li>• الگوریتم‌های شخصی‌سازی</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}






