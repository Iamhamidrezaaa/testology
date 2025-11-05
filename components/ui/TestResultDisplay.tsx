"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Brain,
  Heart,
  Target,
  Award
} from "lucide-react";
import { SimpleTestStorage } from "@/lib/simple-test-storage";

interface TestResultDisplayProps {
  testId: string;
  testName: string;
  score: number;
  result: string;
  analysis?: string;
  completedAt: Date;
}

export default function TestResultDisplay({
  testId,
  testName,
  score,
  result,
  analysis,
  completedAt
}: TestResultDisplayProps) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // دریافت آمار تست‌ها
    const testStats = SimpleTestStorage.getTestStats();
    setStats(testStats);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-blue-600 bg-blue-100";
    if (score >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Award className="w-5 h-5" />;
    if (score >= 60) return <CheckCircle className="w-5 h-5" />;
    if (score >= 40) return <Target className="w-5 h-5" />;
    return <Heart className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      {/* نتیجه تست */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Brain className="w-6 h-6 text-blue-500" />
              {testName}
            </CardTitle>
            <Badge className={`px-3 py-1 ${getScoreColor(score)}`}>
              {getScoreIcon(score)}
              <span className="ml-1 font-bold">{score}%</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">نتیجه شما:</h3>
            <p className="text-gray-600 dark:text-gray-300">{result}</p>
          </div>

          {analysis && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">تحلیل تخصصی:</h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">{analysis}</p>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(completedAt).toLocaleDateString('fa-IR')}
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              تست تکمیل شده
            </div>
          </div>
        </CardContent>
      </Card>

      {/* آمار کلی */}
      {stats && stats.totalTests > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">آمار تست‌های شما</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalTests}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">تست انجام شده</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.averageScore}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">میانگین نمره</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.floor(stats.averageScore / 20) + 1}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">سطح شما</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.totalTests * 50}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">XP کسب شده</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* دکمه‌های عملیات */}
      <div className="flex gap-3">
        <Button 
          onClick={() => window.location.href = '/dashboard'}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Brain className="w-4 h-4 ml-2" />
          مشاهده داشبورد
        </Button>
        <Button 
          variant="outline"
          onClick={() => window.location.href = '/tests'}
        >
          تست‌های بیشتر
        </Button>
      </div>
    </div>
  );
}




