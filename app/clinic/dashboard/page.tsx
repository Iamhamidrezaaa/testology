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
  TestTube,
  FileText,
  Calendar,
  Clock,
  UserPlus,
  Plus,
  Eye,
  Edit,
  Shield
} from "lucide-react";

interface Client {
  id: string;
  nickname: string;
  gender?: string;
  birthYear?: number;
  createdAt: string;
  testResults: Array<{
    id: string;
    testName: string;
    score: number;
    summary?: string;
    createdAt: string;
  }>;
  clinicalNotes: Array<{
    id: string;
    aiReport: string;
    clinicianNote?: string;
    verified: boolean;
    createdAt: string;
  }>;
}

interface DashboardData {
  clients: Client[];
  stats: {
    totalClients: number;
    totalTests: number;
    totalNotes: number;
  };
  recentNotes: Array<{
    id: string;
    aiReport: string;
    client: {
      nickname: string;
    };
    createdAt: string;
  }>;
}

export default function ClinicDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("clients");
  
  // در آینده از session گرفته می‌شود
  const clinicianId = "demo-clinic-1";

  // بارگذاری داشبورد
  const loadDashboard = async () => {
    try {
      const response = await fetch(`/api/clinic/get-dashboard?clinicianId=${clinicianId}`);
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data.dashboard);
      }
    } catch (error) {
      console.error("خطا در بارگذاری داشبورد:", error);
    }
  };

  // افزودن مراجع جدید
  const addClient = async () => {
    const nickname = prompt("نام مستعار مراجع:");
    const gender = prompt("جنسیت (اختیاری):");
    const birthYear = prompt("سال تولد (اختیاری):");
    
    if (!nickname) return;

    try {
      const response = await fetch("/api/clinic/add-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          clinicianId, 
          nickname, 
          gender, 
          birthYear: birthYear ? parseInt(birthYear) : null 
        })
      });
      const data = await response.json();
      
      if (data.success) {
        alert("مراجع جدید با موفقیت اضافه شد!");
        await loadDashboard();
      } else {
        alert("خطا در افزودن مراجع: " + data.message);
      }
    } catch (error) {
      console.error("خطا در افزودن مراجع:", error);
      alert("خطا در افزودن مراجع");
    }
  };

  // افزودن نتیجه تست
  const addTestResult = async (clientId: string) => {
    const testName = prompt("نام تست:");
    const score = prompt("امتیاز:");
    const summary = prompt("خلاصه (اختیاری):");
    
    if (!testName || !score) return;

    try {
      const response = await fetch("/api/clinic/add-test-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          clientId, 
          testName, 
          score: parseFloat(score), 
          summary 
        })
      });
      const data = await response.json();
      
      if (data.success) {
        alert("نتیجه تست با موفقیت اضافه شد!");
        await loadDashboard();
      } else {
        alert("خطا در افزودن نتیجه تست: " + data.message);
      }
    } catch (error) {
      console.error("خطا در افزودن نتیجه تست:", error);
      alert("خطا در افزودن نتیجه تست");
    }
  };

  // تولید گزارش AI
  const generateReport = async (clientId: string) => {
    try {
      const response = await fetch("/api/clinic/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, clinicianId })
      });
      const data = await response.json();
      
      if (data.success) {
        alert("گزارش بالینی با موفقیت تولید شد!");
        await loadDashboard();
      } else {
        alert("خطا در تولید گزارش: " + data.message);
      }
    } catch (error) {
      console.error("خطا در تولید گزارش:", error);
      alert("خطا در تولید گزارش");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadDashboard();
      setLoading(false);
    };
    
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* هدر */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <Stethoscope className="w-12 h-12 text-indigo-400" />
            🏥 Clinic Dashboard
          </h1>
          <p className="text-xl text-indigo-200 mb-6">
            داشبورد کلینیک - مدیریت مراجعان و گزارش‌های بالینی
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button
              onClick={addClient}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg font-semibold"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              افزودن مراجع جدید
            </Button>
            
            <Button
              onClick={loadDashboard}
              variant="outline"
              className="text-white border-white hover:bg-white/10"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              بروزرسانی
            </Button>
          </div>
        </div>

        {/* آمار کلی */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{dashboardData.stats.totalClients}</div>
                <div className="text-indigo-200">مراجعان کل</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <TestTube className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{dashboardData.stats.totalTests}</div>
                <div className="text-indigo-200">تست‌های انجام شده</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{dashboardData.stats.totalNotes}</div>
                <div className="text-indigo-200">گزارش‌های بالینی</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="clients">👥 مراجعان</TabsTrigger>
            <TabsTrigger value="reports">📊 گزارش‌ها</TabsTrigger>
            <TabsTrigger value="stats">📈 آمار</TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-6">
            {loading ? (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p>در حال بارگذاری مراجعان...</p>
                </CardContent>
              </Card>
            ) : !dashboardData || dashboardData.clients.length === 0 ? (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <Users className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">هنوز مراجعی اضافه نشده</h3>
                  <p className="text-indigo-200 mb-4">
                    روی دکمه "افزودن مراجع جدید" کلیک کنید
                  </p>
                </CardContent>
              </Card>
            ) : (
              dashboardData.clients.map((client) => (
                <Card key={client.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold text-indigo-300 mb-2">
                          {client.nickname}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-indigo-200">
                          <Calendar className="w-4 h-4" />
                          <span>عضویت: {new Date(client.createdAt).toLocaleDateString("fa-IR")}</span>
                          {client.gender && (
                            <>
                              <span>•</span>
                              <span>جنسیت: {client.gender}</span>
                            </>
                          )}
                          {client.birthYear && (
                            <>
                              <span>•</span>
                              <span>متولد: {client.birthYear}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Badge className="bg-indigo-100 text-indigo-800">
                        {client.testResults.length} تست
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* تست‌های اخیر */}
                    {client.testResults.length > 0 && (
                      <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/30">
                        <h4 className="text-lg font-semibold text-indigo-300 mb-3 flex items-center gap-2">
                          <TestTube className="w-5 h-5" />
                          تست‌های اخیر
                        </h4>
                        <div className="space-y-2">
                          {client.testResults.slice(0, 3).map((test) => (
                            <div key={test.id} className="flex justify-between items-center p-2 bg-black/20 rounded">
                              <span className="text-gray-200">{test.testName}</span>
                              <Badge className="bg-green-100 text-green-800">
                                {test.score}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* گزارش‌های بالینی */}
                    {client.clinicalNotes.length > 0 && (
                      <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                        <h4 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          گزارش‌های بالینی
                        </h4>
                        <div className="space-y-2">
                          {client.clinicalNotes.slice(0, 2).map((note) => (
                            <div key={note.id} className="p-3 bg-black/20 rounded">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400">
                                  {new Date(note.createdAt).toLocaleDateString("fa-IR")}
                                </span>
                                <Badge className={note.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                                  {note.verified ? "تأیید شده" : "در انتظار تأیید"}
                                </Badge>
                              </div>
                              <p className="text-gray-200 text-sm">
                                {note.aiReport.length > 100 ? note.aiReport.substring(0, 100) + "..." : note.aiReport}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* دکمه‌های عملیات */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => addTestResult(client.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        افزودن تست
                      </Button>
                      
                      <Button
                        onClick={() => generateReport(client.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        تولید گزارش AI
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="text-white border-white hover:bg-white/10"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        مشاهده جزئیات
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {loading ? (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p>در حال بارگذاری گزارش‌ها...</p>
                </CardContent>
              </Card>
            ) : !dashboardData || dashboardData.recentNotes.length === 0 ? (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <FileText className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">هنوز گزارشی تولید نشده</h3>
                  <p className="text-indigo-200 mb-4">
                    برای مراجعان تست اضافه کنید و گزارش تولید کنید
                  </p>
                </CardContent>
              </Card>
            ) : (
              dashboardData.recentNotes.map((note) => (
                <Card key={note.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-indigo-300 mb-2">
                          گزارش بالینی - {note.client.nickname}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-indigo-200">
                          <Calendar className="w-4 h-4" />
                          <span>تاریخ: {new Date(note.createdAt).toLocaleDateString("fa-IR")}</span>
                        </div>
                      </div>
                      <Badge className="bg-indigo-100 text-indigo-800">
                        گزارش AI
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* محتوای گزارش */}
                    <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/30">
                      <h4 className="text-lg font-semibold text-indigo-300 mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        گزارش بالینی
                      </h4>
                      <div className="text-gray-200 leading-relaxed">
                        {note.aiReport.length > 300 ? note.aiReport.substring(0, 300) + "..." : note.aiReport}
                      </div>
                    </div>

                    {/* دکمه‌های عملیات */}
                    <div className="flex gap-2">
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        ویرایش یادداشت
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="text-white border-white hover:bg-white/10"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        مشاهده کامل
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            {dashboardData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-300">
                      <BarChart3 className="w-5 h-5" />
                      آمار کلی
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-200">مراجعان کل</span>
                        <span className="text-white font-semibold">{dashboardData.stats.totalClients}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-200">تست‌های انجام شده</span>
                        <span className="text-white font-semibold">{dashboardData.stats.totalTests}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-200">گزارش‌های بالینی</span>
                        <span className="text-white font-semibold">{dashboardData.stats.totalNotes}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-300">
                      <TrendingUp className="w-5 h-5" />
                      عملکرد کلینیک
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-200">میانگین تست به ازای هر مراجع</span>
                        <span className="text-white font-semibold">
                          {dashboardData.stats.totalClients > 0 
                            ? (dashboardData.stats.totalTests / dashboardData.stats.totalClients).toFixed(1)
                            : 0
                          }
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-200">میانگین گزارش به ازای هر مراجع</span>
                        <span className="text-white font-semibold">
                          {dashboardData.stats.totalClients > 0 
                            ? (dashboardData.stats.totalNotes / dashboardData.stats.totalClients).toFixed(1)
                            : 0
                          }
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-8 text-center">
                  <BarChart3 className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">آمار در دسترس نیست</h3>
                  <p className="text-indigo-200">
                    ابتدا مراجعانی اضافه کنید تا آمار نمایش داده شود
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* هشدار اخلاقی */}
        <Card className="bg-yellow-500/10 border-yellow-500/30 mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-yellow-400 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-yellow-300 mb-2">
                  هشدار اخلاقی و قانونی
                </h4>
                <p className="text-gray-200 text-sm leading-relaxed">
                  این تحلیل جایگزین تشخیص یا درمان توسط روان‌درمانگر نیست. 
                  برای تصمیم‌گیری درمانی با متخصص مشورت کنید. 
                  تمام داده‌ها به صورت ناشناس و امن ذخیره می‌شوند.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}











