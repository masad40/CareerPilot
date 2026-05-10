import connectDB from "@/utils/mongodb";
import { GoogleGenAI } from "@google/genai";
import { verifyToken } from "@/config/verifyToken";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

function calculateTimeLimit(questionCount: number): number {
  if (questionCount === 15) return 10;
  if (questionCount === 20) return 15;
  if (questionCount === 30) return 20;
  return Math.ceil(questionCount * 0.8);
}

export async function POST(req: NextRequest) {
  const db = await connectDB();

  // Extract user identity from token (optional)
  let userEmail: string | null = null;
  let userId: string | null = null;
  try {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];
    if (token) {
      const v = await verifyToken(token);
      if (v.isValid) {
        userEmail = v.user?.email ?? null;
        userId = v.user?.uid ?? null;
      }
    }
  } catch {}

  const { topic, difficulty, questionCount } = await req.json();

  if (!topic || !difficulty || !questionCount) {
    return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
  }

  try {
    const templateKey = `${topic.toLowerCase().replace(/\s+/g, "_")}_${difficulty.toLowerCase()}_${questionCount}`;

    const existingQuiz = await db.collection("quizTemplates").findOne({ templateKey });

    if (existingQuiz) {
      await db.collection("quizTemplates").updateOne(
        { _id: existingQuiz._id },
        {
          $inc: { "metadata.totalAttempts": 1 },
          ...(userEmail ? { $addToSet: { usedBy: userEmail } } : {}),
        },
      );
      return NextResponse.json({ success: true, quiz: existingQuiz, source: "cached" });
    }

    const prompt = `You are an expert quiz question generator for technical interviews and skill assessments.

TASK: Generate exactly ${questionCount} multiple-choice questions for the topic: "${topic}" at ${difficulty} difficulty level.

QUALITY REQUIREMENTS:
1. Each question must have:
   - Clear, unambiguous question text
   - 4 options (a, b, c, d)
   - Exactly 1 correct answer
   - A detailed explanation (2-3 sentences)
   - Difficulty classification
   - Category/tags

2. Options should be plausible but only 1 correct, free of grammatical errors
3. Questions should be appropriate for ${difficulty} level
4. Avoid trick questions and ambiguous wording

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": [
        {"id": "a", "text": "Option A"},
        {"id": "b", "text": "Option B"},
        {"id": "c", "text": "Option C"},
        {"id": "d", "text": "Option D"}
      ],
      "correctAnswer": "c",
      "explanation": "This is the correct answer because...",
      "difficulty": "${difficulty}",
      "category": "Category Name",
      "tags": ["tag1", "tag2"]
    }
  ]
}

Generate ONLY valid JSON, no additional text or markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let generatedContent = response.text || "";
    if (generatedContent.includes("```json")) {
      generatedContent = generatedContent.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (generatedContent.includes("```")) {
      generatedContent = generatedContent.replace(/```/g, "");
    }

    const parsedQuestions = JSON.parse(generatedContent.trim());

    const newQuiz = {
      topic,
      difficulty,
      questionCount,
      timeLimit: calculateTimeLimit(questionCount),
      templateKey,
      questions: parsedQuestions.questions,
      createdByEmail: userEmail,
      createdByUid: userId,
      usedBy: userEmail ? [userEmail] : [],
      metadata: {
        averageScore: 0,
        totalAttempts: 1,
        passRate: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userEmail ?? "ai",
      },
    };

    const result = await db.collection("quizTemplates").insertOne(newQuiz);

    return NextResponse.json({
      success: true,
      quiz: { ...newQuiz, _id: result.insertedId },
      source: "generated",
    });
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to generate quiz" }, { status: 500 });
  }
}
