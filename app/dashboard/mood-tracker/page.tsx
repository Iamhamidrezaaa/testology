"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  BarChart3,
  Target, 
  Lightbulb,
  RefreshCw,
  Download,
  Plus,
  Edit,
  Trash2,
  Smile,
  Frown,
  Meh
} from "lucide-react";

interface MoodEntry {
  id: string;
  date: string;
  mood: 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad';
  energy: number; // 1-10
  stress: number; // 1-10
  anxiety: number; // 1-10
  sleep: number; // 1-10
  notes: string;
}

interface MoodStats {
  averageMood: number;
  totalEntries: number;
  streak: number;
  bestMood: string;
  worstMood: string;
  weeklyTrend: 'improving' | 'declining' | 'stable';
}

export default function MoodTrackerPage() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    mood: 'neutral' as const,
    energy: 5,
    stress: 5,
    anxiety: 5,
    sleep: 5,
    notes: ''
  });
  
  useEffect(() => {
    loadMoodData();
  }, []);

  const loadMoodData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // داده‌های فیک برای نمایش
      const fakeData = generateFakeMoodData();
      setMoodEntries(fakeData);
      
      // محاسبه آمار
      const calculatedStats = calculateMoodStats(fakeData);
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error loading mood data:', error);
      setError("خطا در بارگذاری داده‌های خلق");
    } finally {
      setLoading(false);
    }
  };

  const generateFakeMoodData = (): MoodEntry[] => {
    const entries: MoodEntry[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // تولید داده‌های تصادفی با روند
      const baseMood = 3 + Math.sin(i * 0.2) * 1.5 + Math.random() * 0.5;
      const moodValue = Math.max(1, Math.min(5, Math.round(baseMood)));
      
      const moods = ['very-sad', 'sad', 'neutral', 'happy', 'very-happy'];
      const mood = moods[moodValue - 1] as MoodEntry['mood'];
      
      entries.push({
        id: `entry-${i}`,
        date: date.toISOString().split('T')[0],
        mood,
        energy: Math.max(1, Math.min(10, Math.round(5 + Math.sin(i * 0.3) * 2 + Math.random() * 2))),
        stress: Math.max(1, Math.min(10, Math.round(5 - Math.sin(i * 0.2) * 1.5 + Math.random() * 2))),
        anxiety: Math.max(1, Math.min(10, Math.round(4 + Math.sin(i * 0.25) * 1.5 + Math.random() * 2))),
        sleep: Math.max(1, Math.min(10, Math.round(6 + Math.sin(i * 0.15) * 1.5 + Math.random() * 1.5))),
        notes: i % 7 === 0 ? `یادداشت روز ${30 - i}: ${getRandomNote()}` : ''
      });
    }
    
    return entries;
  };

  const getRandomNote = () => {
    const notes = [
      "روز خوبی بود، با دوستان وقت گذراندم",
      "کمی استرس داشتم اما مدیریت کردم",
      "خواب خوبی نداشتم، خسته هستم",
      "انرژی زیادی داشتم، کارهای زیادی انجام دادم",
      "احساس اضطراب داشتم، نفس عمیق کشیدم",
      "روز آرامی بود، کتاب خواندم",
      "مشکلی در کار داشتم، ناراحت شدم",
      "ورزش کردم، احساس بهتری دارم"
    ];
    return notes[Math.floor(Math.random() * notes.length)];
  };

  const calculateMoodStats = (entries: MoodEntry[]): MoodStats => {
    if (entries.length === 0) {
      return {
        averageMood: 3,
        totalEntries: 0,
        streak: 0,
        bestMood: 'neutral',
        worstMood: 'neutral',
        weeklyTrend: 'stable'
      };
    }

    const moodValues = entries.map(entry => {
      const moodMap = { 'very-sad': 1, 'sad': 2, 'neutral': 3, 'happy': 4, 'very-sad': 5 };
      return moodMap[entry.mood] || 3;
    });

    const averageMood = moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length;
    
    // محاسبه روند هفتگی
    const recentWeek = entries.slice(0, 7);
    const previousWeek = entries.slice(7, 14);
    
    const recentAvg = recentWeek.reduce((sum, entry) => {
      const moodMap = { 'very-sad': 1, 'sad': 2, 'neutral': 3, 'happy': 4, 'very-happy': 5 };
      return sum + (moodMap[entry.mood] || 3);
    }, 0) / recentWeek.length;
    
    const previousAvg = previousWeek.reduce((sum, entry) => {
      const moodMap = { 'very-sad': 1, 'sad': 2, 'neutral': 3, 'happy': 4, 'very-happy': 5 };
      return sum + (moodMap[entry.mood] || 3);
    }, 0) / previousWeek.length;

    let weeklyTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (recentAvg > previousAvg + 0.5) weeklyTrend = 'improving';
    else if (recentAvg < previousAvg - 0.5) weeklyTrend = 'declining';

    return {
      averageMood,
      totalEntries: entries.length,
      streak: calculateStreak(entries),
      bestMood: entries.reduce((best, entry) => {
        const moodMap = { 'very-sad': 1, 'sad': 2, 'neutral': 3, 'happy': 4, 'very-happy': 5 };
        const bestValue = moodMap[best.mood] || 3;
        const currentValue = moodMap[entry.mood] || 3;
        return currentValue > bestValue ? entry : best;
      }, entries[0]).mood,
      worstMood: entries.reduce((worst, entry) => {
        const moodMap = { 'very-sad': 1, 'sad': 2, 'neutral': 3, 'happy': 4, 'very-happy': 5 };
        const worstValue = moodMap[worst.mood] || 3;
        const currentValue = moodMap[entry.mood] || 3;
        return currentValue < worstValue ? entry : worst;
      }, entries[0]).mood,
      weeklyTrend
    };
  };

  const calculateStreak = (entries: MoodEntry[]): number => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < entries.length; i++) {
      const entryDate = new Date(entries[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (entryDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'very-happy': return <Smile className="w-6 h-6 text-green-500" />;
      case 'happy': return <Smile className="w-5 h-5 text-green-400" />;
      case 'neutral': return <Meh className="w-5 h-5 text-yellow-500" />;
      case 'sad': return <Frown className="w-5 h-5 text-orange-500" />;
      case 'very-sad': return <Frown className="w-6 h-6 text-red-500" />;
      default: return <Meh className="w-5 h-5 text-gray-500" />;
    }
  };

  const getMoodText = (mood: string) => {
    switch (mood) {
      case 'very-happy': return 'خیلی خوشحال';
      case 'happy': return 'خوشحال';
      case 'neutral': return 'خنثی';
      case 'sad': return 'غمگین';
      case 'very-sad': return 'خیلی غمگین';
      default: return 'نامشخص';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'very-happy': return 'bg-green-100 text-green-800';
      case 'happy': return 'bg-green-50 text-green-700';
      case 'neutral': return 'bg-yellow-100 text-yellow-800';
      case 'sad': return 'bg-orange-100 text-orange-800';
      case 'very-sad': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddEntry = () => {
    const newMoodEntry: MoodEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...newEntry
    };
    
    setMoodEntries(prev => [newMoodEntry, ...prev]);
    setShowAddForm(false);
    setNewEntry({
      mood: 'neutral',
      energy: 5,
      stress: 5,
      anxiety: 5,
      sleep: 5,
      notes: ''
    });
    
    // محاسبه مجدد آمار
    const updatedEntries = [newMoodEntry, ...moodEntries];
    const updatedStats = calculateMoodStats(updatedEntries);
    setStats(updatedStats);
  };

  if (loading) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-pink-500" />
          <p className="text-gray-600 dark:text-gray-400">در حال بارگذاری ردیاب خلق...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center" dir="rtl">
        <Card className="max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              خطا در بارگذاری
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={loadMoodData} className="w-full">
              تلاش مجدد
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800" dir="rtl">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  ردیاب خلق
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  پیگیری احساسات و خلق روزانه شما
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
            <Button
                variant="outline"
              onClick={loadMoodData}
                className="text-gray-600 hover:text-pink-600"
            >
                <RefreshCw className="w-4 h-4 ml-2" />
              بروزرسانی
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">میانگین خلق</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats?.averageMood.toFixed(1) || '0.0'}
                  </p>
                </div>
                <Heart className="w-8 h-8 text-pink-500" />
              </div>
              </CardContent>
            </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">تعداد ورودی‌ها</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats?.totalEntries || 0}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
              </CardContent>
            </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">روند هفتگی</p>
                  <div className="flex items-center gap-2 mt-2">
                    {stats?.weeklyTrend === 'improving' ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : stats?.weeklyTrend === 'declining' ? (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    ) : (
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                    )}
                    <span className="text-sm">
                      {stats?.weeklyTrend === 'improving' ? 'در حال بهبود' : 
                       stats?.weeklyTrend === 'declining' ? 'در حال کاهش' : 'ثابت'}
                    </span>
                  </div>
                </div>
                <Target className="w-8 h-8 text-green-500" />
              </div>
              </CardContent>
            </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">بهترین خلق</p>
                  <Badge className={`mt-2 ${getMoodColor(stats?.bestMood || 'neutral')}`}>
                    {getMoodText(stats?.bestMood || 'neutral')}
                  </Badge>
                </div>
                <Smile className="w-8 h-8 text-yellow-500" />
              </div>
              </CardContent>
            </Card>
        </div>

        {/* Add New Entry */}
        <Card className="bg-white/80 backdrop-blur-sm mb-8">
              <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-500" />
              ثبت خلق امروز
                </CardTitle>
              </CardHeader>
              <CardContent>
            {!showAddForm ? (
              <Button onClick={() => setShowAddForm(true)} className="w-full">
                <Plus className="w-4 h-4 ml-2" />
                ثبت خلق جدید
              </Button>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      خلق کلی
                    </label>
                    <div className="flex gap-2">
                      {['very-sad', 'sad', 'neutral', 'happy', 'very-happy'].map((mood) => (
                        <button
                          key={mood}
                          onClick={() => setNewEntry(prev => ({ ...prev, mood: mood as any }))}
                          className={`p-2 rounded-lg border ${
                            newEntry.mood === mood 
                              ? 'border-pink-500 bg-pink-50' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {getMoodIcon(mood)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      انرژی (1-10)
                    </label>
                    <input
                      type="range"
                      min="1" max="10"
                      value={newEntry.energy}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, energy: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600">{newEntry.energy}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      استرس (1-10)
                    </label>
                    <input
                      type="range"
                      min="1" max="10"
                      value={newEntry.stress}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, stress: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600">{newEntry.stress}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      اضطراب (1-10)
                    </label>
                    <input
                      type="range"
                      min="1" max="10"
                      value={newEntry.anxiety}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, anxiety: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600">{newEntry.anxiety}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      کیفیت خواب (1-10)
                    </label>
                    <input
                      type="range"
                      min="1" max="10"
                      value={newEntry.sleep}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, sleep: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-600">{newEntry.sleep}</div>
                  </div>
                  </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    یادداشت (اختیاری)
                  </label>
                  <textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="احساسات و تجربیات امروز خود را بنویسید..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleAddEntry} className="flex-1">
                    ثبت خلق
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    لغو
                  </Button>
                </div>
              </div>
                )}
              </CardContent>
            </Card>

        {/* Mood History */}
        <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              تاریخچه خلق (30 روز گذشته)
                </CardTitle>
              </CardHeader>
              <CardContent>
            <div className="space-y-4">
              {moodEntries.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getMoodIcon(entry.mood)}
                      <span className="font-medium">{getMoodText(entry.mood)}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString('fa-IR')}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">انرژی</div>
                      <div className="font-medium">{entry.energy}/10</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">استرس</div>
                      <div className="font-medium">{entry.stress}/10</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">خواب</div>
                      <div className="font-medium">{entry.sleep}/10</div>
                    </div>
                    {entry.notes && (
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {entry.notes}
                  </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}