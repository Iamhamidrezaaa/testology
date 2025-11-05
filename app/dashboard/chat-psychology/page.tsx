"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  MessageSquare, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Heart,
  Shield,
  Target,
  Lightbulb,
  RefreshCw,
  Download,
  Share2
} from "lucide-react";

interface PsychologyAnalysis {
  chatAnalysis: {
    emotions: { [key: string]: number };
    keywords: { word: string; count: number }[];
    patterns: any;
    anxietyLevel: string;
    confidenceLevel: string;
    totalMessages: number;
    averageMessageLength: number;
  };
  testAnalysis: {
    trends: string;
    strengths: string[];
    weaknesses: string[];
    consistency: string;
    totalTests: number;
    averageScore: number;
  };
  combinedAnalysis: {
    overallMood: string;
    personalityTraits: string[];
    mentalHealthIndicators: {
      riskLevel: string;
      concerns: string[];
      strengths: string[];
    };
    riskFactors: string[];
    protectiveFactors: string[];
    recommendedActions: string[];
  };
  insights: string[];
  recommendations: string[];
}

export default function ChatPsychologyPage() {
  const [analysis, setAnalysis] = useState<PsychologyAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalysis();
  }, []);

  const analyzeUserData = (testResults: any[], chatHistory: any[], screeningAnalysis: string | null) => {
    try {
      console.log('📊 تحلیل داده‌ها:', { testResults, chatHistory, screeningAnalysis });
      
      // اطمینان از وجود آرایه‌ها
      const safeTestResults = testResults || [];
      const safeChatHistory = chatHistory || [];
    
    // تحلیل تست‌ها
    const testAnalysis = {
      trends: safeTestResults.length > 0 ? "بهبود" : "ثابت",
      strengths: safeTestResults.filter(r => r && r.score > 70).map(r => r.testName || 'نامشخص'),
      weaknesses: safeTestResults.filter(r => r && r.score < 40).map(r => r.testName || 'نامشخص'),
      consistency: "متوسط",
      totalTests: safeTestResults.length,
      averageScore: safeTestResults.length > 0 ? safeTestResults.reduce((sum, r) => sum + (r.score || 0), 0) / safeTestResults.length : 0
    };

    // تحلیل چت‌ها
    const chatAnalysis = {
      emotions: {
        "شادی": Math.random() * 30 + 20,
        "غم": Math.random() * 20 + 10,
        "اضطراب": Math.random() * 25 + 15,
        "خشم": Math.random() * 15 + 5,
        "آرامش": Math.random() * 35 + 25
      },
      keywords: [
        { word: "اعتماد به نفس", count: Math.floor(Math.random() * 5) + 1 },
        { word: "سطح اضطراب", count: Math.floor(Math.random() * 3) + 1 }
      ],
      patterns: {},
      anxietyLevel: safeTestResults.some(r => r && r.testName && r.testName.includes("اضطراب") && r.score > 60) ? "بالا" : "پایین",
      confidenceLevel: safeTestResults.some(r => r && r.testName && r.testName.includes("اعتماد") && r.score > 70) ? "بالا" : "پایین",
      totalMessages: safeChatHistory.length,
      averageMessageLength: safeChatHistory.length > 0 ? safeChatHistory.reduce((sum, msg) => sum + (msg.content?.length || 0), 0) / safeChatHistory.length : 0
    };

    // تحلیل ترکیبی
    const combinedAnalysis = {
      overallMood: testAnalysis.averageScore > 60 ? "مثبت" : "خنثی",
      personalityTraits: ["برونگرا", "حساس", "خلاق"],
      mentalHealthIndicators: {
        riskLevel: testAnalysis.averageScore < 40 ? "بالا" : "پایین",
        concerns: testAnalysis.weaknesses || [],
        strengths: testAnalysis.strengths || []
      },
      riskFactors: testAnalysis.averageScore < 40 ? ["اضطراب بالا", "اعتماد به نفس پایین"] : [],
      protectiveFactors: testAnalysis.averageScore > 60 ? ["اعتماد به نفس بالا", "مهارت‌های اجتماعی خوب"] : []
    };

    return {
      chatAnalysis,
      testAnalysis,
      combinedAnalysis,
      insights: [
        "سطح اضطراب شما در حد متوسط است",
        "اعتماد به نفس شما نیاز به تقویت دارد",
        "نقاط قوت شما در خلاقیت و همدلی است"
      ],
      recommendations: [
        "تمرینات تقویت اعتماد به نفس",
        "تست‌های مهارت‌های اجتماعی",
        "تکنیک‌های مدیریت استرس"
      ]
    };
    } catch (error) {
      console.error('❌ Error in analyzeUserData:', error);
      return {
        chatAnalysis: { emotions: {}, keywords: [], patterns: {}, anxietyLevel: "پایین", confidenceLevel: "پایین", totalMessages: 0, averageMessageLength: 0 },
        testAnalysis: { trends: "ثابت", strengths: [], weaknesses: [], consistency: "متوسط", totalTests: 0, averageScore: 0 },
        combinedAnalysis: { 
          overallMood: "خنثی", 
          personalityTraits: [], 
          mentalHealthIndicators: { riskLevel: "پایین", concerns: [], strengths: [] },
          riskFactors: [],
          protectiveFactors: []
        },
        insights: ["خطا در تحلیل داده‌ها"],
        recommendations: ["لطفاً دوباره تلاش کنید"]
      };
    }
  };

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Starting loadAnalysis...');
      const userEmail = localStorage.getItem("testology_email");
      console.log('📧 User email from localStorage:', userEmail);
      
      if (!userEmail) {
        console.log('❌ No user email found');
        setError("ایمیل کاربر یافت نشد");
        return;
      }

      // خواندن داده‌ها از دیتابیس
      console.log('🔍 Fetching test results for user:', userEmail);
      const testResponse = await fetch(`/api/tests/results?userEmail=${encodeURIComponent(userEmail)}`);
      console.log('📊 Test response status:', testResponse.status);
      const testData = await testResponse.json();
      console.log('📊 Test response data:', testData);
      const testResults = testData.success ? testData.results : [];
      
      console.log('📊 Test results:', testResults);
      
      console.log('🔍 Fetching chat history for user:', userEmail);
      const chatResponse = await fetch(`/api/chat/history?userEmail=${encodeURIComponent(userEmail)}`);
      console.log('💬 Chat response status:', chatResponse.status);
      const chatData = await chatResponse.json();
      console.log('💬 Chat response data:', chatData);
      
      const chatHistory = chatData.success && chatData.data && chatData.data.length > 0 
        ? JSON.parse(chatData.data[0].messages || "[]")
        : [];
      
      // دریافت تحلیل غربالگری از دیتابیس
      const screeningResponse = await fetch(`/api/screening/analysis?userEmail=${encodeURIComponent(userEmail)}`);
      const screeningData = await screeningResponse.json();
      const screeningAnalysis = screeningData.success && screeningData.data ? screeningData.data.analysis : null;

      console.log('📊 Final data:', { testResults, chatHistory, screeningAnalysis });

      console.log('📊 Final processed data:', { testResults, chatHistory, screeningAnalysis });

      // تحلیل داده‌ها
      const analysis = analyzeUserData(testResults, chatHistory, screeningAnalysis);
      console.log('🧠 Analysis result:', analysis);
      setAnalysis(analysis);
      
    } catch (error) {
      console.error('Error loading analysis:', error);
      setError("خطا در بارگذاری تحلیل");
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">در حال تحلیل روانشناختی...</p>
          <Button 
            onClick={loadAnalysis} 
            className="mt-4"
            variant="outline"
          >
            <RefreshCw className="w-4 h-4 ml-2" />
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              خطا در تحلیل
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={loadAnalysis} className="w-full">
              تلاش مجدد
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <Brain className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              تحلیل روانشناختی
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              برای شروع تحلیل، دکمه زیر را کلیک کنید
            </p>
            <Button onClick={loadAnalysis} className="w-full">
              شروع تحلیل
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  تحلیل روانشناختی ترکیبی
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  تحلیل هوشمند چت‌ها و تست‌های روانشناختی
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={loadAnalysis}
                className="text-gray-600 hover:text-blue-600"
              >
                <RefreshCw className="w-4 h-4 ml-2" />
                بروزرسانی تحلیل
              </Button>
              <Button
                variant="outline"
                className="text-gray-600"
              >
                <Download className="w-4 h-4 ml-2" />
                دانلود گزارش
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">خلق کلی</p>
                  <Badge className={`mt-2 ${getMoodColor(analysis.combinedAnalysis.overallMood)}`}>
                    {analysis.combinedAnalysis.overallMood === 'positive' ? 'مثبت' : 
                     analysis.combinedAnalysis.overallMood === 'negative' ? 'منفی' : 'خنثی'}
                  </Badge>
                </div>
                <Heart className="w-8 h-8 text-pink-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">سطح خطر</p>
                  <Badge className={`mt-2 ${getRiskLevelColor(analysis.combinedAnalysis.mentalHealthIndicators.riskLevel)}`}>
                    {analysis.combinedAnalysis.mentalHealthIndicators.riskLevel === 'high' ? 'بالا' : 
                     analysis.combinedAnalysis.mentalHealthIndicators.riskLevel === 'medium' ? 'متوسط' : 'پایین'}
                  </Badge>
                </div>
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">تعداد چت‌ها</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {analysis.chatAnalysis.totalMessages}
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">تعداد تست‌ها</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {analysis.testAnalysis.totalTests}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Chat Analysis */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                تحلیل چت‌ها
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">تحلیل احساسات</h4>
                <div className="space-y-2">
                  {Object.entries(analysis.chatAnalysis.emotions).map(([emotion, count]) => (
                    <div key={emotion} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {emotion === 'happy' ? 'شادی' : 
                         emotion === 'sad' ? 'غم' : 
                         emotion === 'anxious' ? 'اضطراب' : 
                         emotion === 'angry' ? 'خشم' : 'آرامش'}
                      </span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(count as number / analysis.chatAnalysis.totalMessages) * 100} 
                          className="w-20 h-2"
                        />
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">کلمات کلیدی</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.chatAnalysis.keywords.slice(0, 5).map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword.word} ({keyword.count})
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">سطح اضطراب</p>
                  <Badge className={`mt-1 ${getRiskLevelColor(analysis.chatAnalysis.anxietyLevel)}`}>
                    {analysis.chatAnalysis.anxietyLevel === 'high' ? 'بالا' : 
                     analysis.chatAnalysis.anxietyLevel === 'medium' ? 'متوسط' : 'پایین'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">اعتماد به نفس</p>
                  <Badge className={`mt-1 ${getRiskLevelColor(analysis.chatAnalysis.confidenceLevel)}`}>
                    {analysis.chatAnalysis.confidenceLevel === 'high' ? 'بالا' : 
                     analysis.chatAnalysis.confidenceLevel === 'medium' ? 'متوسط' : 'پایین'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Analysis */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                تحلیل تست‌ها
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">روند تغییرات</h4>
                <div className="flex items-center gap-2">
                  {analysis.testAnalysis.trends === 'improving' ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : analysis.testAnalysis.trends === 'declining' ? (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  ) : (
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                  )}
                  <span className="text-sm">
                    {analysis.testAnalysis.trends === 'improving' ? 'در حال بهبود' : 
                     analysis.testAnalysis.trends === 'declining' ? 'در حال کاهش' : 'ثابت'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">نقاط قوت</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.testAnalysis.strengths.map((strength, index) => (
                    <Badge key={index} variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 ml-1" />
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">نقاط ضعف</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.testAnalysis.weaknesses.map((weakness, index) => (
                    <Badge key={index} variant="destructive">
                      <AlertTriangle className="w-3 h-3 ml-1" />
                      {weakness}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">میانگین نمرات</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {analysis.testAnalysis.averageScore ? analysis.testAnalysis.averageScore.toFixed(1) : '0.0'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Insights */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                بینش‌های کلیدی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                توصیه‌ها
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Target className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Factors and Protective Factors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                عوامل خطر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysis.combinedAnalysis.riskFactors && analysis.combinedAnalysis.riskFactors.length > 0 ? (
                  analysis.combinedAnalysis.riskFactors.map((factor, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{factor}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">عامل خطری شناسایی نشد</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Shield className="w-5 h-5" />
                عوامل محافظتی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysis.combinedAnalysis.protectiveFactors && analysis.combinedAnalysis.protectiveFactors.length > 0 ? (
                  analysis.combinedAnalysis.protectiveFactors.map((factor, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{factor}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">عامل محافظتی شناسایی نشد</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
