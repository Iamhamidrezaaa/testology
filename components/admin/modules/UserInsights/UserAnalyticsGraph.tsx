'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartType,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface UserAnalytics {
  id: string;
  durationSeconds: number;
  completed: boolean;
  visitedAt: string;
}

interface UserAnalyticsGraphProps {
  data: UserAnalytics[];
  type: 'line' | 'bar';
  title: string;
}

export function UserAnalyticsGraph({ data, type, title }: UserAnalyticsGraphProps) {
  const chartRef = useRef<ChartJS<ChartType>>(null);

  // گروه‌بندی داده‌ها بر اساس تاریخ
  const groupedData = data.reduce((acc, curr) => {
    const date = new Date(curr.visitedAt).toLocaleDateString('fa-IR');
    if (!acc[date]) {
      acc[date] = {
        total: 0,
        completed: 0,
        duration: 0,
      };
    }
    acc[date].total++;
    if (curr.completed) acc[date].completed++;
    acc[date].duration += curr.durationSeconds;
    return acc;
  }, {} as Record<string, { total: number; completed: number; duration: number }>);

  const chartData = {
    labels: Object.keys(groupedData),
    datasets: [
      {
        label: 'تعداد بازدید',
        data: Object.values(groupedData).map(d => d.total),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'تکمیل شده',
        data: Object.values(groupedData).map(d => d.completed),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'میانگین زمان (ثانیه)',
        data: Object.values(groupedData).map(d => d.duration / d.total),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full h-[400px] p-4 bg-white rounded-lg shadow">
      {type === 'line' ? (
        <Line data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
} 