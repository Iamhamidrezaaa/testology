/**
 * اسکریپت تست خودکار برای GAD-7
 * این اسکریپت چند سناریو را به API می‌زند و نتایج را نمایش می‌دهد
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

interface Scenario {
  name: string;
  answers: { questionId: number; value: number }[];
  expectedScore?: number;
  expectedLevel?: string;
}

const scenarios: Scenario[] = [
  {
    name: "همه جواب‌ها 0 (حداقل اضطراب)",
    answers: Array.from({ length: 7 }, (_, i) => ({
      questionId: i + 1,
      value: 0,
    })),
    expectedScore: 0,
    expectedLevel: "minimal",
  },
  {
    name: "همه جواب‌ها 3 (حداکثر اضطراب)",
    answers: Array.from({ length: 7 }, (_, i) => ({
      questionId: i + 1,
      value: 3,
    })),
    expectedScore: 21,
    expectedLevel: "severe",
  },
  {
    name: "نیمی 0، نیمی 3 (اضطراب متوسط)",
    answers: [
      { questionId: 1, value: 0 },
      { questionId: 2, value: 0 },
      { questionId: 3, value: 0 },
      { questionId: 4, value: 3 },
      { questionId: 5, value: 3 },
      { questionId: 6, value: 3 },
      { questionId: 7, value: 3 },
    ],
    expectedScore: 12,
    expectedLevel: "moderate",
  },
  {
    name: "اضطراب خفیف (نمره 5-9)",
    answers: [
      { questionId: 1, value: 1 },
      { questionId: 2, value: 1 },
      { questionId: 3, value: 1 },
      { questionId: 4, value: 1 },
      { questionId: 5, value: 1 },
      { questionId: 6, value: 0 },
      { questionId: 7, value: 0 },
    ],
    expectedScore: 5,
    expectedLevel: "mild",
  },
];

async function runScenario(scenario: Scenario) {
  try {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`📋 سناریو: ${scenario.name}`);
    console.log(`${"=".repeat(60)}`);

    const response = await fetch(`${BASE_URL}/api/tests/gad7/submit?debug=1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answers: scenario.answers,
        email: "debug@testology.local",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ خطا در درخواست: ${response.status}`);
      console.error(`پیام خطا: ${errorText}`);
      return;
    }

    const data = await response.json();

    // نمایش نتیجه کلی
    console.log(`\n✅ نتیجه:`);
    const actualScore = data.result?.totalScore ?? data.result?.score ?? data.debug?.totalScore ?? "N/A";
    const actualLevel = data.result?.totalLevelLabel ?? data.result?.result ?? data.debug?.totalLevelLabel ?? "N/A";
    console.log(`   نمره کل: ${actualScore}`);
    console.log(`   سطح: ${actualLevel}`);
    console.log(`   ذخیره شد: ${data.saved ? "✅" : "❌"}`);

    // مقایسه با مقدار مورد انتظار
    if (scenario.expectedScore !== undefined) {
      if (actualScore === scenario.expectedScore) {
        console.log(`   ✅ نمره مورد انتظار (${scenario.expectedScore}) با نمره واقعی (${actualScore}) مطابقت دارد`);
      } else {
        console.log(`   ⚠️  نمره مورد انتظار (${scenario.expectedScore}) با نمره واقعی (${actualScore}) مطابقت ندارد`);
      }
    }

    if (scenario.expectedLevel !== undefined) {
      const actualLevel = data.result?.totalLevelId || data.result?.severity;
      if (actualLevel === scenario.expectedLevel) {
        console.log(`   ✅ سطح مورد انتظار (${scenario.expectedLevel}) با سطح واقعی (${actualLevel}) مطابقت دارد`);
      } else {
        console.log(`   ⚠️  سطح مورد انتظار (${scenario.expectedLevel}) با سطح واقعی (${actualLevel}) مطابقت ندارد`);
      }
    }

    // نمایش جزئیات debug
    if (data.debug) {
      console.log(`\n🔍 جزئیات Debug:`);
      console.log(`   Config: scaleMin=${data.debug.config.scaleMin}, scaleMax=${data.debug.config.scaleMax}`);
      console.log(`   Scoring Type: ${data.debug.config.scoringType}`);
      console.log(`   Reverse Items: [${data.debug.config.reverseItems.join(", ")}]`);
      
      console.log(`\n   📊 جزئیات هر سوال:`);
      data.debug.items.forEach((item: any, idx: number) => {
        console.log(`   ${idx + 1}. سوال ${item.questionId}:`);
        if (item.text) {
          console.log(`      متن: ${item.text.substring(0, 50)}...`);
        }
        console.log(`      Raw: ${item.raw} → Normalized: ${item.normalized} (reverse: ${item.reverse ? "✅" : "❌"})`);
        console.log(`      Weight: ${item.weight} → Weighted: ${item.weighted}`);
        if (item.subscale) {
          console.log(`      Subscale: ${item.subscale}`);
        }
      });

      console.log(`\n   📈 زیرمقیاس‌ها:`);
      data.debug.subscales.forEach((sub: any) => {
        console.log(`   - ${sub.label} (${sub.id}): نمره ${sub.score}`);
        console.log(`     شامل سوالات: [${sub.items.join(", ")}]`);
      });

      console.log(`\n   🎯 نمره کل: ${data.debug.totalScore}`);
      console.log(`   📊 سطح: ${data.debug.totalLevelLabel || "N/A"} (${data.debug.totalLevelId || "N/A"})`);
    } else {
      console.log(`\n⚠️  Debug info موجود نیست. مطمئن شوید که ?debug=1 در URL اضافه شده است.`);
    }
  } catch (error: any) {
    console.error(`\n❌ خطا در اجرای سناریو:`, error.message);
    if (error.stack) {
      console.error(`Stack trace:`, error.stack);
    }
  }
}

async function main() {
  console.log("🚀 شروع تست خودکار GAD-7");
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`\n⚠️  مطمئن شوید که سرور در حال اجرا است (npm run dev)`);

  for (const scenario of scenarios) {
    await runScenario(scenario);
    // کمی تاخیر بین سناریوها
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("✅ تست خودکار تکمیل شد");
  console.log(`${"=".repeat(60)}\n`);
}

main().catch(console.error);

