import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai-client";

export async function POST(req: Request) {
  try {
    const { report, testResults, clientInfo } = await req.json();
    
    if (!report) {
      return NextResponse.json({ 
        success: false,
        error: "Missing report parameter" 
      }, { status: 400 });
    }

    console.log("🏥 اعتبارسنجی بالینی گزارش...");

    // اعتبارسنجی بالینی
    const clinicalPrompt = `
You are a clinical validation specialist for psychological reports.
Review the following clinical report for accuracy, completeness, and clinical appropriateness.

Guidelines:
1. Verify clinical accuracy of interpretations
2. Check for appropriate test result correlations
3. Ensure professional clinical language
4. Validate therapeutic recommendations
5. Check for evidence-based conclusions
6. Ensure cultural sensitivity
7. Verify age-appropriate assessments

Clinical Report:
${report}

Test Results Context:
${testResults ? JSON.stringify(testResults) : "No test results provided"}

Client Information:
${clientInfo ? JSON.stringify(clientInfo) : "No client info provided"}

Respond in JSON format:
{
  "clinicallyValid": true/false,
  "accuracyScore": 0-100,
  "completenessScore": 0-100,
  "professionalismScore": 0-100,
  "concerns": ["list of clinical concerns"],
  "recommendations": ["list of improvement suggestions"],
  "missingElements": ["list of missing clinical elements"],
  "strengths": ["list of report strengths"],
  "reasoning": "detailed clinical validation explanation"
}
`;

    const openai = getOpenAIClient();
    if (!openai) {
      return NextResponse.json({ 
        success: false,
        error: "OpenAI API key is not configured",
        message: "کلید API OpenAI تنظیم نشده است"
      }, { status: 500 });
    }

    const clinicalRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: clinicalPrompt }],
      temperature: 0.1,
      max_tokens: 1500,
    });

    let clinicalValidation;
    try {
      const content = clinicalRes.choices[0]?.message?.content;
      if (!content) {
        throw new Error("Empty response from OpenAI");
      }
      clinicalValidation = JSON.parse(content);
    } catch (error) {
      console.error("خطا در پارس اعتبارسنجی بالینی:", error);
      clinicalValidation = {
        clinicallyValid: false,
        accuracyScore: 0,
        completenessScore: 0,
        professionalismScore: 0,
        concerns: ["خطا در اعتبارسنجی بالینی"],
        recommendations: ["گزارش نیاز به بررسی دستی دارد"],
        missingElements: ["عناصر بالینی ضروری"],
        strengths: [],
        reasoning: "خطا در پردازش اعتبارسنجی بالینی"
      };
    }

    console.log(`✅ اعتبارسنجی بالینی تکمیل شد - امتیاز دقت: ${clinicalValidation.accuracyScore}`);

    return NextResponse.json({ 
      success: true,
      clinicalValidation,
      message: "اعتبارسنجی بالینی تکمیل شد"
    });

  } catch (err) {
    console.error("❌ خطا در اعتبارسنجی بالینی:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در اعتبارسنجی بالینی"
    }, { status: 500 });
  }
}





















