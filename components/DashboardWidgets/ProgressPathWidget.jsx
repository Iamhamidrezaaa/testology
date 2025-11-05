import React, { useState } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function ProgressPathWidget({ results }) {
  const [selectedTest, setSelectedTest] = useState("all");
  const [viewMode, setViewMode] = useState("timeline"); // timeline or chart

  if (!results || results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">مسیر پیشرفت</h3>
        <p className="text-gray-600">تا کنون تستی انجام نداده‌اید.</p>
      </motion.div>
    );
  }

  // فیلتر کردن نتایج بر اساس تست انتخاب شده
  const filteredResults = selectedTest === "all" 
    ? results 
    : results.filter(r => r.testId === selectedTest);

  // مرتب‌سازی نتایج بر اساس تاریخ
  const sortedResults = [...filteredResults].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  // آماده‌سازی داده‌های نمودار
  const chartData = {
    labels: sortedResults.map(r => new Date(r.createdAt).toLocaleDateString('fa-IR')),
    datasets: [{
      label: 'امتیاز',
      data: sortedResults.map(r => r.score),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'روند تغییرات امتیاز'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // استخراج لیست تست‌های منحصر به فرد
  const uniqueTests = [...new Set(results.map(r => r.testId))];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">مسیر پیشرفت شما</h3>
        <div className="flex space-x-4">
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="all">همه تست‌ها</option>
            {uniqueTests.map(testId => (
              <option key={testId} value={testId}>
                {results.find(r => r.testId === testId)?.testName || `تست ${testId}`}
              </option>
            ))}
          </select>
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                viewMode === "timeline"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              تایم‌لاین
            </button>
            <button
              onClick={() => setViewMode("chart")}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                viewMode === "chart"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              نمودار
            </button>
          </div>
        </div>
      </div>

      {viewMode === "timeline" ? (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-6">
            {sortedResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8"
              >
                <div className="absolute left-0 w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full ${
                    result.category === "HIGH" ? "bg-red-500" :
                    result.category === "MEDIUM" ? "bg-orange-500" :
                    "bg-green-500"
                  }`}></div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800">{result.testName}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(result.createdAt).toLocaleDateString('fa-IR')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      result.category === "HIGH" ? "bg-red-100 text-red-800" :
                      result.category === "MEDIUM" ? "bg-orange-100 text-orange-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {result.category === "HIGH" ? "بالا" :
                       result.category === "MEDIUM" ? "متوسط" : "پایین"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    امتیاز: {result.score}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </motion.div>
  );
} 