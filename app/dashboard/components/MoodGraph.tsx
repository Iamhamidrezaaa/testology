"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

interface MoodData {
  date: string;
  score: number;
  count: number;
  sentiments: Array<{
    sentiment: string;
    time: string;
  }>;
}

interface MoodStats {
  totalMoods: number;
  sentimentCounts: Record<string, number>;
  trend: string;
  averageScore: number;
}

interface MoodHistoryResponse {
  success: boolean;
  data: {
    chartData: MoodData[];
    stats: MoodStats;
  };
}

const moodLabels: Record<number, string> = {
  "-2": "Depressed 😞",
  "-1": "Angry 😠", 
  "0": "Anxious 😟",
  "1": "Neutral 😐",
  "2": "Hopeful 😊",
  "3": "Happy 😄",
};

const moodColors: Record<number, string> = {
  "-2": "#ef4444", // قرمز
  "-1": "#f97316", // نارنجی
  "0": "#eab308", // زرد
  "1": "#6b7280", // خاکستری
  "2": "#22c55e", // سبز
  "3": "#3b82f6", // آبی
};

export default function MoodGraph() {
  const [data, setData] = useState<MoodData[]>([]);
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user/mood-history?days=7');
        const result: MoodHistoryResponse = await response.json();
        
        if (result.success) {
          setData(result.data.chartData);
          setStats(result.data.stats);
        } else {
          setError('Failed to load mood data');
        }
      } catch (err) {
        setError('Error loading mood data');
        console.error('Mood data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'improving': return 'Your mood is improving!';
      case 'declining': return 'Your mood needs attention';
      default: return 'Your mood is stable';
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
        <div className="text-center text-red-500">
          <p>❌ {error}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          🧠 Mood Tracker
        </h3>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">No chat history yet</p>
          <p className="text-sm">Start chatting with our AI psychologist to see your mood patterns!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          🧠 Mood Tracker (Last 7 Days)
        </h3>
        {stats && (
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <span>{getTrendIcon(stats.trend)}</span>
              <span className="text-gray-600 dark:text-gray-400">
                {getTrendText(stats.trend)}
              </span>
            </div>
            <div className="text-gray-500">
              Avg: {stats.averageScore.toFixed(1)}
            </div>
          </div>
        )}
      </div>

      {/* آمار کلی */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalMoods}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Chats
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.sentimentCounts.happy || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Happy Days
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {stats.sentimentCounts.depressed || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tough Days
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {stats.averageScore.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg Score
            </div>
          </div>
        </div>
      )}

      {/* نمودار */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis 
              domain={[-2, 3]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const rounded = Math.round(value);
                return moodLabels[rounded] || '';
              }}
              tickCount={6}
            />
            <Tooltip
              formatter={(value: number, name, props) => {
                const dayData = props.payload as MoodData;
                return [
                  <div key="main">
                    <div className="font-semibold">
                      {moodLabels[Math.round(value as number)] || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-600">
                      Score: {value}
                    </div>
                    <div className="text-sm text-gray-600">
                      Chats: {dayData.count}
                    </div>
                    {dayData.sentiments.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-500">Recent moods:</div>
                        {dayData.sentiments.slice(-3).map((sentiment, idx) => (
                          <div key={idx} className="text-xs">
                            {sentiment.time}: {moodLabels[Math.round(sentiment.sentiment as any)] || sentiment.sentiment}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ];
              }}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#moodGradient)"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* راهنمای رنگ‌ها */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {Object.entries(moodLabels).map(([score, label]) => (
          <div key={score} className="flex items-center space-x-1 text-xs">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: moodColors[parseInt(score)] }}
            ></div>
            <span className="text-gray-600 dark:text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}














