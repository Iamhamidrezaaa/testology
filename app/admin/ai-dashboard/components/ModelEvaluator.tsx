"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Eye,
  Brain,
  Zap
} from "lucide-react";

interface EvaluationData {
  status: string;
  timestamp: string;
  metrics: {
    accuracy: number;
    confusion_matrix: number[][];
    labels: string[];
    report: Record<string, any>;
    precision: number[];
    recall: number[];
    f1_scores: number[];
    support: number[];
    auc_scores?: Record<string, number>;
    cross_validation?: {
      mean: number;
      std: number;
      scores: number[];
    };
  };
  suggestions: string[];
  heatmap_data: Array<{
    true_label: string;
    predicted_label: string;
    value: number;
    percentage: number;
  }>;
  model_info: {
    n_features: number;
    n_samples: number;
    n_classes: number;
    model_type: string;
  };
}

export default function ModelEvaluator() {
  const [data, setData] = useState<EvaluationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEvaluationData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/admin/ai/evaluate");
      
      if (!response.ok) {
        throw new Error('خطا در دریافت داده‌های ارزیابی');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.message || 'خطا در بارگذاری داده‌ها');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای نامشخص');
    } finally {
      setLoading(false);
    }
  };

  const runEvaluation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/admin/ai/evaluate", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('خطا در اجرای ارزیابی');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        alert('✅ ارزیابی مدل با موفقیت انجام شد!');
      } else {
        throw new Error(result.error || 'خطا در ارزیابی');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای نامشخص');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvaluationData();
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

  const getHeatmapColor = (value: number, maxValue: number) => {
    const intensity = value / maxValue;
    if (intensity > 0.8) return 'bg-red-500 text-white';
    if (intensity > 0.6) return 'bg-orange-400 text-white';
    if (intensity > 0.4) return 'bg-yellow-300 text-black';
    if (intensity > 0.2) return 'bg-green-300 text-black';
    return 'bg-gray-200 text-black';
  };

  if (loading && !data) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال ارزیابی مدل...</p>
        </CardContent>
      </Card>
      );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <Button 
            onClick={runEvaluation}
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            تلاش مجدد
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            ارزیابی مدل انجام نشده
          </h3>
          <p className="text-gray-500 mb-4">
            برای مشاهده عملکرد مدل، ابتدا ارزیابی انجام دهید
          </p>
          <Button 
            onClick={runEvaluation}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            ارزیابی مدل
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { metrics, suggestions, heatmap_data, model_info } = data;
  const maxHeatmapValue = Math.max(...heatmap_data.map(d => d.value));

  return (
    <div className="space-y-6">
      {/* Header و دکمه ارزیابی */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-indigo-600" />
              ارزیابی مدل یادگیرنده
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={loadEvaluationData}
                variant="outline"
                disabled={loading}
              >
                <Target className="w-4 h-4 mr-2" />
                بارگذاری مجدد
              </Button>
              <Button 
                onClick={runEvaluation}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    در حال ارزیابی...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    ارزیابی جدید
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            تحلیل عملکرد مدل، شناسایی نقاط ضعف و پیشنهاد بهبود
          </p>
        </CardContent>
      </Card>

      {/* آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">دقت کلی</span>
            </div>
            <p className={`text-2xl font-bold mt-1 ${getAccuracyColor(metrics.accuracy)}`}>
              {(metrics.accuracy * 100).toFixed(1)}%
            </p>
            <Badge className={getAccuracyBadge(metrics.accuracy)}>
              {metrics.accuracy >= 0.9 ? 'عالی' : metrics.accuracy >= 0.8 ? 'خوب' : 'نیاز به بهبود'}
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">تعداد کلاس‌ها</span>
            </div>
            <p className="text-2xl font-bold mt-1">{metrics.labels.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">نمونه‌ها</span>
            </div>
            <p className="text-2xl font-bold mt-1">{model_info.n_samples.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-600">نوع مدل</span>
            </div>
            <p className="text-sm font-medium mt-1">{model_info.model_type}</p>
          </CardContent>
        </Card>
      </div>

      {/* نمودار F1-Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            عملکرد مدل بر اساس F1-Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.labels.map((label, index) => {
              const f1 = metrics.f1_scores[index];
              const precision = metrics.precision[index];
              const recall = metrics.recall[index];
              
              return (
                <div key={label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{getCategoryLabel(label)}</span>
                    <div className="flex gap-2 text-sm">
                      <span className="text-blue-600">F1: {(f1 * 100).toFixed(1)}%</span>
                      <span className="text-green-600">Precision: {(precision * 100).toFixed(1)}%</span>
                      <span className="text-purple-600">Recall: {(recall * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <Progress value={f1 * 100} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Heatmap ماتریس سردرگمی */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-red-600" />
            Heatmap ماتریس سردرگمی
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-center border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 border border-gray-300 font-medium">واقعی \ پیش‌بینی</th>
                  {metrics.labels.map((label) => (
                    <th key={label} className="px-3 py-2 border border-gray-300 font-medium">
                      {getCategoryLabel(label)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.labels.map((trueLabel, i) => (
                  <tr key={trueLabel}>
                    <td className="px-3 py-2 border border-gray-300 font-medium bg-gray-50">
                      {getCategoryLabel(trueLabel)}
                    </td>
                    {metrics.labels.map((predLabel, j) => {
                      const value = metrics.confusion_matrix[i][j];
                      const percentage = ((value / metrics.support[i]) * 100).toFixed(1);
                      
                      return (
                        <td
                          key={predLabel}
                          className={`px-3 py-2 border border-gray-300 font-medium ${getHeatmapColor(value, maxHeatmapValue)}`}
                        >
                          <div className="text-sm">{value}</div>
                          <div className="text-xs opacity-75">{percentage}%</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>رنگ‌بندی: قرمز = خطای بالا، سبز = دقت بالا</p>
          </div>
        </CardContent>
      </Card>

      {/* پیشنهادات بهبود */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            پیشنهادات بهبود مدل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
              >
                <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-yellow-800">{suggestion}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cross-Validation */}
      {metrics.cross_validation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Cross-Validation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">میانگین دقت:</span>
                <p className="text-lg font-bold">{(metrics.cross_validation.mean * 100).toFixed(1)}%</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">انحراف معیار:</span>
                <p className="text-lg font-bold">{(metrics.cross_validation.std * 100).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}













