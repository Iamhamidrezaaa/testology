"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  BookOpen, 
  GraduationCap, 
  Award, 
  Target, 
  TrendingUp, 
  Clock, 
  Star,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  Radar as RadarIcon,
  Calendar,
  Users,
  Zap,
  Shield,
  Eye,
  MessageSquare,
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
  ArrowLeft,
  Book,
  Video,
  FileText,
  Headphones,
  Globe,
  Lock,
  Unlock,
  Heart,
  Brain,
  Activity,
  Target as TargetIcon,
  Trophy,
  Medal,
  Crown,
  Flame,
  Sparkles
} from "lucide-react";

interface LearningCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  progress: number; // 0-100
  status: 'not_started' | 'in_progress' | 'completed';
  rating: number;
  instructor: string;
  thumbnail: string;
  tags: string[];
  createdAt: string;
  lastAccessed: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: string[];
  progress: number;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

interface LearningAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface LearningStats {
  totalCourses: number;
  completedCourses: number;
  totalStudyTime: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
  certificates: number;
  achievements: number;
}

export default function LearningPage() {
  const [courses, setCourses] = useState<LearningCourse[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [achievements, setAchievements] = useState<LearningAchievement[]>([]);
  const [stats, setStats] = useState<LearningStats>({
    totalCourses: 0,
    completedCourses: 0,
    totalStudyTime: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageScore: 0,
    certificates: 0,
    achievements: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // دریافت داده‌های یادگیری
  const fetchLearningData = async () => {
    try {
      setLoading(true);
      const userEmail = localStorage.getItem("testology_email");
      
      if (!userEmail) {
        console.error("ایمیل کاربر یافت نشد");
        return;
      }

      const response = await fetch(`/api/user/learning-data?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.courses || []);
        setLearningPaths(data.learningPaths || []);
        setAchievements(data.achievements || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error("خطا در دریافت داده‌های یادگیری:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearningData();
  }, [selectedCategory, selectedLevel]);

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
  const learningProgressData = [
    { week: "هفته 1", courses: 2, time: 120, score: 85 },
    { week: "هفته 2", courses: 3, time: 180, score: 88 },
    { week: "هفته 3", courses: 4, time: 240, score: 92 },
    { week: "هفته 4", courses: 5, time: 300, score: 95 },
    { week: "هفته 5", courses: 6, time: 360, score: 97 },
    { week: "هفته 6", courses: 7, time: 420, score: 98 }
  ];

  const categoryData = [
    { category: "روان‌شناسی", courses: 8, completed: 6, progress: 75 },
    { category: "مدیریت استرس", courses: 5, completed: 3, progress: 60 },
    { category: "توسعه شخصی", courses: 6, completed: 4, progress: 67 },
    { category: "مدیریت زمان", courses: 4, completed: 2, progress: 50 },
    { category: "ارتباطات", courses: 3, completed: 1, progress: 33 }
  ];

  const timeSpentData = [
    { day: "شنبه", time: 45 },
    { day: "یکشنبه", time: 60 },
    { day: "دوشنبه", time: 30 },
    { day: "سه‌شنبه", time: 90 },
    { day: "چهارشنبه", time: 75 },
    { day: "پنج‌شنبه", time: 120 },
    { day: "جمعه", time: 105 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">در حال بارگذاری محتوای یادگیری...</p>
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
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                مرکز یادگیری
              </h1>
              <p className="text-xl text-gray-300 mt-2">
                توسعه مهارت‌ها و دانش روان‌شناختی شما
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button
              onClick={fetchLearningData}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-lg font-semibold"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              بروزرسانی
            </Button>
            
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white/10 px-8 py-3 rounded-xl text-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              دانلود گواهی
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
              <option value="psychology">روان‌شناسی</option>
              <option value="stress">مدیریت استرس</option>
              <option value="personal">توسعه شخصی</option>
              <option value="time">مدیریت زمان</option>
              <option value="communication">ارتباطات</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-gray-400" />
            <label className="text-gray-300">سطح:</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            >
              <option value="all">همه</option>
              <option value="beginner">مبتدی</option>
              <option value="intermediate">متوسط</option>
              <option value="advanced">پیشرفته</option>
            </select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 border border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
              <Eye className="w-4 h-4 mr-2" />
              نمای کلی
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-white/20">
              <BookOpen className="w-4 h-4 mr-2" />
              دوره‌ها
            </TabsTrigger>
            <TabsTrigger value="paths" className="data-[state=active]:bg-white/20">
              <Target className="w-4 h-4 mr-2" />
              مسیرها
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-white/20">
              <TrendingUp className="w-4 h-4 mr-2" />
              پیشرفت
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-white/20">
              <Trophy className="w-4 h-4 mr-2" />
              دستاوردها
            </TabsTrigger>
          </TabsList>

          {/* نمای کلی */}
          <TabsContent value="overview" className="space-y-8">
            {/* آمار کلی */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-400/30">
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">{stats.totalCourses}</div>
                  <div className="text-blue-200">دوره‌های موجود</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400/30">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">{stats.completedCourses}</div>
                  <div className="text-green-200">دوره‌های تکمیل شده</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-400/30">
                <CardContent className="p-6 text-center">
                  <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">{Math.floor(stats.totalStudyTime / 60)}</div>
                  <div className="text-purple-200">ساعت مطالعه</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-400/30">
                <CardContent className="p-6 text-center">
                  <Flame className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">{stats.currentStreak}</div>
                  <div className="text-orange-200">روز متوالی</div>
                </CardContent>
              </Card>
            </div>

            {/* نمودار پیشرفت یادگیری */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <LineChartIcon className="w-8 h-8 text-blue-400" />
                  پیشرفت یادگیری در طول زمان
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={learningProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="week" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="courses" stroke={colors.primary} strokeWidth={3} dot={{ r: 6 }} name="دوره‌ها" />
                    <Line type="monotone" dataKey="time" stroke={colors.success} strokeWidth={3} dot={{ r: 6 }} name="زمان (دقیقه)" />
                    <Line type="monotone" dataKey="score" stroke={colors.warning} strokeWidth={3} dot={{ r: 6 }} name="امتیاز" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* زمان مطالعه روزانه */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <AreaChartIcon className="w-8 h-8 text-green-400" />
                  زمان مطالعه روزانه
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeSpentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                    <Area type="monotone" dataKey="time" stroke={colors.success} fill={colors.success} fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* دوره‌ها */}
          <TabsContent value="courses" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* دوره نمونه 1 */}
              <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Brain className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">مبانی روان‌شناسی</h3>
                      <p className="text-sm text-gray-400">دکتر احمد محمدی</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">
                    آشنایی با اصول اولیه روان‌شناسی و کاربردهای آن در زندگی روزمره
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">پیشرفت:</span>
                      <span className="text-blue-400 font-semibold">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                      در حال انجام
                    </Badge>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">4.8</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>2 ساعت</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>1,234 دانشجو</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Play className="w-4 h-4 mr-2" />
                    ادامه دوره
                  </Button>
                </CardContent>
              </Card>

              {/* دوره نمونه 2 */}
              <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Heart className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">مدیریت استرس</h3>
                      <p className="text-sm text-gray-400">دکتر فاطمه احمدی</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">
                    تکنیک‌های عملی برای کاهش استرس و افزایش آرامش در زندگی
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">پیشرفت:</span>
                      <span className="text-green-400 font-semibold">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                      تکمیل شده
                    </Badge>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">4.9</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>1.5 ساعت</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>856 دانشجو</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full text-white border-white hover:bg-white/10">
                    <Download className="w-4 h-4 mr-2" />
                    دانلود گواهی
                  </Button>
                </CardContent>
              </Card>

              {/* دوره نمونه 3 */}
              <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Target className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">توسعه شخصی</h3>
                      <p className="text-sm text-gray-400">دکتر علی رضایی</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">
                    راهکارهای عملی برای رشد شخصی و دستیابی به اهداف
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">پیشرفت:</span>
                      <span className="text-purple-400 font-semibold">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="bg-gray-500/20 text-gray-300">
                      شروع نشده
                    </Badge>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">4.7</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>3 ساعت</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>2,156 دانشجو</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Play className="w-4 h-4 mr-2" />
                    شروع دوره
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* مسیرهای یادگیری */}
          <TabsContent value="paths" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* مسیر نمونه 1 */}
              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-400">
                    <Target className="w-6 h-6" />
                    مسیر روان‌شناس
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    مسیر کامل برای تبدیل شدن به یک روان‌شناس حرفه‌ای
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">پیشرفت:</span>
                      <span className="text-blue-400 font-semibold">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">مبانی روان‌شناسی</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">روان‌شناسی رشد</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300">روان‌شناسی بالینی</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">روان‌درمانی</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>12 ساعت باقی‌مانده</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>456 دانشجو</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Play className="w-4 h-4 mr-2" />
                    ادامه مسیر
                  </Button>
                </CardContent>
              </Card>

              {/* مسیر نمونه 2 */}
              <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-400">
                    <Heart className="w-6 h-6" />
                    مسیر سلامت روان
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    مسیر کامل برای حفظ و بهبود سلامت روان
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">پیشرفت:</span>
                      <span className="text-green-400 font-semibold">80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">مدیریت استرس</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">مدیریت اضطراب</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300">توسعه شخصی</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">مدیریت زمان</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>6 ساعت باقی‌مانده</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>1,234 دانشجو</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Play className="w-4 h-4 mr-2" />
                    ادامه مسیر
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* پیشرفت */}
          <TabsContent value="progress" className="space-y-8">
            {/* آمار پیشرفت */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400/30">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">+25%</div>
                  <div className="text-green-200">بهبود کلی</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-400/30">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">85%</div>
                  <div className="text-blue-200">میانگین امتیاز</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-400/30">
                <CardContent className="p-6 text-center">
                  <Flame className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">15</div>
                  <div className="text-purple-200">روز متوالی</div>
                </CardContent>
              </Card>
            </div>

            {/* نمودار پیشرفت بر اساس دسته‌بندی */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <BarChart3 className="w-8 h-8 text-blue-400" />
                  پیشرفت بر اساس دسته‌بندی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9ca3af" />
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
                    <Bar dataKey="progress" fill={colors.primary} name="پیشرفت (%)" />
                    <Bar dataKey="completed" fill={colors.success} name="تکمیل شده" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* دستاوردها */}
          <TabsContent value="achievements" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* دستاورد نمونه 1 */}
              <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-400/30">
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-yellow-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">اولین دوره</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    اولین دوره خود را تکمیل کردید
                  </p>
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                    معمولی
                  </Badge>
                </CardContent>
              </Card>

              {/* دستاورد نمونه 2 */}
              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-400/30">
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-blue-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Flame className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">استمرار</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    7 روز متوالی مطالعه کردید
                  </p>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                    نادر
                  </Badge>
                </CardContent>
              </Card>

              {/* دستاورد نمونه 3 */}
              <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-400/30">
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-purple-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Crown className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">استاد</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    10 دوره تکمیل کردید
                  </p>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                    افسانه‌ای
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* اطلاعات فنی */}
        <Card className="bg-gray-500/10 border-gray-500/30 mt-12">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <HelpCircle className="w-8 h-8 text-gray-400 mt-1" />
              <div>
                <h4 className="text-xl font-semibold text-gray-300 mb-4">
                  راهنمای استفاده از مرکز یادگیری
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-400 text-sm">
                  <div>
                    <h5 className="font-semibold text-gray-300 mb-2">نحوه شروع:</h5>
                    <ul className="space-y-1">
                      <li>• دوره‌های مناسب سطح خود را انتخاب کنید</li>
                      <li>• مسیرهای یادگیری را دنبال کنید</li>
                      <li>• پیشرفت خود را پیگیری کنید</li>
                      <li>• دستاوردهای خود را جمع‌آوری کنید</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-300 mb-2">نکات مهم:</h5>
                    <ul className="space-y-1">
                      <li>• مطالعه منظم و مستمر</li>
                      <li>• تمرین عملی آموخته‌ها</li>
                      <li>• مشارکت در بحث‌ها</li>
                      <li>• دریافت بازخورد از مربیان</li>
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






