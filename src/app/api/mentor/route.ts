import { GoogleGenAI } from "@google/genai"
import connectDB from "@/utils/mongodb"
import { NextRequest, NextResponse } from "next/server"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
const MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash"]

export async function POST(req: NextRequest) {
  const { messages, userId } = await req.json()

  // Fetch user's roadmaps for context
  let roadmapContext = ""
  try {
    const db = await connectDB()
    const query = userId ? { userId } : {}
    const roadmaps = await db.collection("roadmaps").find(query).sort({ _id: -1 }).limit(3).toArray()
    if (roadmaps.length) {
      roadmapContext = roadmaps.map((r: any) =>
        `Roadmap: ${r.roadmap?.skill ?? "Unknown"} (${r.roadmap?.user_profile?.current_level ?? ""})`
      ).join("\n")
    }
  } catch {}

  const systemPrompt = `You are CareerPilot AI Mentor — an expert career and learning assistant.
${roadmapContext ? `The user has these active learning roadmaps:\n${roadmapContext}\nYou can reference these when relevant.` : ""}
Be concise, helpful, and encouraging. Format responses with markdown when useful.`

  const contents = [
    { role: "user", parts: [{ text: systemPrompt }] },
    { role: "model", parts: [{ text: "Understood! I'm ready to help." }] },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    })),
  ]

  for (const model of MODELS) {
    try {
      const result = await ai.models.generateContent({ model, contents })
      return NextResponse.json({ reply: result.text ?? "" })
    } catch (err: any) {
      const isQuota = err?.status === 429 || err?.error?.code === 429
      if (!isQuota) break
    }
  }

  return NextResponse.json({ reply: "I'm currently unavailable. Please try again shortly." }, { status: 503 })
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId")
  const db = await connectDB()
  const query = userId ? { userId } : {}
  const roadmaps = await db.collection("roadmaps").find(query).sort({ _id: -1 }).limit(3).toArray()
  return NextResponse.json(roadmaps)
}