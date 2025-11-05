"use client";
import { useEffect, useState } from "react";
import Card from "../shared/Card";

interface CreditData {
  credit: number;
  status: string;
  details: {
    testCount: number;
    exerciseCount: number;
    testScore: number;
    exerciseScore: number;
  };
}

export default function MentalCredit() {
  const [creditData, setCreditData] = useState<CreditData>({
    credit: 0,
    status: 'در حال محاسبه...',
    details: {
      testCount: 0,
      exerciseCount: 0,
      testScore: 0,
      exerciseScore: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredit = async () => {
      try {
        const res = await fetch("/api/user/mental-credit");
        const data = await res.json();
        setCreditData(data);
      } catch (error) {
        console.error("Error fetching mental credit:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredit();
  }, []);

  if (loading) {
    return (
      <Card title="🧠 امتیاز روانی">
        <p>در حال بارگذاری...</p>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'عالی':
        return 'text-green-600';
      case 'خوب':
        return 'text-blue-600';
      case 'متوسط':
        return 'text-yellow-600';
      case 'نیاز به توجه':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card title="🧠 امتیاز روانی">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">{creditData.credit}</span>
          <span className={`text-lg font-semibold ${getStatusColor(creditData.status)}`}>
            {creditData.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">تعداد تست‌ها</p>
            <p className="font-semibold">{creditData.details.testCount}</p>
          </div>
          <div>
            <p className="text-gray-600">تعداد تمرین‌ها</p>
            <p className="font-semibold">{creditData.details.exerciseCount}</p>
          </div>
          <div>
            <p className="text-gray-600">امتیاز تست‌ها</p>
            <p className="font-semibold">{Math.round(creditData.details.testScore)}</p>
          </div>
          <div>
            <p className="text-gray-600">امتیاز تمرین‌ها</p>
            <p className="font-semibold">{creditData.details.exerciseScore}</p>
          </div>
        </div>
      </div>
    </Card>
  );
} 