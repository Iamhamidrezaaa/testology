"use client";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import Card from "../shared/Card";

interface Step {
  title: string;
  detail: string;
  date: string;
  completed?: boolean;
}

export default function ProgressTimeline() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/growth-path-steps")
      .then(res => res.json())
      .then(data => {
        setSteps(data?.steps || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching steps:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Card title="📈 مسیر رشد روان‌شناسی شما">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card title="📈 مسیر رشد روان‌شناسی شما">
      <ol className="relative border-s border-gray-200 dark:border-gray-700 ml-2">
        {steps.map((step, idx) => (
          <li className="mb-8 ms-4" key={idx}>
            <div className="absolute w-3 h-3 bg-blue-500 rounded-full -start-1.5 border border-white dark:border-gray-900" />
            <h3 className="text-md font-semibold text-gray-900 dark:text-white">{step.title}</h3>
            <p className="mb-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{step.detail}</p>
            <span className="text-xs text-gray-500">{step.date}</span>
            {step.completed && (
              <span className="ml-2 text-green-500">
                <FaCheckCircle className="inline" />
              </span>
            )}
          </li>
        ))}
      </ol>
    </Card>
  );
} 