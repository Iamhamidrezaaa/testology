"use client";
import { useEffect, useState } from "react";
import Card from "../shared/Card";

interface LevelData {
  level: number;
  points: number;
  nextLevelPoints: number;
}

export default function UserLevel() {
  const [levelData, setLevelData] = useState<LevelData>({
    level: 1,
    points: 0,
    nextLevelPoints: 100
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const res = await fetch("/api/user/level");
        const data = await res.json();
        setLevelData(data);
      } catch (error) {
        console.error("Error fetching user level:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevel();
  }, []);

  if (loading) {
    return (
      <Card title="🏆 سطح کاربر">
        <p>در حال بارگذاری...</p>
      </Card>
    );
  }

  const progress = (levelData.points / (levelData.level * 100)) * 100;

  return (
    <Card title="🏆 سطح کاربر">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">سطح {levelData.level}</span>
          <span className="text-sm text-gray-600">{levelData.points} امتیاز</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="text-sm text-gray-600">
          {levelData.nextLevelPoints} امتیاز تا سطح بعدی
        </p>
      </div>
    </Card>
  );
} 