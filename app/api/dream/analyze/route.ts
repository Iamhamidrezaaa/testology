import { NextRequest, NextResponse } from "next/server";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  const r = await fetch(OPENAI_URL, {
    method:"POST",
    headers:{
      "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      messages:[
        { role:"system", content:"تو تحلیل‌گر خواب با رویکرد شناختی-روانی هستی. نمادسازی، هیجان غالب و فرضیهٔ ملایم ارائه بده؛ قطعی نباش." },
        { role:"user", content: text || "" }
      ]
    })
  });
  const j = await r.json();
  const reply = j?.choices?.[0]?.message?.content || "…";
  return NextResponse.json({ analysis: reply });
}


