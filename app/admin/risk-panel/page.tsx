"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle,
  Shield,
  CheckCircle,
  Clock,
  Brain,
  FileText,
  Users,
  Activity,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Eye,
  Check,
  X,
  AlertCircle,
  Heart,
  Zap,
  Target,
  BookOpen,
  GraduationCap,
  ExternalLink,
  Calendar,
  User,
  Stethoscope,
  TestTube,
  Lightbulb,
  Star,
  Crown,
  Award,
  Trophy,
  Medal,
  Flag,
  Bell,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Download,
  Upload,
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
  HardDriveIcon,
  DatabaseIcon,
  ServerIcon,
  CloudIcon,
  WifiIcon,
  SignalIcon,
  BatteryIcon,
  PowerIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Volume2Icon,
  VolumeXIcon,
  MicIcon,
  MicOffIcon,
  CameraIcon,
  CameraOffIcon,
  VideoIcon,
  VideoOffIcon,
  MonitorIcon,
  SmartphoneIcon,
  TabletIcon,
  LaptopIcon,
  DesktopIcon,
  PrinterIcon,
  ScannerIcon,
  HardDriveIcon as HDIcon,
  CpuIcon,
  MemoryStickIcon,
  HardDriveIcon as HDIcon2,
  DatabaseIcon as DBIcon,
  ServerIcon as SIcon,
  CloudIcon as CIcon,
  WifiIcon as WIcon,
  SignalIcon as SigIcon,
  BatteryIcon as BIcon,
  PowerIcon as PIcon,
  PlayIcon as PlayI,
  PauseIcon as PauseI,
  StopIcon as StopI,
  SkipBackIcon as SBIcon,
  SkipForwardIcon as SFIcon,
  Volume2Icon as V2Icon,
  VolumeXIcon as VXIcon,
  MicIcon as MIcon,
  MicOffIcon as MOIcon,
  CameraIcon as CIcon2,
  CameraOffIcon as COIcon,
  VideoIcon as VIcon,
  VideoOffIcon as VOIcon,
  MonitorIcon as MonIcon,
  SmartphoneIcon as SIcon2,
  TabletIcon as TIcon,
  LaptopIcon as LIcon,
  DesktopIcon as DIcon,
  PrinterIcon as PrIcon,
  ScannerIcon as ScIcon
} from "lucide-react";

interface RiskFlag {
  id: string;
  level: string;
  category: string;
  aiSummary: string;
  humanReviewed: boolean;
  createdAt: string;
  clinicianId?: string;
  reportId?: string;
}

interface RiskStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export default function RiskPanel() {
  const [risks, setRisks] = useState<RiskFlag[]>([]);
  const [stats, setStats] = useState<RiskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");

  // بارگذاری گزارش‌های ریسک
  const loadRisks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/get-risk-flags");
      const data = await response.json();
      
