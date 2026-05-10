import connectDB from "@/utils/mongodb";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function GET() {
    return NextResponse.json({ message: "Vapi api is working!" });
}

export async function POST(request: NextRequest) {
    const { userId, roadmapObj, userInput, difficulty, topic } =
        await request.json();

    const db = await connectDB();

    //console.log(roadmap);

    const qAmount = 3;
    const prompt = `You are a world-class interview question generator with expertise across every domain — from professional careers to esports, sports, arts, crafts, and technical skills. 
                    Your task is to generate ${qAmount} concise, engaging, and high-quality interview questions for a ${difficulty} level candidate.

                    Use the following roadmap information if available:

                    Skill or Activity: ${roadmapObj.roadmap?.skill || userInput}
                    User Profile: ${roadmapObj.roadmap?.user_profile ? JSON.stringify(roadmapObj.roadmap.user_profile) : "N/A"}
                    Roadmap Summary: ${roadmapObj.roadmap?.roadmap_summary ? JSON.stringify(roadmapObj.roadmap.roadmap_summary) : "N/A"}
                    Phases: ${roadmapObj.roadmap?.phases ? roadmapObj.roadmap.phases.map((p: any) => `${p.phase_title}: ${p.phase_objective}`).join("; ") : "N/A"}
                    Milestones: ${roadmapObj.roadmap?.phases ? roadmapObj.roadmap.phases.flatMap((p: any) => p.milestones).join("; ") : "N/A"}
                    Key Projects: ${roadmapObj.roadmap?.phases ? roadmapObj.roadmap.phases.flatMap((p: any) => p.projects.map((pr: any) => pr.project_title)).join("; ") : "N/A"}
                    Resources: ${roadmapObj.roadmap?.phases ? roadmapObj.roadmap.phases.flatMap((p: any) => p.resources.documentation.concat(p.resources.youtube_channels).map((r: any) => r.name)).join("; ") : "N/A"}

                    Focus: ${topic} (Behavioral, Skill-Based, or Scenario/Problem Solving)

                    Guidelines:
                    1. Generate questions that are **clear, short, and universally applicable**, regardless of the skill domain.
                    2. Ensure questions encourage **thoughtful, real-world style answers**.
                    3. Avoid **any special characters** such as /, *, &, %, or brackets — questions will be read aloud by a voice assistant.
                    4. Tailor questions based on the roadmap details above. If roadmap info is missing, fallback to userInput to infer context.
                    5. Balance questions according to focus type:
                    - Behavioral: teamwork, leadership, adaptability, decision-making.
                    - Skill-Based: practical expertise, tools, methods, and applied knowledge.
                    - Scenario/Problem Solving: strategic thinking, analysis, creativity, and reasoning.

                    Output Format:
                    Return only a JSON array of strings with the questions, like this:
                    ["Question 1", "Question 2", "Question 3"]

                    Make the questions **engaging, voice-friendly, universal, and ready to use in an actual interview**, reflecting both roadmap details and the user's level of experience.`;

    try {
        const modelsToTry = [
            "gemini-3-flash-preview",
            "gemini-2.5-flash",
            "gemini-2.5-flash-lite",
        ];

        let res;
        let lastError;

        for (const model of modelsToTry) {
            try {
                console.log(`Trying model: ${model}`);

                res = await ai.models.generateContent({
                    model,
                    contents: prompt,
                });

                console.log(`Success with model: ${model}`);
                break; // exit loop if successful
            } catch (err: any) {
                lastError = err;

                // Retry on rate limit (429) or service unavailable (503)
                if (
                    err?.status === 429 ||
                    err?.error?.code === 429 ||
                    err?.status === 503 ||
                    err?.error?.code === 503
                ) {
                    console.warn(
                        `Model ${model} unavailable (status ${err?.status ?? err?.error?.code}), trying next model...`,
                    );
                    continue; // try next model
                }

                // Any other error: stop trying
                console.error("Unexpected error:", err);
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Unexpected error occurred while generating questions.",
                    },
                    { status: 500 },
                );
            }
        }

        if (!res) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "All AI models are currently rate limited. Please try again later.",
                },
                { status: 429 },
            );
        }

        const rawText = res.text ?? "[]";
        let questions: string[];

        try {
            questions = JSON.parse(rawText);
        } catch {
            questions = [rawText];
        }

        //console.log(roadmapObj);

        const interview = {
            userId,
            roadmapId: roadmapObj.id,
            userInput,
            difficulty,
            topic,
            questions,
            createdAt: new Date(),
        };

        await db.collection("interviews").insertOne(interview);

        const interviews = await db.collection("interviews").find({}).toArray();

        return NextResponse.json({
            success: true,
            questions,
            interviews,
            createdAt: new Date().toISOString(),
        });
    } catch (e: any) {
        console.log("Gemini Error:", e);

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 },
        );
    }
}
