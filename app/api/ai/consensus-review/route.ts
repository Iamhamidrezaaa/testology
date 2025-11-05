import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { withMonitoring } from "@/middleware/withMonitoring";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function consensusHandler(req: Request) {
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
You are a clinical psychology evaluator.
Analyze this report and provide:
1. A concise re-summary of the psychological state.
2. A risk assessment (low/medium/high).
3. A quality score between 0 and 1 indicating accuracy and empathy.
Return JSON:
{ "summary": "...", "risk": "low|medium|high", "score": 0.0 }
Report:
${report.summary}
`;

    const models = ["gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"];
    const results: Array<{ model: string; summary: string; risk: string; score: number }> = [];

    await Promise.all(
      models.map(async (model) => {
        try {
          const res = await openai.chat.completions.create({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
          });
          const raw = res.choices[0].message.content || "{}";
          let parsed: any = {};
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = {};
          }
          results.push({
            model,
            summary: parsed.summary || "",
            risk: parsed.risk || "low",
            score: typeof parsed.score === "number" ? parsed.score : 0.7,
          });
        } catch (e) {
          results.push({ model, summary: "", risk: "low", score: 0.6 });
        }
      })
    );

    // Weighted consensus (using ModelWeight if exists)
    const weights = await prisma.modelWeight.findMany();
    const weightMap = Object.fromEntries(weights.map((w) => [w.modelName, w.weight]));

    const totalWeight = results.reduce((sum, r) => sum + (weightMap[r.model] ?? 0.5), 0);
    const weightedScoreSum = results.reduce(
      (sum, r) => sum + (r.score || 0.5) * (weightMap[r.model] ?? 0.5),
      0
    );
    const avgScore = totalWeight > 0 ? weightedScoreSum / totalWeight : 0.7;

    const riskLevels = results.map((r) => r.risk);
    const mostCommonRisk = riskLevels
      .sort(
        (a, b) =>
          riskLevels.filter((v) => v === a).length - riskLevels.filter((v) => v === b).length
      )
      .pop();

    const summaries = results.map((r) => `(${r.model}) ${r.summary}`);
    const consensusText = summaries.join("\n\n---\n\n");

    // divergence based on score variance
    const variance =
      results.reduce((sum, r) => sum + Math.pow((r.score || 0.5) - avgScore, 2), 0) /
      Math.max(results.length, 1);
    const divergence = Math.sqrt(variance);

    const consensus = await prisma.consensusReview.create({
      data: {
        reportId,
        modelsUsed: JSON.stringify(models),
        consensusText,
        confidence: avgScore,
        divergence,
        riskLevel: mostCommonRisk,
      },
    });

    return NextResponse.json({ success: true, consensus, results });
  } catch (err: any) {
    console.error("Consensus review failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export const POST = withMonitoring(consensusHandler, "Consensus");