      if (data.success) {
        setRisks(data.risks || []);
        setStats(data.stats || null);
      }
    } catch (error) {
      console.error("خطا در بارگذاری گزارش‌های ریسک:", error);
    } finally {
      setLoading(false);
    }
  };

  // بررسی ریسک توسط انسان
  const markReviewed = async (riskId: string) => {
    try {
      const response = await fetch("/api/admin/review-risk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ riskId })
      });
      const data = await response.json();
      
      if (data.success) {
        alert("ریسک با موفقیت بررسی شد!");
        await loadRisks();
      } else {
        alert("خطا در بررسی ریسک: " + data.message);
      }
    } catch (error) {
      console.error("خطا در بررسی ریسک:", error);
      alert("خطا در بررسی ریسک");
    }
  };

  // فیلتر کردن ریسک‌ها
  const filteredRisks = risks.filter(risk => {
    if (filterLevel === "all") return true;
    return risk.level === filterLevel;
  });

  // مرتب‌سازی ریسک‌ها
  const sortedRisks = [...filteredRisks].sort((a, b) => {
    if (sortBy === "createdAt") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "level") {
      const levelOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return levelOrder[b.level as keyof typeof levelOrder] - levelOrder[a.level as keyof typeof levelOrder];
    }
    return 0;
  });

  useEffect(() => {
    loadRisks();
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-red-500/20 border-red-500/50 text-red-300";
      case "high": return "bg-orange-500/20 border-orange-500/50 text-orange-300";
      case "medium": return "bg-yellow-500/20 border-yellow-500/50 text-yellow-300";
      case "low": return "bg-green-500/20 border-green-500/50 text-green-300";
      default: return "bg-gray-500/20 border-gray-500/50 text-gray-300";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "critical": return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case "high": return <AlertCircle className="w-5 h-5 text-orange-400" />;
      case "medium": return <Clock className="w-5 h-5 text-yellow-400" />;
      case "low": return <CheckCircle className="w-5 h-5 text-green-400" />;
      default: return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "anxiety": return <Brain className="w-4 h-4 text-purple-400" />;
      case "depression": return <Heart className="w-4 h-4 text-blue-400" />;
      case "suicide": return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case "self-harm": return <Shield className="w-4 h-4 text-orange-400" />;
      case "stress": return <Zap className="w-4 h-4 text-yellow-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* هدر */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Shield className="w-12 h-12 text-red-400" />
            🚨 Risk Review Panel
          </h1>
          <p className="text-xl text-red-200 mb-6">
            پنل بررسی ریسک - نظارت انسانی بر گزارش‌های بحرانی
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button
              onClick={loadRisks}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-lg font-semibold"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              بروزرسانی گزارش‌ها
            </Button>
          </div>
        </div>

        {/* آمار ریسک */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stats.critical}</div>
                <div className="text-red-200">بحرانی</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <AlertCircle className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stats.high}</div>
                <div className="text-orange-200">بالا</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stats.medium}</div>
                <div className="text-yellow-200">متوسط</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stats.low}</div>
                <div className="text-green-200">پایین</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* فیلترها و مرتب‌سازی */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <label className="text-gray-200">فیلتر سطح:</label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            >
              <option value="all">همه</option>
              <option value="critical">بحرانی</option>
              <option value="high">بالا</option>
              <option value="medium">متوسط</option>
              <option value="low">پایین</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-gray-200">مرتب‌سازی:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            >
              <option value="createdAt">تاریخ</option>
              <option value="level">سطح ریسک</option>
            </select>
          </div>
        </div>

        {/* لیست گزارش‌های ریسک */}
        {loading ? (
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>در حال بارگذاری گزارش‌های ریسک...</p>
            </CardContent>
          </Card>
        ) : sortedRisks.length === 0 ? (
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">هیچ گزارش ریسکی یافت نشد</h3>
              <p className="text-gray-200">
                {filterLevel === "all" 
                  ? "هنوز هیچ گزارش ریسکی تولید نشده است"
                  : `هیچ گزارش ریسک ${filterLevel} یافت نشد`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {sortedRisks.map((risk) => (
              <Card 
                key={risk.id} 
                className={`${getLevelColor(risk.level)} border-2 hover:bg-opacity-30 transition-all duration-300`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getLevelIcon(risk.level)}
                      <div>
                        <CardTitle className="text-xl font-bold">
                          سطح ریسک: {risk.level.toUpperCase()}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          {getCategoryIcon(risk.category)}
                          <Badge className="bg-white/20 text-white">
                            {risk.category}
                          </Badge>
                          <span className="text-sm text-gray-300">
                            {new Date(risk.createdAt).toLocaleDateString("fa-IR")}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {risk.humanReviewed ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          بررسی شده
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Clock className="w-4 h-4 mr-1" />
                          در انتظار بررسی
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* خلاصه AI */}
                  <div className="bg-black/20 rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      خلاصه تحلیل AI
                    </h4>
                    <p className="text-gray-200 leading-relaxed">
                      {risk.aiSummary}
                    </p>
                  </div>

                  {/* جزئیات ریسک */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-sm text-gray-300 mb-1">شناسه ریسک</div>
                      <div className="text-white font-mono text-sm">{risk.id}</div>
                    </div>
                    
                    {risk.clinicianId && (
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-sm text-gray-300 mb-1">شناسه درمانگر</div>
                        <div className="text-white font-mono text-sm">{risk.clinicianId}</div>
                      </div>
                    )}
                    
                    {risk.reportId && (
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-sm text-gray-300 mb-1">شناسه گزارش</div>
                        <div className="text-white font-mono text-sm">{risk.reportId}</div>
                      </div>
                    )}
                  </div>

                  {/* دکمه‌های عملیات */}
                  <div className="flex gap-2">
                    {!risk.humanReviewed && (
                      <Button
                        onClick={() => markReviewed(risk.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        بررسی شده
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      className="text-white border-white hover:bg-white/10"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      مشاهده جزئیات
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="text-white border-white hover:bg-white/10"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      گزارش کامل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* هشدار اخلاقی */}
        <Card className="bg-red-500/10 border-red-500/30 mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-red-400 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-red-300 mb-2">
                  هشدار اخلاقی و قانونی
                </h4>
                <p className="text-gray-200 text-sm leading-relaxed">
                  این پنل برای بررسی گزارش‌های ریسک طراحی شده است. 
                  تمام تصمیم‌گیری‌های درمانی باید توسط متخصصان مجرب انجام شود. 
                  در صورت مشاهده ریسک‌های بحرانی، فوراً با متخصصان مربوطه تماس بگیرید.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}









