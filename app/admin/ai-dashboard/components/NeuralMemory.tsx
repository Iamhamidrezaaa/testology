"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Search, 
  Trash2, 
  RefreshCw, 
  MemoryStick, 
  Heart, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter
} from "lucide-react";

interface Memory {
  id: number;
  timestamp: string;
  type: string;
  content: string;
  metadata: any;
  importance: number;
  emotion: string[];
}

interface MemoryResult {
  memory: Memory;
  similarity: number;
  weighted_score: number;
}

interface MemoryStats {
  total: number;
  by_type: Record<string, number>;
  by_emotion: Record<string, number>;
  recent: number;
}

export default function NeuralMemory() {
  const [memories, setMemories] = useState<MemoryResult[]>([]);
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("search");

  // بارگذاری آمار حافظه
  const loadStats = async () => {
    try {
      const response = await fetch("/api/ml/memory?action=stats", { method: "PUT" });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("خطا در بارگذاری آمار:", error);
    }
  };

  // جستجوی حافظه
  const searchMemories = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/ml/memory?q=${encodeURIComponent(searchQuery)}&top_k=10`);
      const data = await response.json();
      if (data.success) {
        setMemories(data.results);
      }
    } catch (error) {
      console.error("خطا در جستجوی حافظه:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // پاک کردن حافظه‌های قدیمی
  const clearOldMemories = async (days: number = 30) => {
    if (!confirm(`آیا مطمئن هستید که می‌خواهید حافظه‌های قدیمی‌تر از ${days} روز را پاک کنید؟`)) {
      return;
    }

    try {
      const response = await fetch(`/api/ml/memory?days=${days}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        alert(`✅ ${data.removed_count} حافظه قدیمی پاک شد`);
        loadStats();
        if (searchQuery) {
          searchMemories();
        }
      }
    } catch (error) {
      console.error("خطا در پاک کردن حافظه:", error);
    }
  };

  // فیلتر کردن حافظه‌ها بر اساس نوع
  const filteredMemories = memories.filter(memory => {
    if (selectedType === "all") return true;
    return memory.memory.type === selectedType;
  });

  // دریافت آیکون بر اساس نوع حافظه
  const getMemoryIcon = (type: string) => {
    switch (type) {
      case "chat": return <MemoryStick className="w-4 h-4" />;
      case "decision": return <CheckCircle className="w-4 h-4" />;
      case "emotion": return <Heart className="w-4 h-4" />;
      case "test_result": return <AlertTriangle className="w-4 h-4" />;
      case "supervisor_analysis": return <Brain className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // دریافت رنگ بر اساس احساس
  const getEmotionColor = (emotions: string[]) => {
    if (emotions.includes("خوشحالی")) return "bg-green-100 text-green-800";
    if (emotions.includes("غم")) return "bg-blue-100 text-blue-800";
    if (emotions.includes("اضطراب")) return "bg-yellow-100 text-yellow-800";
    if (emotions.includes("عصبانیت")) return "bg-red-100 text-red-800";
    if (emotions.includes("آرامش")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* هدر */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            🧠 Neural Memory (حافظه مغز تستولوژی)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">🔍 جستجوی حافظه</TabsTrigger>
              <TabsTrigger value="stats">📊 آمار و مدیریت</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
              {/* جستجو */}
              <div className="flex gap-2">
                <Input
                  placeholder="جستجو در حافظه (مثال: احساس غم و اضطراب)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchMemories()}
                />
                <Button onClick={searchMemories} disabled={isLoading}>
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
              </div>

              {/* فیلتر نوع */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="نوع حافظه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه انواع</SelectItem>
                    <SelectItem value="chat">گفتگو</SelectItem>
                    <SelectItem value="decision">تصمیم</SelectItem>
                    <SelectItem value="emotion">احساس</SelectItem>
                    <SelectItem value="test_result">نتیجه تست</SelectItem>
                    <SelectItem value="supervisor_analysis">تحلیل Supervisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* نتایج جستجو */}
              <div className="space-y-3">
                {filteredMemories.map((result, index) => (
                  <Card key={index} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getMemoryIcon(result.memory.type)}
                          <Badge variant="outline">{result.memory.type}</Badge>
                          <Badge className={getEmotionColor(result.memory.emotion)}>
                            {result.memory.emotion.join(", ")}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          امتیاز: {result.weighted_score.toFixed(3)}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-2">
                        {new Date(result.memory.timestamp).toLocaleString("fa-IR")}
                      </p>
                      
                      <p className="text-gray-900 dark:text-gray-100 mb-2">
                        {result.memory.content}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>اهمیت: {(result.memory.importance * 100).toFixed(0)}%</span>
                        {result.memory.metadata.userId && (
                          <span>کاربر: {result.memory.metadata.userId}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              {/* آمار کلی */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <MemoryStick className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-2xl font-bold">{stats.total}</p>
                          <p className="text-sm text-gray-600">کل حافظه‌ها</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-2xl font-bold">{stats.recent}</p>
                          <p className="text-sm text-gray-600">هفته اخیر</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="text-2xl font-bold">
                            {Object.keys(stats.by_emotion).length}
                          </p>
                          <p className="text-sm text-gray-600">احساسات مختلف</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* آمار بر اساس نوع */}
              {stats && (
                <Card>
                  <CardHeader>
                    <CardTitle>توزیع بر اساس نوع</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(stats.by_type).map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center">
                          <span className="capitalize">{type}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* آمار بر اساس احساس */}
              {stats && (
                <Card>
                  <CardHeader>
                    <CardTitle>توزیع بر اساس احساس</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(stats.by_emotion).map(([emotion, count]) => (
                        <div key={emotion} className="flex justify-between items-center">
                          <span>{emotion}</span>
                          <Badge className={getEmotionColor([emotion])}>{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* مدیریت حافظه */}
              <Card>
                <CardHeader>
                  <CardTitle>مدیریت حافظه</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => clearOldMemories(30)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      پاک کردن حافظه‌های قدیمی (30 روز)
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => clearOldMemories(7)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      پاک کردن حافظه‌های قدیمی (7 روز)
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={loadStats}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    بروزرسانی آمار
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}












