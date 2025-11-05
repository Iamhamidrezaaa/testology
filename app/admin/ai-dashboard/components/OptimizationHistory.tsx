"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Settings, 
  TrendingUp, 
  Clock, 
  Target,
  CheckCircle,
  AlertTriangle,
  Zap,
  BarChart3
} from "lucide-react";

interface OptimizationLog {
  timestamp: string;
  method: string;
  best_params: Record<string, any>;
  accuracy: number;
  cv_score: number;
  improvement: number | string;
}

export default function OptimizationHistory() {
  const [logs, setLogs] = useState<OptimizationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [optimizing, setOptimizing] = useState(false);

  const loadOptimizationLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/admin/ai/optimize-log");
      
      if (!response.ok) {
        throw new Error('خطا در دریافت تاریخچه بهینه‌سازی');
      }
      
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای نامشخص');
    } finally {
      setLoading(false);
    }
  };

  const runOptimization = async () => {
    try {
      setOptimizing(true);
      setError(null);
      
      const response = await fetch("/api/ml/optimize", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('خطا در اجرای بهینه‌سازی');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // بارگذاری مجدد تاریخچه
        await loadOptimizationLogs();
        alert('✅ بهینه‌سازی مدل با موفقیت انجام شد!');
      } else {
        throw new Error(result.error || 'خطا در بهینه‌سازی');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای نامشخص');
    } finally {
      setOptimizing(false);
    }
  };

  useEffect(() => {
    loadOptimizationLogs();
  }, []);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.9) return 'text-green-600';
    if (accuracy >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyBadge = (accuracy: number) => {
    if (accuracy >= 0.9) return 'bg-green-100 text-green-800 border-green-200';
    if (accuracy >= 0.8) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getImprovementColor = (improvement: number | string) => {
    if (typeof improvement === 'string') return 'text-gray-500';
    if (improvement > 0) return 'text-green-600';
    if (improvement < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const getImprovementIcon = (improvement: number | string) => {
    if (typeof improvement === 'string') return <Clock className="w-4 h-4" />;
    if (improvement > 0) return <TrendingUp className="w-4 h-4" />;
    if (improvement < 0) return <AlertTriangle className="w-4 h-4" />;
    return <Target className="w-4 h-4" />;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMethodBadge = (method: string) => {
    const badges: Record<string, string> = {
      'GridSearchCV': 'bg-blue-100 text-blue-800 border-blue-200',
      'RandomizedSearchCV': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return badges[method] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری تاریخچه بهینه‌سازی...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header و دکمه بهینه‌سازی */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-emerald-600" />
              تاریخچه بهینه‌سازی مدل
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={loadOptimizationLogs}
                variant="outline"
                disabled={loading}
              >
                <Target className="w-4 h-4 mr-2" />
                بارگذاری مجدد
              </Button>
              <Button 
                onClick={runOptimization}
                disabled={optimizing}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {optimizing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    در حال بهینه‌سازی...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    بهینه‌سازی مدل
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            سیستم به صورت خودکار بهترین پارامترهای مدل را پیدا می‌کند و دقت را بهبود می‌دهد
          </p>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* آمار کلی */}
      {logs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">کل بهینه‌سازی‌ها</span>
              </div>
              <p className="text-2xl font-bold mt-1">{logs.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">آخرین دقت</span>
              </div>
              <p className={`text-2xl font-bold mt-1 ${getAccuracyColor(logs[0].accuracy)}`}>
                {(logs[0].accuracy * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-600">بهترین دقت</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {(Math.max(...logs.map(log => log.accuracy)) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-gray-600">روش آخرین</span>
              </div>
              <p className="text-sm font-medium mt-1">{logs[0].method}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* جدول تاریخچه */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            تاریخچه بهینه‌سازی‌ها
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                هنوز بهینه‌سازی انجام نشده
              </h3>
              <p className="text-gray-500 mb-4">
                برای شروع بهینه‌سازی مدل، روی دکمه "بهینه‌سازی مدل" کلیک کنید
              </p>
              <Button 
                onClick={runOptimization}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                شروع بهینه‌سازی
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-3 px-4 font-medium text-gray-600">تاریخ</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">روش</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">دقت</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">بهبود</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">پارامترهای کلیدی</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{formatDate(log.timestamp)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getMethodBadge(log.method)}>
                          {log.method}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${getAccuracyColor(log.accuracy)}`}>
                            {(log.accuracy * 100).toFixed(1)}%
                          </span>
                          <Badge className={getAccuracyBadge(log.accuracy)}>
                            {log.accuracy >= 0.9 ? 'عالی' : log.accuracy >= 0.8 ? 'خوب' : 'نیاز به بهبود'}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className={`flex items-center gap-1 ${getImprovementColor(log.improvement)}`}>
                          {getImprovementIcon(log.improvement)}
                          <span className="text-sm">
                            {typeof log.improvement === 'string' 
                              ? log.improvement 
                              : `${log.improvement > 0 ? '+' : ''}${(log.improvement * 100).toFixed(1)}%`
                            }
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>درختان: {log.best_params.n_estimators}</div>
                          <div>عمق: {log.best_params.max_depth || 'نامحدود'}</div>
                          <div>تقسیم: {log.best_params.min_samples_split}</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* نمودار پیشرفت دقت */}
      {logs.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              نمودار پیشرفت دقت
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {logs.slice(0, 10).map((log, index) => {
                const maxAccuracy = Math.max(...logs.map(l => l.accuracy));
                const percentage = (log.accuracy / maxAccuracy) * 100;
                
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{formatDate(log.timestamp)}</span>
                      <span className="font-medium">{(log.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}