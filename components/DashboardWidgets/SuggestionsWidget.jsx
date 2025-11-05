import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SuggestionsWidget({ suggestions: initialSuggestions = [] }) {
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequestNew = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("خطا در دریافت پیشنهاد جدید");
      }

      const data = await response.json();
      
      setSuggestions(prev => [data.suggestion, ...prev].slice(0, 5));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // اگر پیشنهاد شامل لینک یا اکشن خاصی باشد، آن را اجرا می‌کنیم
    if (suggestion.action) {
      window.location.href = suggestion.action;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">توصیه‌های هوشمند</h3>
        <button
          onClick={handleRequestNew}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${
            isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>در حال دریافت...</span>
            </>
          ) : (
            <>
              <span>🔄</span>
              <span>توصیه جدید</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm"
        >
          {error}
        </motion.div>
      )}

      <AnimatePresence>
        {suggestions.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 text-center py-4"
          >
            در حال حاضر توصیه‌ای موجود نیست.
          </motion.p>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  suggestion.action
                    ? "bg-indigo-50 hover:bg-indigo-100"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {suggestion.icon || "💡"}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {suggestion.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {suggestion.description}
                    </p>
                    {suggestion.action && (
                      <div className="mt-2 text-sm text-indigo-600">
                        برای اطلاعات بیشتر کلیک کنید →
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 