"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  Cell
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Brain, 
  Heart, 
  Target, 
  Star,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  Eye,
  Settings,
  Info,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Globe,
  Lock,
  Unlock,
  Key,
  Database,
  Server,
  Cloud,
  Wifi,
  Signal,
  Battery,
  Power,
  Play,
  Pause,
  Stop,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Video,
  VideoOff,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Printer,
  Scanner,
  HardDrive,
  Cpu,
  MemoryStick,
  Stethoscope,
  Users,
  FileText,
  TestTube,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  Award,
  Trophy,
  Medal,
  Flag,
  Bell,
  Search,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Upload,
  ExternalLink
} from "lucide-react";

interface MoodTrendData {
  id: string;
  userId: string;
  category: string;
  score: number;
  source: string;
  createdAt: string;
}

interface ChartData {
  date: string;
  mood?: number;
  anxiety?: number;
  focus?: number;
  selfEsteem?: number;
  motivation?: number;
}

interface MoodStats {
  totalRecords: number;
  categories: string[];
  dateRange: {
    start: string;
    end: string;
  } | null;
  averageScores: Record<string, number>;
}

interface Client {
  id: string;
  nickname: string;
  gender?: string;
  birthYear?: number;
  createdAt: string;
}

export default function ClinicMoodTracker() {
  const params = useParams();
  const clientId = params?.id as string;
  const [client, setClient] = useState<Client | null>(null);
  const [data, setData] = useState<ChartData[]>([]);
  const [rawData, setRawData] = useState<MoodTrendData[]>([]);
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("line");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDays, setSelectedDays] = useState("30");

  // بارگذاری اطلاعات مراجع
  const loadClient = async () => {
    try {
      const response = await fetch(`/api/clinic/get-client/${clientId}`);
      const result = await response.json();
      
      if (result.success) {
        setClient(result.client);
      }
    } catch (error) {
      console.error("خطا در بارگذاری اطلاعات مراجع:", error);
    }
  };

  // بارگذاری داده‌های روند روانی
  const loadMoodData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        userId: clientId,
        ...(selectedCategory !== "all" && { category: selectedCategory }),
        ...(selectedDays && { days: selectedDays })
      });
      
      const response = await fetch(`/api/ai/get-mood-trend?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setRawData(result.data || []);
        setStats(result.stats || null);
        
        // تبدیل داده‌ها به فرمت نمودار
        const grouped = result.data.reduce((acc: Record<string, ChartData>, item: MoodTrendData) => {
          const date = new Date(item.createdAt).toLocaleDateString("fa-IR");
          if (!acc[date]) acc[date] = { date };
          acc[date][item.category] = item.score;
          return acc;
        }, {});
        
        setData(Object.values(grouped));
      }
    } catch (error) {
      console.error("خطا در بارگذاری داده‌های روند روانی:", error);
    } finally {
      setLoading(false);
    }
  };

  // افزودن داده تست
  const addTestData = async () => {
    const category = prompt("دسته‌بندی (mood/anxiety/focus/selfEsteem/motivation):");
    const score = prompt("امتیاز (0-100):");
    
    if (!category || !score) return;

    try {
      const response = await fetch("/api/ai/update-mood-trend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: clientId, 
          category, 
          score: parseFloat(score), 
          source: "testResult" 
        })
      });
      const result = await response.json();
      
      if (result.success) {
        alert("داده تست با موفقیت اضافه شد!");
        await loadMoodData();
      } else {
        alert("خطا در افزودن داده تست: " + result.message);
      }
    } catch (error) {
      console.error("خطا در افزودن داده تست:", error);
      alert("خطا در افزودن داده تست");
    }
  };

  useEffect(() => {
    if (clientId) {
      loadClient();
      loadMoodData();
    }
  }, [clientId, selectedCategory, selectedDays]);

  const colors = {
    mood: "#22c55e",
    anxiety: "#f59e0b", 
    focus: "#3b82f6",
    selfEsteem: "#ec4899",
    motivation: "#8b5cf6"
  };

  const categoryNames = {
    mood: "خلق و خو",
    anxiety: "اضطراب",
    focus: "تمرکز",
    selfEsteem: "عزت نفس",
    motivation: "انگیزه"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* هدر */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Stethoscope className="w-12 h-12 text-indigo-400" />
            📈 Clinic Mood Tracker
          </h1>
          <p className="text-xl text-indigo-200 mb-6">
            ردیابی روند روانی مراجع - {client?.nickname || "در حال بارگذاری..."}
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button
              onClick={addTestData}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg font-semibold"
            >
              <Activity className="w-5 h-5 mr-2" />
              افزودن داده تست
            </Button>
            
            <Button
              onClick={loadMoodData}
              variant="outline"
              className="text-white border-white hover:bg-white/10"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              بروزرسانی
            </Button>
          </div>
        </div>

        {/* اطلاعات مراجع */}
        {client && (
          <Card className="bg-white/10 border-white/20 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Users className="w-6 h-6 text-indigo-400" />
                اطلاعات مراجع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-300 mb-1">
                    {client.nickname}
                  </div>
                  <div className="text-gray-300">نام مستعار</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-white mb-1">
                    {client.gender || "نامشخص"}
                  </div>
                  <div className="text-gray-300">جنسیت</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-white mb-1">
                    {client.birthYear ? new Date().getFullYear() - client.birthYear : "نامشخص"}
                  </div>
                  <div className="text-gray-300">سن</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* آمار کلی */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Activity className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stats.totalRecords}</div>
                <div className="text-indigo-200">رکورد کل</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Brain className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stats.categories.length}</div>
                <div className="text-indigo-200">دسته‌بندی</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{selectedDays}</div>
                <div className="text-indigo-200">روز گذشته</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">
                  {Object.keys(stats.averageScores).length}
                </div>
                <div className="text-indigo-200">میانگین محاسبه شده</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* فیلترها */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <label className="text-gray-200">دسته‌بندی:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            >
              <option value="all">همه</option>
              <option value="mood">خلق و خو</option>
              <option value="anxiety">اضطراب</option>
              <option value="focus">تمرکز</option>
              <option value="selfEsteem">عزت نفس</option>
              <option value="motivation">انگیزه</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-gray-200">بازه زمانی:</label>
            <select
              value={selectedDays}
              onChange={(e) => setSelectedDays(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            >
              <option value="7">7 روز گذشته</option>
              <option value="30">30 روز گذشته</option>
              <option value="90">90 روز گذشته</option>
              <option value="365">یک سال گذشته</option>
            </select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="line">📈 خطی</TabsTrigger>
            <TabsTrigger value="area">📊 ناحیه‌ای</TabsTrigger>
            <TabsTrigger value="bar">📊 ستونی</TabsTrigger>
            <TabsTrigger value="pie">🥧 دایره‌ای</TabsTrigger>
          </TabsList>

          <TabsContent value="line" className="space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <LineChartIcon className="w-6 h-6 text-indigo-400" />
                  نمودار خطی روند روانی
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p>در حال بارگذاری داده‌ها...</p>
                  </div>
                ) : data.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">داده‌ای برای نمایش وجود ندارد</h3>
                    <p className="text-gray-400 mb-4">
                      ابتدا تست‌هایی برای این مراجع انجام دهید
                    </p>
                    <Button onClick={addTestData} className="bg-indigo-600 hover:bg-indigo-700">
                      <Activity className="w-4 h-4 mr-2" />
                      افزودن داده تست
                    </Button>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#aaa" />
                      <YAxis stroke="#aaa" domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="mood" stroke={colors.mood} strokeWidth={2} dot={false} name="خلق و خو" />
                      <Line type="monotone" dataKey="anxiety" stroke={colors.anxiety} strokeWidth={2} dot={false} name="اضطراب" />
                      <Line type="monotone" dataKey="focus" stroke={colors.focus} strokeWidth={2} dot={false} name="تمرکز" />
                      <Line type="monotone" dataKey="selfEsteem" stroke={colors.selfEsteem} strokeWidth={2} dot={false} name="عزت نفس" />
                      <Line type="monotone" dataKey="motivation" stroke={colors.motivation} strokeWidth={2} dot={false} name="انگیزه" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="area" className="space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <AreaChartIcon className="w-6 h-6 text-indigo-400" />
                  نمودار ناحیه‌ای روند روانی
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p>در حال بارگذاری داده‌ها...</p>
                  </div>
                ) : data.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">داده‌ای برای نمایش وجود ندارد</h3>
                    <p className="text-gray-400 mb-4">
                      ابتدا تست‌هایی برای این مراجع انجام دهید
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#aaa" />
                      <YAxis stroke="#aaa" domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="mood" stackId="1" stroke={colors.mood} fill={colors.mood} fillOpacity={0.6} name="خلق و خو" />
                      <Area type="monotone" dataKey="anxiety" stackId="1" stroke={colors.anxiety} fill={colors.anxiety} fillOpacity={0.6} name="اضطراب" />
                      <Area type="monotone" dataKey="focus" stackId="1" stroke={colors.focus} fill={colors.focus} fillOpacity={0.6} name="تمرکز" />
                      <Area type="monotone" dataKey="selfEsteem" stackId="1" stroke={colors.selfEsteem} fill={colors.selfEsteem} fillOpacity={0.6} name="عزت نفس" />
                      <Area type="monotone" dataKey="motivation" stackId="1" stroke={colors.motivation} fill={colors.motivation} fillOpacity={0.6} name="انگیزه" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bar" className="space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <BarChart3 className="w-6 h-6 text-indigo-400" />
                  نمودار ستونی روند روانی
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p>در حال بارگذاری داده‌ها...</p>
                  </div>
                ) : data.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">داده‌ای برای نمایش وجود ندارد</h3>
                    <p className="text-gray-400 mb-4">
                      ابتدا تست‌هایی برای این مراجع انجام دهید
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#aaa" />
                      <YAxis stroke="#aaa" domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="mood" fill={colors.mood} name="خلق و خو" />
                      <Bar dataKey="anxiety" fill={colors.anxiety} name="اضطراب" />
                      <Bar dataKey="focus" fill={colors.focus} name="تمرکز" />
                      <Bar dataKey="selfEsteem" fill={colors.selfEsteem} name="عزت نفس" />
                      <Bar dataKey="motivation" fill={colors.motivation} name="انگیزه" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pie" className="space-y-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <PieChartIcon className="w-6 h-6 text-indigo-400" />
                  نمودار دایره‌ای میانگین امتیازات
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p>در حال بارگذاری داده‌ها...</p>
                  </div>
                ) : !stats || Object.keys(stats.averageScores).length === 0 ? (
                  <div className="text-center py-8">
                    <PieChartIcon className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">داده‌ای برای نمایش وجود ندارد</h3>
                    <p className="text-gray-400 mb-4">
                      ابتدا تست‌هایی برای این مراجع انجام دهید
                    </p>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={Object.entries(stats.averageScores).map(([category, score]) => ({
                            name: categoryNames[category as keyof typeof categoryNames] || category,
                            value: score,
                            color: colors[category as keyof typeof colors] || "#666"
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value.toFixed(1)}`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {Object.entries(stats.averageScores).map(([category, score], index) => (
                            <Cell key={`cell-${index}`} fill={colors[category as keyof typeof colors] || "#666"} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* اطلاعات فنی */}
        <Card className="bg-gray-500/10 border-gray-500/30 mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-gray-400 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-gray-300 mb-2">
                  اطلاعات فنی - Clinic Edition
                </h4>
                <div className="text-gray-400 text-sm space-y-2">
                  <p>• نمودارها بر اساس داده‌های تست‌های مراجع تولید می‌شوند</p>
                  <p>• امتیازات از 0 تا 100 محاسبه می‌شوند</p>
                  <p>• داده‌ها به صورت خودکار از نتایج تست‌ها و گزارش‌های بالینی استخراج می‌شوند</p>
                  <p>• امکان فیلتر بر اساس دسته‌بندی و بازه زمانی</p>
                  <p>• این ابزار برای نظارت بر پیشرفت درمانی طراحی شده است</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}











