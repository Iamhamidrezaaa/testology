"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Flame,
  TrendingUp,
  Calendar,
  Target,
  Lightbulb,
  RefreshCw,
  Download,
  Filter,
  Star
} from "lucide-react";

interface LearningStats {
  totalCourses: number;
  completedCourses: number;
  totalStudyTime: number;
  consecutiveDays: number;
}

interface WeeklyProgress {
  week: string;
  exercises: number;
  studyTime: number;
  score: number;
}

interface DailyStudyTime {
  day: string;
  minutes: number;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  duration: number;
  instructions: string;
  difficulty: string;
}

export default function LearningCenterPage() {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([]);
  const [dailyStudyTime, setDailyStudyTime] = useState<DailyStudyTime[]>([]);
  const [recommendedExercises, setRecommendedExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userEmail = localStorage.getItem("testology_email");
      if (!userEmail) {
        setError("ایمیل کاربر یافت نشد");
        return;
      }

      // دریافت آمار
      const statsResponse = await fetch(`/api/learning-center/stats?email=${encodeURIComponent(userEmail)}`);
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats(statsData.stats);
        setWeeklyProgress(statsData.charts.weeklyProgress);
        setDailyStudyTime(statsData.charts.dailyStudyTime);
      }

      // دریافت تمرینات پیشنهادی
      const exercisesResponse = await fetch(`/api/exercises/recommend?email=${encodeURIComponent(userEmail)}`);
      const exercisesData = await exercisesResponse.json();
      
      if (exercisesData.success) {
        setRecommendedExercises(exercisesData.exercises);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError("خطا در بارگذاری داده‌ها");
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'آسان': return 'bg-green-100 text-green-800';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800';
      case 'سخت': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'اضطراب': return 'bg-blue-100 text-blue-800';
      case 'استرس': return 'bg-orange-100 text-orange-800';
      case 'اعتماد به نفس': return 'bg-purple-100 text-purple-800';
      case 'عمومی': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">در حال بارگذاری مرکز یادگیری...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center" dir="rtl">
        <Card className="max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              خطا در بارگذاری
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={loadData} className="w-full">
              تلاش مجدد
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800" dir="rtl">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  مرکز یادگیری
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  توسعه مهارت‌ها و دانش روان‌شناختی شما
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={loadData}
                className="text-gray-600 hover:text-blue-600"
              >
                <RefreshCw className="w-4 h-4 ml-2" />
                بروزرسانی
              </Button>
              <Button
                variant="outline"
                className="text-gray-600"
              >
                <Download className="w-4 h-4 ml-2" />
                دانلود گواهی
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select className="px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
              <option>همه دسته‌بندی‌ها</option>
              <option>اضطراب</option>
              <option>استرس</option>
              <option>اعتماد به نفس</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600">
              <option>همه سطوح</option>
              <option>آسان</option>
              <option>متوسط</option>
              <option>سخت</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">دوره‌های موجود</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats?.totalCourses || 0}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">دوره‌های تکمیل شده</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats?.completedCourses || 0}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ساعت مطالعه</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {Math.round((stats?.totalStudyTime || 0) / 60)}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">روز متوالی</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats?.consecutiveDays || 0}
                  </p>
                </div>
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Progress Chart */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                پیشرفت یادگیری در طول زمان
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyProgress.map((week, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{week.week}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">امتیاز:</span>
                        <span className="text-sm font-medium">{week.score}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">زمان:</span>
                        <span className="text-sm font-medium">{week.studyTime} دقیقه</span>
                      </div>
                      <Progress value={(week.exercises / 10) * 100} className="w-20 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Daily Study Time Chart */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                زمان مطالعه روزانه
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyStudyTime.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{day.day}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(day.minutes / 60) * 100} className="w-32 h-2" />
                      <span className="text-sm font-medium">{day.minutes} دقیقه</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Exercises */}
        <Card className="bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              تمرینات پیشنهادی بر اساس تحلیل روانی شما
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedExercises.map((exercise) => (
                <Card key={exercise.id} className="border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {exercise.title}
                      </h3>
                      <Badge className={getDifficultyColor(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {exercise.description}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getTypeColor(exercise.type)}>
                        {exercise.type}
                      </Badge>
                      <Badge variant="outline">
                        {exercise.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {exercise.duration} دقیقه
                      </div>
                      <Button size="sm" className="text-xs">
                        شروع تمرین
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Guide */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              راهنمای استفاده از مرکز یادگیری
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">نحوه شروع</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    انتخاب دوره‌های مناسب با سطح شما
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    دنبال کردن مسیرهای یادگیری پیشنهادی
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    پیگیری پیشرفت خود در داشبورد
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    جمع‌آوری دستاوردها و گواهی‌ها
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">نکات مهم</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    مطالعه منظم و پیوسته
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    تمرین عملی آموخته‌ها
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    مشارکت در بحث‌ها و تبادل نظر
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    دریافت بازخورد از مربیان
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}





