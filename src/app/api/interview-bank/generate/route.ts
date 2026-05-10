import connectDB from "@/utils/mongodb";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// 1. GET Method: Retrieve user-specific generation history
export async function GET(req: NextRequest) {
  try {
    const db = await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // If userId exists, fetch only their data; otherwise return an empty array or all (based on your logic)
    const query = userId ? { userId } : {};
    
    // Sort by { createdAt: -1 } to show the most recent generations first
    const banks = await db
      .collection("questionBanks")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(banks);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}

// 2. POST Method: Generate content using AI and save to the database
export async function POST(req: NextRequest) {
  const db = await connectDB();

  const { userId, userEmail, topic, role, level } = await req.json();

  if (!topic || typeof topic !== "string") {
    return NextResponse.json(
      { success: false, message: "Topic is required" },
      { status: 400 }
    );
  }

  // Universal Prompt: Designed to handle any subject from Science to Arts to Industry
  const prompt = `
  {
    "instruction_set": {
      "role": "Global Subject Matter Expert and Educational Consultant.",
      "objective": "Generate a COMPLETE structured knowledge and assessment bank in STRICT JSON format.",
      "constraints": [
        "Provide 10-15 high-quality questions",
        "Adapt complexity based on the provided topic and level",
        "Answers must be accurate, insightful, and formatted for easy learning"
      ]
    },
    "context": {
      "topic": "${topic}",
      "target_focus": "${role ?? "General Inquiry"}",
      "difficulty_level": "${level ?? "Foundational to Advanced"}"
    },
    "output_rules": [
      "Output MUST be VALID JSON only.",
      "Do NOT include markdown code blocks (e.g., no \`\`\`json).",
      "Do NOT include any text or commentary outside the JSON braces.",
      "Start exactly with '{' and end with '}'."
    ],
    "json_schema": {
      "topic": "string",
      "level": "string",
      "questions": [
        {
          "question": "string",
          "difficulty": "Easy | Medium | Hard",
          "shortAnswer": "string",
          "detailedAnswer": "string",
          "followUps": ["string"],
          "commonMistakes": ["string"],
          "tags": ["string"]
        }
      ]
    }
  }
  `;

  try {
    // List of models to rotate through in case of rate limits
    const modelsToTry = [
      "gemini-3-flash-preview",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
    ];

    let response;
    
    for (const model of modelsToTry) {
      try {
        console.log(`Attempting generation with model: ${model}`);
        response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        console.log(`Generation successful with: ${model}`);
        break;
      } catch (err: any) {
        // Check for 429 Resource Exhausted (Rate Limit)
        const isQuotaError =
          err?.status === 429 ||
          err?.error?.code === 429 ||
          err?.error?.status === "RESOURCE_EXHAUSTED";

        if (!isQuotaError) throw err;
        console.warn(`Quota reached for ${model}, attempting next model...`);
      }
    }

    if (!response) {
      return NextResponse.json(
        { success: false, message: "All AI models are currently rate limited. Please try again later." },
        { status: 429 }
      );
    }

    const text = response.text ?? "{}";
    
    // Extract JSON using Regex to ensure a clean object even if AI adds extra text
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    let questionBank: any = null;
    if (jsonMatch) {
      try {
        questionBank = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error("JSON Parsing Error:", parseError);
      }
    }

    // Validate the structure before saving
    if (!questionBank || !questionBank.questions) {
        throw new Error("The AI provided an invalid data structure. Please try again.");
    }

    // Save the generation to MongoDB for the user's history
    const result = await db.collection("questionBanks").insertOne({
      userId,
      userEmail,
      topic,
      role: role ?? "Universal Expert",
      level: level ?? "Comprehensive",
      questionBank,
      createdAt: new Date(), // Timestamp for sorting history
    });

    return NextResponse.json({ 
        success: true, 
        questionBank, 
        id: result.insertedId 
    });

  } catch (error: any) {
    console.error("AI Generation Route Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An internal server error occurred" },
      { status: 500 }
    );
  }
}