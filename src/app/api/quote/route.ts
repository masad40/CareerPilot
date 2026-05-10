import { GoogleGenAI } from "@google/genai";
import connectDB from "@/utils/mongodb";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
]

async function getDbQuote() {
  const db = await connectDB();
  const quotes = await db.collection("quotes").find({}).toArray();
  if (!quotes.length) return null;
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export async function GET() {
  // Use a random seed topic so Gemini doesn't repeat the same quote
  const topics = [
    "deep work", "consistency", "learning", "resilience", "focus",
    "growth mindset", "discipline", "creativity", "patience", "progress",
  ]
  const topic = topics[Math.floor(Math.random() * topics.length)]

  let lastError: unknown

  for (const model of MODELS) {
    try {
      const result = await ai.models.generateContent({
        model,
        contents: `Generate a unique, lesser-known motivational quote about "${topic}" for someone in a focused study/pomodoro session.
Do NOT use famous overused quotes. Be creative and varied.
Return ONLY valid JSON: {"text": "quote here", "author": "Author Name"}
No markdown, no explanation, just the raw JSON object.`,
      })

      const raw = result.text?.trim().replace(/```json|```/g, "").trim() ?? ""
      const match = raw.match(/\{[\s\S]*\}/)
      if (!match) throw new Error("No JSON found")

      const parsed = JSON.parse(match[0])
      if (parsed.text && parsed.author) return NextResponse.json(parsed)
      throw new Error("Invalid shape")
    } catch (err: unknown) {
      lastError = err
      const isQuota =
        (err as any)?.status === 429 ||
        (err as any)?.error?.code === 429 ||
        (err as any)?.error?.status === "RESOURCE_EXHAUSTED"

      if (!isQuota) break // non-quota error, skip retrying other models
    }
  }

  console.warn("Gemini quote failed, falling back to DB:", lastError)

  // Fallback: random quote from MongoDB
  try {
    const dbQuote = await getDbQuote()
    if (dbQuote) return NextResponse.json({ text: dbQuote.text, author: dbQuote.author })
  } catch (e) {
    console.warn("DB quote fallback failed:", e)
  }

  return NextResponse.json({ text: "", author: "" }, { status: 503 })
}
