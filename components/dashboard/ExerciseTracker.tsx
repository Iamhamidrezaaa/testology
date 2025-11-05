"use client";
import { useEffect, useState } from "react";
import Card from "../shared/Card";
import { toast } from "react-hot-toast";

interface Exercise {
  id: string;
  text: string;
  done: boolean;
  progress?: number;
}

export default function ExerciseTracker() {
  const [items, setItems] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const res = await fetch("/api/user/exercises");
      const data = await res.json();
      setItems(data?.list || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast.error('خطا در دریافت تمرین‌ها');
    } finally {
      setLoading(false);
    }
  };

  const toggleDone = async (id: string) => {
    try {
      const res = await fetch("/api/user/exercise-done", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('خطا در بروزرسانی وضعیت تمرین');

      setItems(prev =>
        prev.map(it => (it.id === id ? { ...it, done: !it.done } : it))
      );

      toast.success('وضعیت تمرین بروزرسانی شد');
    } catch (error) {
      console.error('Error updating exercise:', error);
      toast.error('خطا در بروزرسانی وضعیت تمرین');
    }
  };

  const updateProgress = async (id: string, progress: number) => {
    try {
      const res = await fetch("/api/user/exercise-progress", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, progress }),
      });

      if (!res.ok) throw new Error('خطا در بروزرسانی پیشرفت');

      setItems(prev =>
        prev.map(it => (it.id === id ? { ...it, progress } : it))
      );

      toast.success('پیشرفت بروزرسانی شد');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('خطا در بروزرسانی پیشرفت');
    }
  };

  if (loading) {
    return (
      <Card title="🎯 پیگیری تمرین‌ها">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="flex-1 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card title="🎯 پیگیری تمرین‌ها">
      <ul className="space-y-4">
        {items.map(item => (
          <li key={item.id} className="flex flex-col gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggleDone(item.id)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className={`flex-1 ${item.done ? "line-through text-gray-400" : ""}`}>
                {item.text}
              </span>
            </div>
            {item.progress !== undefined && (
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={item.progress}
                  onChange={(e) => updateProgress(item.id, parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">{item.progress}%</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
} 