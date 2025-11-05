import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export async function POST(req: Request) {
  try {
    const { content, contentType } = await req.json();
    
    if (!content) {
      return NextResponse.json({ 
        success: false,
        error: "Missing content parameter" 
      }, { status: 400 });
    }

    console.log("🛡️ بررسی اخلاقی محتوا...");

    // بررسی اخلاقی محتوا
    const ethicalPrompt = `
You are an ethical content filter for psychological assessments.
Review the following content for ethical compliance and potential risks.

Guidelines:
1. Check for harmful or inappropriate content
2. Identify potential bias or discrimination
3. Ensure professional and respectful language
4. Flag any content that could be misleading or dangerous
5. Verify clinical appropriateness

Content Type: ${contentType || "general"}
Content to Review:
${content}

Respond in JSON format:
{
  "approved": true/false,
  "riskLevel": "low|medium|high|critical",
  "concerns": ["list of specific concerns"],
  "recommendations": ["list of improvement suggestions"],
  "reasoning": "detailed explanation of decision"
}
`;

    const ethicalRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: ethicalPrompt }],
      temperature: 0.1,
      max_tokens: 1000,
    });

    let ethicalAnalysis;
    try {
      ethicalAnalysis = JSON.parse(ethicalRes.choices[0].message.content);
    } catch (error) {
      console.error("خطا در پارس تحلیل اخلاقی:", error);
      ethicalAnalysis = {
        approved: false,
        riskLevel: "high",
        concerns: ["خطا در تحلیل اخلاقی"],
        recommendations: ["محتوا نیاز به بررسی دستی دارد"],
        reasoning: "خطا در پردازش تحلیل اخلاقی"
      };
    }

    console.log(`✅ بررسی اخلاقی تکمیل شد - سطح ریسک: ${ethicalAnalysis.riskLevel}`);

    return NextResponse.json({ 
      success: true,
      ethicalAnalysis,
      message: "بررسی اخلاقی تکمیل شد"
    });

  } catch (err) {
    console.error("❌ خطا در بررسی اخلاقی:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در بررسی اخلاقی"
    }, { status: 500 });
  }
}











