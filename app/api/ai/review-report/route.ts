import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getOpenAIClient } from '@/lib/openai-client';


export async function POST(req: Request) {
  try {
    const { reportId } = await req.json();

    if (!reportId) {
      return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
    }

    const report = await prisma.clinicalReport.findUnique({ where: { id: reportId } });
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const prompt = `
You are an AI clinical psychology reviewer.
Review the following report written by another AI system.
Your job:
1. Summarize the key findings in one paragraph.
2. Evaluate the report's accuracy, neutrality, and empathy (0–1 score).
3. Detect any risky or overgeneralized statements.
4. Suggest brief improvements or corrections if needed.
Return JSON:
{
  "summary": "...",
  "reviewScore": 0.0,
  "riskLevel": "low|medium|high",
  "revisionNotes": "..."
}
Report to review:
${report.summary}
`;

    const openai = getOpenAIClient();
    if (!openai) {
      return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });
    }

    const gptRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const jsonText = gptRes.choices[0].message.content?.trim() || "{}";
    let parsed: any = {};
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      parsed = { summary: jsonText?.slice(0, 800) || "", reviewScore: 0.8, riskLevel: "low", revisionNotes: "" };
    }

    const review = await prisma.clinicalReview.create({
      data: {
        reportId,
        reviewerAI: "GPT-4o-mini",
        reviewSummary: parsed.summary || "",
        reviewScore: typeof parsed.reviewScore === "number" ? parsed.reviewScore : 0.8,
        riskLevel: parsed.riskLevel || "low",
        revisionNotes: parsed.revisionNotes || "",
      },
    });

    // Auto-trigger consensus engine
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/ai/consensus-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId })
      });
    } catch (e) {
      console.warn("Consensus auto-trigger failed:", e);
    }

    return NextResponse.json({ success: true, review });
  } catch (err: any) {
    console.error("AI review failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
