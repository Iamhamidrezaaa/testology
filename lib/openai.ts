import OpenAI from "openai";

let _client: OpenAI | null = null;

/** Create or reuse OpenAI client safely (only when key exists) */
export function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key || key.trim().length === 0) return null;
  if (!_client) _client = new OpenAI({ apiKey: key });
  return _client;
}
