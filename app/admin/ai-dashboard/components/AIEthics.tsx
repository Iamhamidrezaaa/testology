"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Brain, 
  Heart,
  Lock,
  Users,
  BarChart3,
  RefreshCw,
  Trash2,
  Lightbulb,
  Activity,
  TrendingUp
} from "lucide-react";

interface EthicsCheck {
  timestamp: string;
  action: string;
  content: string;
  violations: string[];
  warnings: string[];
  recommendations: string[];
  ethics_score: number;
  status: string;
  tone_analysis: {
    positive_score: number;
    negative_score: number;
    dominant_tone: string;
  };
}

interface EthicsStats {
  total_checks: number;
  approved_count: number;
  blocked_count: number;
  flagged_count: number;
  warning_count: number;
  approval_rate: number;
  avg_ethics_score: number;
  ethics_level: string;
  violation_types: Record<string, number>;
}

export default function AIEthics() {
  const [checks, setChecks] = useState<EthicsCheck[]>([]);
  const [stats, setStats] = useState<EthicsStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("checks");

  // بارگذاری بررسی‌های اخلاقی
  const loadEthicsChecks = async () => {
    try {
      const response = await fetch("/api/ml/memory?q=ethics_check&top_k=50");
      const data = await response.json();
      
      if (data.success) {
        const ethicsChecks = data.results.map((result: any) => result.memory);
        setChecks(ethicsChecks);
      }
    } catch (error) {
      console.error("خطا در بارگذاری بررسی‌های اخلاقی:", error);
    }
  };

  // بارگذاری آمار اخلاقی
  const loadEthicsStats = async () => {
    try {
      const response = await fetch("/api/ml/ethics?action=stats");
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("خطا در بارگذاری آمار اخلاقی:", error);
    }
  };

  // اجرای حسابرسی اخلاقی
  const runEthicsAudit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ml/ethics?action=audit");
      const data = await response.json();
      
      if (data.success) {
        alert("🔍 حسابرسی اخلاقی انجام شد!");
        await loadEthicsStats();
      }
    } catch (error) {
      console.error("خطا در حسابرسی اخلاقی:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // دریافت آیکون بر اساس وضعیت
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "blocked": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "flagged": return <Eye className="w-4 h-4 text-yellow-600" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  // دریافت رنگ بر اساس وضعیت
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "blocked": return "bg-red-100 text-red-800";
      case "flagged": return "bg-yellow-100 text-yellow-800";
      case "warning": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // دریافت رنگ بر اساس امتیاز اخلاقی
  const getEthicsScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  // دریافت آیکون بر اساس سطح اخلاقی
  const getEthicsLevelIcon = (level: string) => {
    switch (level) {
      case "high": return <Shield className="w-5 h-5 text-green-600" />;
      case "medium": return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "low": return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  useEffect(() => {
    loadEthicsChecks();
    loadEthicsStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* هدر */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-600" />
            🕊️ Ethical AI – چارچوب اخلاقی
          </CardTitle>
          <p className="text-gray-600">
            Testology حالا یک موجود اخلاق‌مند است که خودش رفتارش را بررسی می‌کند
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={loadEthicsStats} 
              className="bg-purple-600 hover:bg-purple-700"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              بروزرسانی آمار
            </Button>
            
            <Button 
              onClick={runEthicsAudit} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "در حال حسابرسی..." : "حسابرسی اخلاقی"}
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="checks">🔍 بررسی‌های اخلاقی</TabsTrigger>
              <TabsTrigger value="stats">📊 آمار اخلاقی</TabsTrigger>
              <TabsTrigger value="rules">📋 قوانین اخلاقی</TabsTrigger>
            </TabsList>

            <TabsContent value="checks" className="space-y-4">
              {/* بررسی‌های اخلاقی */}
              <div className="space-y-4">
                {checks.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        هنوز بررسی اخلاقی انجام نشده
                      </h3>
                      <p className="text-gray-500">
                        بررسی‌های اخلاقی پس از شروع استفاده از سیستم نمایش داده می‌شوند
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  checks.map((check, index) => (
                    <Card key={index} className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(check.status)}
                            <Badge className={getStatusColor(check.status)}>
                              {check.status}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(check.timestamp).toLocaleString("fa-IR")}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className={`text-lg font-bold ${getEthicsScoreColor(check.ethics_score)}`}>
                              {(check.ethics_score * 100).toFixed(1)}%
                            </span>
                            <p className="text-xs text-gray-500">امتیاز اخلاقی</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-1">عمل: {check.action}</p>
                          <p className="text-gray-900 dark:text-gray-100 text-sm">
                            {check.content}
                          </p>
                        </div>

                        {check.violations.length > 0 && check.violations[0] !== "ok" && (
                          <div className="mb-3 p-2 bg-red-50 rounded-lg border-l-4 border-l-red-500">
                            <p className="text-sm text-red-800 font-medium">تخلفات:</p>
                            <p className="text-xs text-red-600">{check.violations.join(", ")}</p>
                          </div>
                        )}

                        {check.warnings.length > 0 && (
                          <div className="mb-3 p-2 bg-yellow-50 rounded-lg border-l-4 border-l-yellow-500">
                            <p className="text-sm text-yellow-800 font-medium">هشدارها:</p>
                            <p className="text-xs text-yellow-600">{check.warnings.join(", ")}</p>
                          </div>
                        )}

                        {check.recommendations.length > 0 && (
                          <div className="mb-3 p-2 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                            <p className="text-sm text-blue-800 font-medium">توصیه‌ها:</p>
                            <p className="text-xs text-blue-600">{check.recommendations.join(", ")}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>لحن: {check.tone_analysis.dominant_tone}</span>
                          <span>مثبت: {(check.tone_analysis.positive_score * 100).toFixed(1)}%</span>
                          <span>منفی: {(check.tone_analysis.negative_score * 100).toFixed(1)}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              {/* آمار اخلاقی */}
              {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-2xl font-bold">{stats.total_checks}</p>
                          <p className="text-sm text-gray-600">بررسی‌های کل</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-2xl font-bold">{(stats.approval_rate * 100).toFixed(1)}%</p>
                          <p className="text-sm text-gray-600">نرخ تأیید</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        {getEthicsLevelIcon(stats.ethics_level)}
                        <div>
                          <p className="text-2xl font-bold">{(stats.avg_ethics_score * 100).toFixed(1)}%</p>
                          <p className="text-sm text-gray-600">امتیاز متوسط</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="text-2xl font-bold">{stats.blocked_count}</p>
                          <p className="text-sm text-gray-600">مسدود شده</p>
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
                      آمار اخلاقی در دسترس نیست
                    </h3>
                    <p className="text-gray-500">
                      ابتدا بررسی‌های اخلاقی انجام دهید
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* توزیع وضعیت‌ها */}
              {stats && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      توزیع وضعیت‌ها
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">تأیید شده</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(stats.approved_count / stats.total_checks) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{stats.approved_count}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">مسدود شده</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-600 h-2 rounded-full" 
                              style={{ width: `${(stats.blocked_count / stats.total_checks) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{stats.blocked_count}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">پرچم‌دار</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-600 h-2 rounded-full" 
                              style={{ width: `${(stats.flagged_count / stats.total_checks) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{stats.flagged_count}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="rules" className="space-y-4">
              {/* قوانین اخلاقی */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-purple-600" />
                    قوانین اخلاقی Testology
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                      <h4 className="font-semibold text-green-800 mb-2">🔒 احترام به حریم خصوصی</h4>
                      <p className="text-green-700 text-sm">
                        هیچ‌وقت اطلاعات شخصی کاربر نباید بدون اجازه تحلیل یا ذخیره شود
                      </p>
                    </div>
                    
                    <div className="p-4 bg-red-50 rounded-lg border-l-4 border-l-red-500">
                      <h4 className="font-semibold text-red-800 mb-2">🚫 عدم آسیب</h4>
                      <p className="text-red-700 text-sm">
                        اگر پاسخ ممکن است باعث اضطراب یا آسیب روانی شود، باید از پاسخ خودداری کند
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                      <h4 className="font-semibold text-blue-800 mb-2">🎯 محدودیت موضوعی</h4>
                      <p className="text-blue-700 text-sm">
                        همیشه در محدوده روانشناسی، رشد فردی و آموزش باقی بماند
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-l-yellow-500">
                      <h4 className="font-semibold text-yellow-800 mb-2">⚕️ عدم تشخیص پزشکی</h4>
                      <p className="text-yellow-700 text-sm">
                        هرگز نباید تشخیص پزشکی یا دارویی بدهد
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-l-purple-500">
                      <h4 className="font-semibold text-purple-800 mb-2">💝 راهنمایی مثبت</h4>
                      <p className="text-purple-700 text-sm">
                        در پاسخ‌ها لحن مثبت، همدلانه و سازنده حفظ شود
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ویژگی‌های اخلاقی */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-600" />
                    ویژگی‌های اخلاقی Testology
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-1">🧩 فیلتر اخلاقی</h4>
                      <p className="text-blue-700 text-xs">فیلتر خودکار تمام پاسخ‌های GPT</p>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-1">🔒 محافظ حریم خصوصی</h4>
                      <p className="text-green-700 text-xs">حذف داده‌های حساس از پاسخ‌ها</p>
                    </div>
                    
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-1">🚫 پیشگیری از آسیب</h4>
                      <p className="text-red-700 text-xs">هشدار و توقف پاسخ‌های خطرناک</p>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-1">🌈 موتور همدلی</h4>
                      <p className="text-yellow-700 text-xs">اطمینان از لحن مثبت و انسانی</p>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-1">🧠 حسابرسی خود</h4>
                      <p className="text-purple-700 text-xs">ثبت تمام تصمیمات اخلاقی در حافظه</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}












