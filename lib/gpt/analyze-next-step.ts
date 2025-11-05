import { gptSmartAnalyze } from "./gpt-core";

interface TestResult {
  testName: string;
  result: string;
  completed: boolean;
  createdAt: Date;
}

interface MoodProfile {
  summary: string;
  createdAt: Date;
}

interface TestRequest {
  testName: string;
  status: string;
  reason?: string;
}

interface User {
  assignedTherapistId?: string;
  createdAt: Date;
}

export async function analyzeNextStep(
  testResults: TestResult[],
  moodProfile: MoodProfile | null,
  testRequests: TestRequest[],
  user: User | null
) {
  try {
    // آماده‌سازی اطلاعات برای GPT
    const completedTests = testResults.filter(t => t.completed);
    const testNames = completedTests.map(t => t.testName);
    const hasTherapist = !!user?.assignedTherapistId;
    const pendingRequests = testRequests.filter(r => r.status === "pending");

    // تعیین وضعیت فعلی کاربر
    let currentSituation = "";
    if (completedTests.length === 0) {
      currentSituation = "کاربر هنوز هیچ تستی انجام نداده است";
    } else if (completedTests.length === 1) {
      currentSituation = `کاربر یک تست انجام داده: ${testNames[0]}`;
    } else if (completedTests.length <= 3) {
      currentSituation = `کاربر ${completedTests.length} تست انجام داده: ${testNames.join(", ")}`;
    } else {
      currentSituation = `کاربر ${completedTests.length} تست انجام داده و تجربه خوبی دارد`;
    }

    if (moodProfile) {
      currentSituation += ` و پروفایل خلق و خو دارد`;
    }

    if (hasTherapist) {
      currentSituation += ` و مشاور اختصاصی دارد`;
    }

    if (pendingRequests.length > 0) {
      currentSituation += ` و ${pendingRequests.length} درخواست تست در انتظار دارد`;
    }

    // ساخت prompt برای GPT
    const prompt = `
شما یک روانشناس مجازی متخصص هستید. با توجه به وضعیت فعلی کاربر، مرحله بعدی رشد روانی او را پیشنهاد دهید.

وضعیت فعلی کاربر:
${currentSituation}

${moodProfile ? `تحلیل خلق و خو: ${moodProfile.summary.substring(0, 200)}...` : ""}

لطفاً یک پیشنهاد مرحله بعدی ارائه دهید که شامل موارد زیر باشد:

1. عنوان مرحله (کوتاه و انگیزشی)
2. توضیح مرحله (2-3 جمله)
3. اقدام مشخص (چه کاری باید انجام دهد)
4. اولویت (low/medium/high)

پاسخ را به صورت JSON ارائه دهید:
{
  "title": "عنوان مرحله",
  "description": "توضیح مرحله",
  "action": "اقدام مشخص",
  "priority": "low/medium/high"
}

مثال‌های پیشنهادات:
- اگر تست کمی انجام داده: پیشنهاد تست‌های بیشتر
- اگر تست‌های زیادی انجام داده: پیشنهاد تمرینات یا مشاوره
- اگر مشاور دارد: پیشنهاد پیگیری جلسات
- اگر پروفایل خلق و خو دارد: پیشنهاد تمرینات شخصی‌سازی شده

پاسخ باید به فارسی و انگیزشی باشد.
`;

    const response = await gptSmartAnalyze(prompt);
    
    // تلاش برای پارس کردن JSON
    try {
      const parsedResponse = JSON.parse(response);
      return {
        title: parsedResponse.title || "مرحله بعدی رشد",
        description: parsedResponse.description || "ادامه مسیر رشد روانی",
        action: parsedResponse.action || "اقدام بعدی را انجام دهید",
        priority: parsedResponse.priority || "medium"
      };
    } catch (parseError) {
      // اگر JSON پارس نشد، از متن خام استفاده می‌کنیم
      const lines = response.split('\n').filter(line => line.trim());
      return {
        title: lines[0] || "مرحله بعدی رشد",
        description: lines.slice(1, 3).join(' ') || "ادامه مسیر رشد روانی",
        action: lines[3] || "اقدام بعدی را انجام دهید",
        priority: "medium"
      };
    }

  } catch (error) {
    console.error("خطا در تحلیل مرحله بعدی:", error);
    
    // پیشنهاد پیش‌فرض در صورت خطا
    if (testResults.length === 0) {
      return {
        title: "شروع مسیر رشد",
        description: "با انجام اولین تست روان‌شناختی، مسیر رشد خود را آغاز کنید",
        action: "تست غربالگری اولیه را انجام دهید",
        priority: "high"
      };
    } else if (!moodProfile) {
      return {
        title: "تکمیل ارزیابی",
        description: "برای دریافت تحلیل جامع، تست‌های بیشتری انجام دهید",
        action: "تست‌های پیشنهادی را بررسی کنید",
        priority: "medium"
      };
    } else {
      return {
        title: "ادامه رشد",
        description: "بر اساس تحلیل شما، تمرینات شخصی‌سازی شده را شروع کنید",
        action: "برنامه تمرینات روزانه را مشاهده کنید",
        priority: "low"
      };
    }
  }
}




















