"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Exercise = {
  title: string;
  description: string;
  duration: string;
  difficulty: "easy" | "medium" | "hard";
  materials?: string[];
  steps: string[];
};

export default function GrowthExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const res = await axios.get<{ data: Exercise[] }>(
        "/api/user/growth-exercises"
      );
      setExercises(res.data.data);
    } catch (err) {
      console.error("Error fetching exercises:", err);
      setError("خطا در دریافت تمرین‌ها");
    } finally {
      setLoading(false);
    }
  };

  const generateNewExercises = async () => {
    try {
      setGenerating(true);
      setError(null);

      const res = await axios.post<{ data: { exercises: Exercise[] } }>(
        "/api/growth-path/exercises"
      );

      setExercises(res.data.data.exercises);
    } catch (err: any) {
      console.error("Error generating exercises:", err);
      setError(
        err.response?.data?.message ||
          "خطا در تولید تمرین‌ها. لطفاً دوباره تلاش کنید."
      );
    } finally {
      setGenerating(false);
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

  if (exercises.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-bold mb-4">تمرین‌های مسیر رشد</h2>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            برای دریافت تمرین‌های شخصی‌سازی شده، ابتدا باید مسیر رشد را تولید کنید.
          </p>
          <button
            onClick={generateNewExercises}
            disabled={generating}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {generating ? "در حال تولید..." : "تولید تمرین‌های جدید"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">تمرین‌های مسیر رشد</h2>
        <button
          onClick={generateNewExercises}
          disabled={generating}
          className="text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
        >
          {generating ? "در حال تولید..." : "تولید تمرین‌های جدید"}
        </button>
      </div>

      <div className="space-y-6">
        {exercises.map((exercise, index) => (
          <div
            key={index}
            className="border-r-4 border-green-500 bg-green-50 p-4 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-green-800">{exercise.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {exercise.description}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded mb-2">
                  {exercise.duration}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    exercise.difficulty === "easy"
                      ? "bg-blue-100 text-blue-600"
                      : exercise.difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {exercise.difficulty === "easy"
                    ? "آسان"
                    : exercise.difficulty === "medium"
                    ? "متوسط"
                    : "سخت"}
                </span>
              </div>
            </div>

            {exercise.materials && exercise.materials.length > 0 && (
              <div className="mt-3">
                <h4 className="font-medium text-gray-700 mb-2">مواد مورد نیاز:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {exercise.materials.map((material, i) => (
                    <li key={i} className="text-sm text-gray-600">
                      {material}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-3">
              <h4 className="font-medium text-gray-700 mb-2">مراحل انجام:</h4>
              <ol className="list-decimal list-inside space-y-2">
                {exercise.steps.map((step, i) => (
                  <li key={i} className="text-sm text-gray-600">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 