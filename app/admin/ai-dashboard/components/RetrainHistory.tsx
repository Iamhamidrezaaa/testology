"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  RefreshCw, 
  TrendingUp, 
  Database, 
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Calendar
} from "lucide-react";

interface RetrainLog {
  timestamp: string;
  samples: number;
  training_samples: number;
  test_samples: number;
  accuracy: number;
  model_params: {
    n_estimators: number;
    max_depth: number;
    features: string[];
  };
  backup_created: boolean;
  categories: string[];
  classification_report: Record<string, any>;
}

export default function RetrainHistory() {
  const [history, setHistory] = useState<RetrainLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retraining, setRetraining] = useState(false);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/ai/retrain-log");
      
      if (!response.ok) {
        throw new Error('خطا در دریافت تاریخچه');
      }
      
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای نامشخص');
    } finally {
      setLoading(false);
    }
  };

  const triggerRetrain = async () => {
    try {
      setRetraining(true);
      const response = await fetch("/api/ml/retrain", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('خطا در اجرای آموزش مجدد');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // بارگذاری مجدد تاریخچه
        await loadHistory();
        alert('✅ آموزش مجدد با موفقیت انجام شد!');
      } else {
        throw new Error(result.error || 'خطا در آموزش مجدد');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای نامشخص');
    } finally {
      setRetraining(false);
    }
  };

  useEffect(() => {
    loadHistory();
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

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'anxiety': 'اضطراب',
      'depression': 'افسردگی',
      'focus': 'تمرکز',
      'confidence': 'اعتماد به نفس',
      'stress': 'استرس'
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری تاریخچه...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header و دکمه آموزش مجدد */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-6 h-6 text-blue-600" />
              تاریخچه آموزش مجدد خودکار
            </CardTitle>
            <Button 
              onClick={triggerRetrain}
              disabled={retraining}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {retraining ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  در حال آموزش...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  آموزش مجدد دستی
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            سیستم به صورت خودکار هر هفته مدل را با داده‌های جدید بازآموزی می‌کند
          </p>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* آمار کلی */}
      {history.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">کل آموزش‌ها</span>
              </div>
              <p className="text-2xl font-bold mt-1">{history.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">آخرین دقت</span>
              </div>
              <p className={`text-2xl font-bold mt-1 ${getAccuracyColor(history[0].accuracy)}`}>
                {(history[0].accuracy * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-600">میانگین دقت</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {((history.reduce((sum, h) => sum + h.accuracy, 0) / history.length) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* تاریخچه آموزش‌ها */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            تاریخچه آموزش‌ها
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8">
              <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">هنوز آموزش‌ای انجام نشده است</p>
              <p className="text-sm text-gray-500 mt-2">
                روی دکمه "آموزش مجدد دستی" کلیک کنید تا اولین آموزش انجام شود
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div 
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatDate(item.timestamp)}
                      </span>
                      {index === 0 && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          جدیدترین
                        </Badge>
                      )}
                    </div>
                    <Badge className={getAccuracyBadge(item.accuracy)}>
                      دقت: {(item.accuracy * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">کل نمونه‌ها:</span>
                      <p className="font-medium">{item.samples.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">آموزش:</span>
                      <p className="font-medium">{item.training_samples.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">تست:</span>
                      <p className="font-medium">{item.test_samples.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">دسته‌ها:</span>
                      <p className="font-medium">{item.categories.length}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-500">دقت مدل</span>
                      <span className="font-medium">{(item.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={item.accuracy * 100} className="h-2" />
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {item.categories.map((category) => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {getCategoryLabel(category)}
                      </Badge>
                    ))}
                  </div>
                  
                  {item.backup_created && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>پشتیبان مدل قبلی ایجاد شد</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}













