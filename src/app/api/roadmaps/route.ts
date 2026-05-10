import connectDB from "@/utils/mongodb";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

export async function GET(req: NextRequest) {
    try {
        const db = await connectDB();

        const userId = req.nextUrl.searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "UserId is required" },
                { status: 400 },
            );
        }

        const roadmaps = await db
            .collection("roadmaps")
            .aggregate([
                {
                    $match: { userId },
                },
                {
                    $lookup: {
                        from: "progress",
                        let: { roadmapId: { $toString: "$_id" } },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$roadmapId",
                                                    "$$roadmapId",
                                                ],
                                            },
                                            { $eq: ["$userId", userId] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "progress",
                    },
                },
                {
                    $addFields: {
                        completedTopics: {
                            $ifNull: [
                                {
                                    $arrayElemAt: [
                                        "$progress.completedTopics",
                                        0,
                                    ],
                                },
                                [],
                            ],
                        },
                    },
                },
                {
                    $project: {
                        progress: 0,
                    },
                },
            ])
            .toArray();

        return NextResponse.json(roadmaps);
    } catch (error) {
        console.error("Error fetching roadmaps:", error);

        return NextResponse.json(
            { error: "Failed to fetch roadmaps" },
            { status: 500 },
        );
    }
}

export async function POST(req: NextRequest) {
    const db = await connectDB();
    const { userId, userEmail, query, duration, hours, currentLevel } =
        await req.json();

    const prompt = `
      {
        "instruction_set": {
          "role": "World-Class Learning Architect and SME with 50+ years of experience in instructional design and mastery-based learning.",
          "objective": "Generate a COMPLETE and HIGHLY STRUCTURED learning roadmap in STRICT JSON format based on specific user parameters.",
          "pedagogical_frameworks": [
            "Bloom's Taxonomy for cognitive progression",
            "70-20-10 Learning Model (70% Practice, 20% Review, 10% Theory)",
            "Spaced Repetition and Scaffolding"
          ]
        },
        "user_context": {
          "skill_to_learn": "${query}",
          "current_level": "${currentLevel}",
          "hours_per_day": ${hours},
          "total_weeks": ${duration}
        },
        "design_requirements": {
          "time_budgeting": "Strictly calculate total bandwidth (Hours * 7 * Weeks). Do not over-schedule; prioritize depth over breadth.",
          "level_specificity": {
            "Beginner": "Focus on syntax, core mental models, and environment setup.",
            "Intermediate": "Focus on architecture, design patterns, debugging, and integrations.",
            "Advanced": "Focus on optimization, security, scalability, and professional industry standards."
          },
          "content_quality": "No vague statements like 'learn basics'. Use specific sub-modules, industry-standard tools, and official documentation links."
        },
        "output_rules": [
          "Output MUST be VALID JSON only.",
          "Do NOT include markdown code blocks (no \`\`\`json).",
          "Do NOT include any text, commentary, or greetings outside of the JSON object.",
          "Start the response with '{' and end with '}'.",
          "Ensure all strings are properly escaped for JSON compliance."
        ],
        "json_schema": {
          "skill": "string",
          "user_profile": {
            "current_level": "string",
            "hours_per_day": "number",
            "total_weeks": "number",
            "total_estimated_hours": "number"
          },
          "roadmap_summary": { "goal": "string", "strategy_overview": "string", "expected_outcome": "string" },
          "phases": [
            {
              "phase_number": "number",
              "phase_title": "string",
              "duration_weeks": "number",
              "phase_objective": "string",
              "topics": [{ "topic_name": "string", "subtopics": ["string"] }],
              "projects": [{ "project_title": "string", "description": "string", "key_features": ["string"], "skills_applied": ["string"], "estimated_hours": "number" }],
              "milestones": ["string"],
              "resources": {
                "documentation": [{"name": "string", "link": "url"}],
                "courses": [{"name": "string", "platform": "string", "type": "free/paid", "link": "url"}],
                "youtube_channels": [{"name": "string", "link": "url"}],
                "books": [{"name": "string", "link": "url"}],
                "practice_platforms": [{"name": "string", "link": "url"}]
              }
            }
          ],
          "weekly_breakdown": [{ "week": "number", "daily_focus": "string", "deliverables": ["string"], "study_hours_target": "number" }],
          "final_capstone_project": { "title": "string", "description": "string", "requirements": ["string"], "skills_demonstrated": ["string"], "estimated_hours": "number" },
          "success_metrics": ["string"],
          "career_next_steps": ["string"]
        }
      }
    `;

    try {
        const modelsToTry = [
            "gemini-3-flash-preview",
            "gemini-2.5-flash",
            "gemini-2.5-flash-lite",
        ];

        let response;
        let lastError;

        for (const model of modelsToTry) {
            try {
                console.log(`Trying model: ${model}`);

                response = await ai.models.generateContent({
                    model,
                    contents: prompt,
                });

                console.log(`Success with model: ${model}`);
                break;
            } catch (err: any) {
                lastError = err;

                const isQuotaError =
                    err?.status === 429 ||
                    err?.error?.code === 429 ||
                    err?.error?.status === "RESOURCE_EXHAUSTED";

                if (!isQuotaError) {
                    throw err;
                }

                console.log(`Quota hit for ${model}, trying next...`);
            }
        }

        if (!response) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "All AI models are currently rate limited. Please try again later.",
                },
                { status: 429 },
            );
        }

        const text = response.text ?? "{}";
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        let roadmap = {};

        if (jsonMatch) {
            try {
                roadmap = JSON.parse(jsonMatch[0]);
            } catch {
                roadmap = {};
            }
        }

        await db
            .collection("roadmaps")
            .insertOne({ userId: userId, userEmail: userEmail, roadmap });

        return NextResponse.json({ roadmap });
    } catch (error) {
        console.log("AI Error:", error);

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}
