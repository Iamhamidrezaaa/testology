"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

interface PathStep {
  title: string;
  description: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "DONE";
}

interface GrowthPath {
  id: string;
  summary: string;
  steps: PathStep[];
}

interface ApiResponse {
  success: boolean;
  data: GrowthPath;
}

export default function ProgressPathWidget({ userId }: { userId: string }) {
  const [path, setPath] = useState<GrowthPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPath();
  }, []);

  const fetchPath = async () => {
    try {
      const res = await axios.get<ApiResponse>("/api/user/growth-path");
      setPath(res.data.data);
    } catch (err) {
      console.error("Error fetching growth path:", err);
      setError("خطا در دریافت مسیر رشد");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!path) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-bold mb-4">مسیر رشد شما</h2>
      <p className="text-gray-600 mb-4">{path.summary}</p>
      <div className="space-y-4">
        {path.steps.map((step, index) => (
          <div
            key={index}
            className={`border-r-4 p-4 rounded-lg ${
              step.status === "DONE"
                ? "border-green-500 bg-green-50"
                : step.status === "IN_PROGRESS"
                ? "border-yellow-500 bg-yellow-50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {step.description}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  step.status === "DONE"
                    ? "bg-green-100 text-green-600"
                    : step.status === "IN_PROGRESS"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {step.status === "DONE"
                  ? "تکمیل شده"
                  : step.status === "IN_PROGRESS"
                  ? "در حال انجام"
                  : "شروع نشده"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 