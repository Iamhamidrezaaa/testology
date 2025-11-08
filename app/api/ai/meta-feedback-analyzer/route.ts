import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getOpenAIClient } from '@/lib/openai-client';


export async function POST() {
  try {
    const feedbacks = await prisma.humanFeedback.findMany({
      where: { feedbackScore: null },
      take: 20,
    });

    if (!feedbacks.length) {
      return NextResponse.json({ message: "No new feedbacks to analyze." });
    }

    for (const f of feedbacks) {
      const prompt = `
You are an AI psychologist analyzing the reliability of human feedback on an AI-generated clinical report.
Evaluate the feedback based on:
1. Clarity and rationality of the note.
2. Consistency with AI confidence (if AI was high-confidence and human rejected, reliability may be lower).
3. Time spent (too fast = low reliability).
Return JSON with:
{ "score": 0-1, "reliability": 0-1, "comment": "..." }

Feedback:
${f.feedbackNote || "(no note)"}
Feedback type: ${f.feedbackType}
AI confidence: ${f.aiConfidence || "N/A"}
Time spent: ${f.timeTaken || "N/A"} seconds
`;

      try {
        const openai = getOpenAIClient();
        if (!openai) {
          console.warn(`OpenAI API key not configured, skipping feedback ${f.id}`);
          continue;
        }

        const res = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        });

        const content = res.choices[0]?.message?.content || "{}";
        const output = JSON.parse(content);

        await prisma.humanFeedback.update({
          where: { id: f.id },
          data: {
            feedbackScore: output.score || 0.5,
            reliability: output.reliability || 0.5,
          },
        });
      } catch (e) {
        console.warn(`Failed to analyze feedback ${f.id}:`, e);
        // Set default values if analysis fails
        await prisma.humanFeedback.update({
          where: { id: f.id },
          data: {
            feedbackScore: 0.5,
            reliability: 0.5,
          },
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      analyzed: feedbacks.length 
    });
  } catch (err: any) {
    console.error("Meta-feedback analysis failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}













