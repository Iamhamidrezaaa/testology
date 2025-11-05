import { NextRequest } from "next/server";

export const runtime = "edge"; // سریع

export async function POST(req: NextRequest) {
  const { text, voice = "alloy", format = "mp3" } = await req.json();
  const r = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1",
      voice,
      input: text || "",
      format, // mp3, wav, etc.
    }),
  });

  const buf = Buffer.from(await r.arrayBuffer());
  return new Response(buf, {
    status: 200,
    headers: {
      "Content-Type": `audio/${format}`,
      "Cache-Control": "no-store",
    },
  });
}


