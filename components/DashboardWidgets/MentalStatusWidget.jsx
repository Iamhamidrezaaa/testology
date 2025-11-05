import React from "react";
import { motion } from "framer-motion";

export function MentalStatusWidget({ results }) {
  // تعیین وضعیت کلی روانی بر اساس آخرین نتایج
  let status = "خوب";
  let statusEmoji = "😊";
  let statusColor = "green";
  let statusDescription = "وضعیت روانی شما در حالت مطلوب است.";

  if (!results || results.length === 0) {
    status = "نامشخص";
    statusEmoji = "🤔";
    statusColor = "gray";
    statusDescription = "هنوز تستی انجام نداده‌اید.";
  } else {
    const anyHigh = results.some(r => r.category === "HIGH");
    const anyMedium = results.some(r => r.category === "MEDIUM");
    
    if (anyHigh) {
      status = "نیاز به توجه";
      statusEmoji = "⚠️";
      statusColor = "red";
      statusDescription = "برخی از نتایج تست‌های شما نیاز به توجه دارند.";
    } else if (anyMedium) {
      status = "متوسط";
      statusEmoji = "😐";
      statusColor = "orange";
      statusDescription = "وضعیت روانی شما در حد متوسط است.";
    } else {
      status = "مطلوب";
      statusEmoji = "😊";
      statusColor = "green";
      statusDescription = "وضعیت روانی شما در حالت مطلوب است.";
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-6"
      style={{ borderRight: `4px solid ${statusColor}` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">وضعیت روانی کنونی</h3>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-4xl"
        >
          {statusEmoji}
        </motion.span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 bg-${statusColor}-500`}></span>
          <span className="text-lg font-semibold text-gray-700">{status}</span>
        </div>
        
        <p className="text-gray-600">{statusDescription}</p>

        {results && results.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">آخرین نتایج:</h4>
            <div className="space-y-2">
              {results.slice(0, 3).map((result, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{result.testName}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    result.category === "HIGH" ? "bg-red-100 text-red-800" :
                    result.category === "MEDIUM" ? "bg-orange-100 text-orange-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {result.category === "HIGH" ? "بالا" :
                     result.category === "MEDIUM" ? "متوسط" : "پایین"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        بر اساس آخرین نتایج ثبت‌شده
      </div>
    </motion.div>
  );
} 