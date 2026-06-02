import connectDB from "@/utils/mongodb";
import { GoogleGenAI } from "@google/genai";
import { verifyToken } from "@/config/verifyToken";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// retry wrapper (FIXED)
async function generateWithRetry(prompt: string, retries = 3) {
  let lastError: any;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Gemini Attempt ${attempt}/${retries}`);

      return await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
    } catch (error: any) {
      lastError = error;

      console.error(
        `Gemini attempt ${attempt} failed:`,
        error?.status,
        error?.message
      );

      // retry only for 503
      if (error?.status === 503 && attempt < retries) {
        const delay = attempt * 3000;
        console.log(`Retrying in ${delay}ms...`);

        await new Promise((res) => setTimeout(res, delay));
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

function calculateTimeLimit(questionCount: number): number {
  if (questionCount === 15) return 10;
  if (questionCount === 20) return 15;
  if (questionCount === 30) return 20;
  return Math.ceil(questionCount * 0.8);
}

export async function POST(req: NextRequest) {
  try {
    console.log("=== QUIZ GENERATION STARTED ===");

    const db = await connectDB();

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
    } catch (err) {
      console.error("Token verification failed:", err);
    }

    const body = await req.json();
    console.log("Request Body:", body);

    const { topic, difficulty, questionCount } = body;

    if (!topic || !difficulty || !questionCount) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const templateKey = `${topic
      .toLowerCase()
      .replace(/\s+/g, "_")}_${difficulty.toLowerCase()}_${questionCount}`;

    const existingQuiz = await db
      .collection("quizTemplates")
      .findOne({ templateKey });

    if (existingQuiz) {
      console.log("Returning cached quiz");

      await db.collection("quizTemplates").updateOne(
        { _id: existingQuiz._id },
        {
          $inc: { "metadata.totalAttempts": 1 },
          ...(userEmail
            ? { $addToSet: { usedBy: userEmail } }
            : {}),
        }
      );

      return NextResponse.json({
        success: true,
        quiz: existingQuiz,
        source: "cached",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    const prompt = `
Generate exactly ${questionCount} MCQ questions about "${topic}".
Difficulty: ${difficulty}

Return ONLY valid JSON:

{
  "questions": [
    {
      "id": 1,
      "question": "Question text",
      "options": [
        { "id": "a", "text": "Option A" },
        { "id": "b", "text": "Option B" },
        { "id": "c", "text": "Option C" },
        { "id": "d", "text": "Option D" }
      ],
      "correctAnswer": "a",
      "explanation": "Explanation",
      "difficulty": "${difficulty}",
      "category": "General",
      "tags": ["${topic}"]
    }
  ]
}
`;

    console.log("Calling Gemini...");

    // ✅ FIXED CALL
    const response = await generateWithRetry(prompt);

    let generatedContent = response.text || "";

    console.log("RAW GEMINI RESPONSE:", generatedContent);

    // remove markdown safely
    generatedContent = generatedContent
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // extract JSON safely
    const start = generatedContent.indexOf("{");
    const end = generatedContent.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON from Gemini");
    }

    const cleanJson = generatedContent.slice(start, end + 1);

    let parsedQuestions;

    try {
      parsedQuestions = JSON.parse(cleanJson);
    } catch (err) {
      console.error("JSON PARSE ERROR:", err);
      throw new Error("Failed to parse Gemini JSON");
    }

    if (!parsedQuestions.questions || !Array.isArray(parsedQuestions.questions)) {
      throw new Error("Invalid questions format");
    }

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

    const result = await db
      .collection("quizTemplates")
      .insertOne(newQuiz);

    return NextResponse.json({
      success: true,
      source: "generated",
      quiz: {
        ...newQuiz,
        _id: result.insertedId,
      },
    });
  } catch (error: any) {
    console.error("QUIZ GENERATION ERROR:", error);

    if (error?.status === 503) {
      return NextResponse.json(
        {
          success: false,
          message: "AI is busy. Please try again in a moment.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Unknown server error",
      },
      { status: 500 }
    );
  }
}