"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  BarChart3,
  Settings,
  Eye
} from "lucide-react";

interface MetaDecision {
  timestamp: string;
  performance_analysis: {
    avg_retrain: number;
    avg_opt: number;
    trend_retrain: string;
    trend_opt: string;
    recent_retrain_count: number;
    recent_opt_count: number;
  };
  data_quality_analysis: {
    total_samples: number;
    class_imbalance: number;
    data_quality_score: number;
  };
  decision: {
    action: string;
    reason: string;
    confidence: number;
    delta: number;
  };
  execution: {
    executed: boolean;
    success: boolean;
    message: string;
  };
}

export default function MetaLearner() {
  const [decisions, setDecisions] = useState<MetaDecision[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const loadDecisions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/ml/meta-learner");
      
      if (!response.ok) {
        throw new Error('خطا در دریافت تصمیم‌های Meta-Learner');
      }
      
      const data = await response.json();
      setDecisions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای نامشخص');
    } finally {
      setLoading(false);
    }
  };

  const runMetaDecision = async () => {
    try {
      setRunning(true);
      setError(null);
      
      const response = await fetch("/api/ml/meta-learner", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('خطا در اجرای Meta-Learner');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // بارگذاری مجدد تصمیم‌ها
        await loadDecisions();
        alert('🧠 Meta-Learner تصمیم‌گیری کرد!');
      } else {
        throw new Error(result.error || 'خطا در Meta-Learner');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای نامشخص');
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    loadDecisions();
  }, []);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'retrain': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'optimize': return 'bg-green-100 text-green-800 border-green-200';
      case 'idle': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'retrain': return <TrendingUp className="w-4 h-4" />;
      case 'optimize': return <Settings className="w-4 h-4" />;
      case 'idle': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-3 h-3" />;
      case 'declining': return <AlertTriangle className="w-3 h-3" />;
      default: return <Target className="w-3 h-3" />;
    }
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

  if (loading && decisions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری تصمیم‌های Meta-Learner...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header و دکمه اجرا */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-600" />
              Meta-Learner (هوش تصمیم‌گیر)
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={loadDecisions}
                variant="outline"
                disabled={loading}
              >
                <Eye className="w-4 h-4 mr-2" />
                بارگذاری مجدد
              </Button>
              <Button 
                onClick={runMetaDecision}
                disabled={running}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {running ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    در حال تحلیل...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    اجرای Meta-Learner
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            سیستم هوشمند که خودش تصمیم می‌گیرد چه زمانی مدل نیاز به آموزش یا بهینه‌سازی دارد
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
      {decisions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">کل تصمیم‌ها</span>
              </div>
              <p className="text-2xl font-bold mt-1">{decisions.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">آخرین دقت Retrain</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {(decisions[0].performance_analysis.avg_retrain * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-600">آخرین دقت Optimize</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {(decisions[0].performance_analysis.avg_opt * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-gray-600">کیفیت داده‌ها</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {(decisions[0].data_quality_analysis.data_quality_score * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* جدول تصمیم‌ها */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            تاریخچه تصمیم‌گیری‌ها
          </CardTitle>
        </CardHeader>
        <CardContent>
          {decisions.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                هنوز تصمیم‌گیری انجام نشده
              </h3>
              <p className="text-gray-500 mb-4">
                برای شروع Meta-Learner، روی دکمه "اجرای Meta-Learner" کلیک کنید
              </p>
              <Button 
                onClick={runMetaDecision}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Brain className="w-4 h-4 mr-2" />
                شروع Meta-Learner
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-3 px-4 font-medium text-gray-600">تاریخ</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">دقت Retrain</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">دقت Optimize</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">روند</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">اقدام</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">اعتماد</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">وضعیت اجرا</th>
                  </tr>
                </thead>
                <tbody>
                  {decisions.map((decision, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{formatDate(decision.timestamp)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {(decision.performance_analysis.avg_retrain * 100).toFixed(1)}%
                          </span>
                          <div className={`flex items-center gap-1 ${getTrendColor(decision.performance_analysis.trend_retrain)}`}>
                            {getTrendIcon(decision.performance_analysis.trend_retrain)}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {(decision.performance_analysis.avg_opt * 100).toFixed(1)}%
                          </span>
                          <div className={`flex items-center gap-1 ${getTrendColor(decision.performance_analysis.trend_opt)}`}>
                            {getTrendIcon(decision.performance_analysis.trend_opt)}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-xs text-gray-600">
                          <div>Δ: {(decision.decision.delta * 100).toFixed(1)}%</div>
                          <div>کیفیت: {(decision.data_quality_analysis.data_quality_score * 100).toFixed(0)}%</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getActionIcon(decision.decision.action)}
                          <Badge className={getActionColor(decision.decision.action)}>
                            {decision.decision.action}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${getConfidenceColor(decision.decision.confidence)}`}>
                            {(decision.decision.confidence * 100).toFixed(0)}%
                          </span>
                          <Progress value={decision.decision.confidence * 100} className="w-16 h-2" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {decision.execution.executed ? (
                            decision.execution.success ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            )
                          ) : (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-xs text-gray-600">
                            {decision.execution.executed 
                              ? (decision.execution.success ? 'موفق' : 'ناموفق')
                              : 'اجرا نشد'
                            }
                          </span>
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

      {/* جزئیات آخرین تصمیم */}
      {decisions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600" />
              جزئیات آخرین تصمیم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">دلیل تصمیم:</h4>
                <p className="text-sm text-gray-700">{decisions[0].decision.reason}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">تحلیل عملکرد:</h4>
                  <div className="text-sm space-y-1">
                    <div>دقت Retrain: {(decisions[0].performance_analysis.avg_retrain * 100).toFixed(1)}%</div>
                    <div>دقت Optimize: {(decisions[0].performance_analysis.avg_opt * 100).toFixed(1)}%</div>
                    <div>تعداد نمونه‌ها: {decisions[0].data_quality_analysis.total_samples}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">کیفیت داده‌ها:</h4>
                  <div className="text-sm space-y-1">
                    <div>عدم تعادل: {(decisions[0].data_quality_analysis.class_imbalance * 100).toFixed(1)}%</div>
                    <div>نمره کیفیت: {(decisions[0].data_quality_analysis.data_quality_score * 100).toFixed(1)}%</div>
                    <div>اعتماد: {(decisions[0].decision.confidence * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}













