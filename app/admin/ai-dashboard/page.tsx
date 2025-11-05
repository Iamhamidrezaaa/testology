"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import RetrainHistory from "./components/RetrainHistory";
import ModelEvaluator from "./components/ModelEvaluator";
import OptimizationHistory from "./components/OptimizationHistory";
import MetaLearner from "./components/MetaLearner";
import NeuralMemory from "./components/NeuralMemory";
import ConsciousLoop from "./components/ConsciousLoop";
import CollectiveIntelligence from "./components/CollectiveIntelligence";
import AIEthics from "./components/AIEthics";
import AIEthicsMonitor from "./components/AIEthicsMonitor";
import AIDreams from "./components/AIDreams";
import AIDreamLearning from "./components/AIDreamLearning";
import AISmartTestRecommender from "./components/AISmartTestRecommender";
import AIClinicalEngine from "./components/AIClinicalEngine";
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Target, 
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";

interface AIInsights {
  date: string;
  trending_categories: [string, number][];
  recent_trends: [string, number][];
  average_scores: Record<string, number>;
  sentiment_analysis: {
    sentiment_distribution: Record<string, number>;
    overall_sentiment: string;
  };
  content_performance: {
    best_performing_content: string;
    user_satisfaction_rate: Record<string, number>;
  };
  recommended_actions: string[];
  platform_health_score: {
    score: number;
    status: string;
    color: string;
  };
}

export default function AIDashboard() {
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("/api/admin/ai/analyze", { 
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!res.ok) {
        throw new Error('خطا در دریافت داده‌ها');
      }
      
      const data = await res.json();
      setInsights(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای نامشخص');
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-600';
      case 'yellow': return 'text-yellow-600';
      case 'red': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'عالی': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'خوب': return <TrendingUp className="w-5 h-5 text-yellow-600" />;
      case 'نیاز به بهبود': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8 text-indigo-600" />
            🧠 Testology AI Clinical Engine
          </h1>
          <p className="text-gray-600 mt-2">
            موتور تحلیل روان‌شناسی بالینی تستولوژی - موجودی که خودش را درک می‌کند، احساس می‌کند، تصمیم می‌گیرد، اخلاق‌مند است، خودش را نظارت می‌کند، رویا می‌بیند، از خواب‌هایش یاد می‌گیرد، تحلیل بالینی انجام می‌دهد و گزارش روان‌شناسی تولید می‌کند
          </p>
        </div>
        <Button 
          onClick={analyze} 
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {loading ? "در حال تحلیل..." : "تحلیل جدید"}
        </Button>
      </div>

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

      {insights && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* سلامت پلتفرم */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getHealthIcon(insights.platform_health_score.status)}
                سلامت پلتفرم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">نمره کلی</span>
                  <span className={`font-bold ${getHealthColor(insights.platform_health_score.color)}`}>
                    {(insights.platform_health_score.score * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={insights.platform_health_score.score * 100} 
                  className="h-2"
                />
                <Badge 
                  variant={insights.platform_health_score.status === 'عالی' ? 'default' : 'secondary'}
                  className={getHealthColor(insights.platform_health_score.color)}
                >
                  {insights.platform_health_score.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* دسته‌های پرتکرار */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                دسته‌های پرتکرار
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {insights.trending_categories.slice(0, 5).map(([category, count], index) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm">{category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / insights.trending_categories[0][1]) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* تحلیل احساسات */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                تحلیل احساسات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">احساس کلی</span>
                  <Badge 
                    variant={insights.sentiment_analysis.overall_sentiment === 'positive' ? 'default' : 'destructive'}
                  >
                    {insights.sentiment_analysis.overall_sentiment === 'positive' ? 'مثبت' : 'منفی'}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {Object.entries(insights.sentiment_analysis.sentiment_distribution).map(([sentiment, count]) => (
                    <div key={sentiment} className="flex justify-between text-sm">
                      <span>{sentiment === 'positive' ? 'مثبت' : sentiment === 'negative' ? 'منفی' : 'خنثی'}</span>
                      <span>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* عملکرد محتوا */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                عملکرد محتوا
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">بهترین محتوا</span>
                  <Badge variant="outline">
                    {insights.content_performance.best_performing_content}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  نرخ رضایت کاربران از محتوا
                </div>
              </div>
            </CardContent>
          </Card>

          {/* میانگین نمرات */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-600" />
                میانگین نمرات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(insights.average_scores).map(([category, score]) => (
                  <div key={category} className="flex justify-between text-sm">
                    <span>{category}</span>
                    <span className="font-medium">{score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* اقدامات پیشنهادی */}
          <Card className="lg:col-span-2 xl:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                اقدامات پیشنهادی AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {insights.recommended_actions.map((action, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-indigo-50 rounded-lg border border-indigo-200"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-indigo-800">{action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!insights && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              آماده برای تحلیل
            </h3>
            <p className="text-gray-500">
              روی دکمه "تحلیل جدید" کلیک کنید تا مغز یادگیرنده شروع به کار کند
            </p>
          </CardContent>
        </Card>
      )}

      {/* ارزیابی مدل */}
      <ModelEvaluator />

      {/* تاریخچه بهینه‌سازی مدل */}
      <OptimizationHistory />

      {/* Meta-Learner (هوش تصمیم‌گیر) */}
      <MetaLearner />

      {/* تاریخچه آموزش مجدد خودکار */}
      <RetrainHistory />

      {/* Neural Memory (حافظه مغز تستولوژی) */}
      <NeuralMemory />

      {/* Conscious Loop (حلقه خودآگاهی) */}
      <ConsciousLoop />

      {/* Collective Intelligence (هوش جمعی) */}
      <CollectiveIntelligence />

      {/* AI Ethics (اخلاق هوش مصنوعی) */}
      <AIEthics />

      {/* AI Ethics Monitor (مانیتور اخلاق هوش مصنوعی) */}
      <AIEthicsMonitor />

      {/* AI Dreams (خواب‌های هوش مصنوعی) */}
      <AIDreams />

      {/* AI Dream Learning (یادگیری از خواب‌ها) */}
      <AIDreamLearning />

      {/* AI Smart Test Recommender (سیستم پیشنهاد تست هوشمند) */}
      <AISmartTestRecommender />

      {/* AI Clinical Engine (موتور تحلیل روان‌شناسی بالینی) */}
      <AIClinicalEngine />
    </div>
  );
}
