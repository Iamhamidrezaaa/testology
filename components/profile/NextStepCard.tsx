"use client";

interface NextStep {
  title: string;
  description: string;
  action: string;
  priority: "low" | "medium" | "high";
}

interface NextStepCardProps {
  nextStep: NextStep;
}

export function NextStepCard({ nextStep }: NextStepCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "from-red-50 to-pink-50 border-red-200";
      case "medium":
        return "from-yellow-50 to-orange-50 border-yellow-200";
      case "low":
        return "from-green-50 to-emerald-50 border-green-200";
      default:
        return "from-blue-50 to-indigo-50 border-blue-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return "🔥";
      case "medium":
        return "⚡";
      case "low":
        return "🌱";
      default:
        return "💡";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "اولویت بالا";
      case "medium":
        return "اولویت متوسط";
      case "low":
        return "اولویت پایین";
      default:
        return "پیشنهاد";
    }
  };

  return (
    <div className={`bg-gradient-to-r ${getPriorityColor(nextStep.priority)} rounded-xl p-6 border-2 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="text-3xl">{getPriorityIcon(nextStep.priority)}</div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              🧭 پیشنهاد مرحله بعدی
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              nextStep.priority === "high" ? "bg-red-100 text-red-800" :
              nextStep.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
              "bg-green-100 text-green-800"
            }`}>
              {getPriorityText(nextStep.priority)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            {nextStep.title}
          </h4>
          <p className="text-gray-700 leading-relaxed">
            {nextStep.description}
          </p>
        </div>

        <div className="bg-white/70 rounded-lg p-4 border border-white/50">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-gray-800 mb-1">اقدام پیشنهادی:</h5>
              <p className="text-gray-600 text-sm">{nextStep.action}</p>
            </div>
            <div className="text-2xl">🎯</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button className="flex-1 bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium">
            📋 جزئیات بیشتر
          </button>
          <button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
            🚀 شروع کنم
          </button>
        </div>
      </div>

      {/* انگیزشی */}
      <div className="mt-4 pt-4 border-t border-white/30">
        <p className="text-sm text-gray-600 text-center italic">
          💪 هر قدم کوچک، شما را به رشد بیشتر نزدیک‌تر می‌کند
        </p>
      </div>
    </div>
  );
}




















