"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Lightbulb, 
  Target, 
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";

interface Recommendation {
  status: string;
  predicted_category: string;
  confidence: number;
  all_probabilities: Record<string, number>;
  suggestions: string[];
  personalized_message: string;
}

interface PersonalizedRecommendationsProps {
  userData: {
    score: number;
    gender: string;
    age: number;
  };
}

export default function PersonalizedRecommendations({ userData }: PersonalizedRecommendationsProps) {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("/api/ml/predict", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      if (!res.ok) {
        throw new Error('خطا در دریافت پیشنهادات');
      }
      
      const data = await res.json();
      setRecommendation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای نامشخص');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'anxiety': 'bg-red-100 text-red-800 border-red-200',
      'depression': 'bg-blue-100 text-blue-800 border-blue-200',
      'focus': 'bg-green-100 text-green-800 border-green-200',
      'confidence': 'bg-purple-100 text-purple-800 border-purple-200',
      'stress': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-indigo-600" />
          پیشنهادات شخصی‌سازی‌شده AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!recommendation && !loading && (
          <div className="text-center py-8">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              برای دریافت پیشنهادات شخصی‌سازی‌شده، روی دکمه زیر کلیک کنید
            </p>
            <Button 
              onClick={getRecommendations}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              دریافت پیشنهادات
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال تحلیل داده‌ها...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-600">
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {recommendation && (
          <div className="space-y-6">
            {/* نتیجه تحلیل */}
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-indigo-600" />
                <span className="font-medium">نتیجه تحلیل</span>
              </div>
              <p className="text-sm text-indigo-800 mb-3">
                {recommendation.personalized_message}
              </p>
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(recommendation.predicted_category)}>
                  {getCategoryLabel(recommendation.predicted_category)}
                </Badge>
                <span className="text-sm text-gray-600">
                  اطمینان: {(recommendation.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* پیشنهادات */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                پیشنهادات شخصی‌سازی‌شده
              </h4>
              <div className="space-y-2">
                {recommendation.suggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* احتمال‌های دیگر */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                احتمال‌های دیگر
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(recommendation.all_probabilities)
                  .filter(([category, prob]) => category !== recommendation.predicted_category)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 4)
                  .map(([category, probability]) => (
                    <div 
                      key={category}
                      className="p-2 bg-gray-50 rounded text-center"
                    >
                      <div className="text-xs text-gray-600">
                        {getCategoryLabel(category)}
                      </div>
                      <div className="text-sm font-medium">
                        {(probability * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* دکمه تحلیل مجدد */}
            <div className="pt-4 border-t">
              <Button 
                onClick={getRecommendations}
                variant="outline"
                className="w-full"
              >
                تحلیل مجدد
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}













