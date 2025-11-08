import { NextResponse } from "next/server";
import { getOpenAIClient } from '@/lib/openai-client';


export async function POST(req: Request) {
  try {
    const { content, dataType } = await req.json();
    
    if (!content) {
      return NextResponse.json({ 
        success: false,
        error: "Missing content parameter" 
      }, { status: 400 });
    }

    console.log("🔒 بررسی حریم خصوصی محتوا...");

    // بررسی حریم خصوصی
    const privacyPrompt = `
You are a privacy compliance checker for psychological data.
Review the following content for privacy compliance and data protection.

Guidelines:
1. Check for personally identifiable information (PII)
2. Identify sensitive personal data
3. Ensure data anonymization
4. Verify GDPR/CCPA compliance
5. Check for data minimization principles

Data Type: ${dataType || "general"}
Content to Review:
${content}

Respond in JSON format:
{
  "privacyCompliant": true/false,
  "riskLevel": "low|medium|high|critical",
  "piiDetected": ["list of detected PII"],
  "sensitiveData": ["list of sensitive data found"],
  "recommendations": ["list of privacy improvement suggestions"],
  "anonymizationNeeded": true/false,
  "reasoning": "detailed explanation of privacy assessment"
}
`;

    const openai = getOpenAIClient();
    if (!openai) {
      return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });
    }

    const privacyRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: privacyPrompt }],
      temperature: 0.1,
      max_tokens: 1000,
    });

    let privacyAnalysis;
    try {
      const content = privacyRes.choices[0]?.message?.content;
      if (!content) {
        throw new Error("Empty response from OpenAI");
      }
      privacyAnalysis = JSON.parse(content);
    } catch (error) {
      console.error("خطا در پارس تحلیل حریم خصوصی:", error);
      privacyAnalysis = {
        privacyCompliant: false,
        riskLevel: "high",
        piiDetected: ["خطا در تحلیل حریم خصوصی"],
        sensitiveData: ["محتوا نیاز به بررسی دستی دارد"],
        recommendations: ["بررسی دستی ضروری است"],
        anonymizationNeeded: true,
        reasoning: "خطا در پردازش تحلیل حریم خصوصی"
      };
    }

    console.log(`✅ بررسی حریم خصوصی تکمیل شد - سطح ریسک: ${privacyAnalysis.riskLevel}`);

    return NextResponse.json({ 
      success: true,
      privacyAnalysis,
      message: "بررسی حریم خصوصی تکمیل شد"
    });

  } catch (err) {
    console.error("❌ خطا در بررسی حریم خصوصی:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در بررسی حریم خصوصی"
    }, { status: 500 });
  }
}











