import connectDB from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ai } from "../vapi/route";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
    const db = await connectDB();
    const { searchParams } = new URL(req.url);
    const interviewId = searchParams.get("interviewId");

    console.log(interviewId);

    if (!interviewId)
        return NextResponse.json({ error: "Required ID" }, { status: 400 });

    const feedbacks = await db
        .collection("feedbacks")
        .find({ interviewId: interviewId.trim() })
        .sort({ generatedAt: -1 })
        .toArray();
    console.log("feedbacks returned ", feedbacks);
    return NextResponse.json(feedbacks);
}

export async function POST(req: NextRequest) {
    const db = await connectDB();
    const body = await req.json();
    const { userId, interviewId, messages } = body;

    if (!userId || !interviewId) {
        return NextResponse.json(
            {
                success: false,
                message: "Missing userId or interviewId",
            },
            { status: 400 },
        );
    }
    if (!Array.isArray(messages) || messages.length === 0) {
        return NextResponse.json(
            {
                success: false,
                message: "Messages must be a non-empty array",
            },
            { status: 400 },
        );
    }

    const interview = await db
        .collection("interviews")
        .findOne({ _id: new ObjectId(interviewId) });
    const roadmap = await db
        .collection("roadmaps")
        .findOne({ _id: new ObjectId(interview?.roadmapId) });

    const transcriptText = messages
        .filter((msg) => msg?.role && msg?.content)
        .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join("\n\n");

    if (!transcriptText.trim()) {
        return NextResponse.json(
            { success: false, message: "Transcript content is empty" },
            { status: 400 },
        );
    }

    const prompt = `
            You are an industry-grade performance evaluator and assessment specialist.

            Your role is to conduct a strict, evidence-based evaluation of a live interview transcript.
            This is NOT limited to job interviews. The skill domain may include:

            - Professional careers
            - Sports and athletics
            - Esports and competitive gaming
            - Technical skills
            - Creative arts and crafts
            - Field or trade skills
            - Leadership or soft skills
            - Personal performance development

            You must intelligently adapt to the domain provided.

            ----------------------------------------------------------------------
            CONTEXT SOURCE PRIORITY
            ----------------------------------------------------------------------

            If roadmap data is provided, evaluate performance against:
            - Roadmap goal
            - Strategy overview
            - Milestones
            - Success metrics
            - Capstone requirements
            - Declared experience level

            If roadmap data is NOT provided, evaluate performance based ONLY on:
            - interview.userInput (skill or activity context)
            - interview.difficulty
            - Transcript evidence

            Do NOT assume roadmap data exists.
            Gracefully fallback when fields are missing.

            ----------------------------------------------------------------------
            CANDIDATE CONTEXT
            ----------------------------------------------------------------------

            Skill or Activity:
            ${roadmap?.skill || interview?.userInput || "Not specified"}

            Difficulty Level:
            ${interview?.difficulty || "Not specified"}

            User Profile:
            ${roadmap?.user_profile ? JSON.stringify(roadmap.user_profile) : "Not provided"}

            Roadmap Goal:
            ${roadmap?.roadmap_summary?.goal || "Not provided"}

            Expected Outcome:
            ${roadmap?.roadmap_summary?.expected_outcome || "Not provided"}

            Milestones:
            ${
                roadmap?.phases
                    ? roadmap.phases
                          .flatMap((p: any) => p.milestones)
                          .join("; ")
                    : "Not provided"
            }

            Success Metrics:
            ${roadmap?.success_metrics?.join("; ") || "Not provided"}

            ----------------------------------------------------------------------
            INTERVIEW TRANSCRIPT
            ----------------------------------------------------------------------
            ${transcriptText}

            ----------------------------------------------------------------------
            STRICT EVALUATION FRAMEWORK
            ----------------------------------------------------------------------

            You must grade strictly and professionally.

            Scoring Rules:
            - Each category is scored out of 100.
            - 90 to 100 = elite mastery, precise reasoning, strong evidence.
            - 75 to 89 = strong but with minor gaps.
            - 60 to 74 = competent but lacks depth or clarity.
            - 40 to 59 = shallow understanding or inconsistent reasoning.
            - Below 40 = weak, vague, or unsupported answers.

            Penalty Rules:
            - Deduct points for vague language.
            - Deduct points for generic statements without examples.
            - Deduct points for lack of measurable outcomes.
            - Deduct points if responses lack strategic thinking at higher difficulty.
            - Advanced level candidates must demonstrate optimization, adaptability, and high-level reasoning.

            Difficulty Calibration:
            - Beginner: evaluate fundamentals and clarity.
            - Intermediate: evaluate structured thinking and applied knowledge.
            - Advanced: evaluate mastery, precision, optimization, and strategic depth.

            ----------------------------------------------------------------------
            EVALUATION CATEGORIES (Score out of 100 each)
            ----------------------------------------------------------------------

            1. Communication and Clarity
            2. Domain Knowledge and Skill Depth
            3. Strategic or Analytical Thinking
            4. Practical Application and Execution
            5. Self Awareness and Reflective Growth
            6. Composure and Professional Presence

            Be rigorous. Do not inflate scores.

            ----------------------------------------------------------------------
            OUTPUT FORMAT
            ----------------------------------------------------------------------

            Return ONLY valid JSON with the following structure:

            {
            "overallScore": number between 0 and 100,
            "overallPerformanceSummary": "Concise high-level evaluation",
            "readinessAssessment": "Assessment of readiness relative to goal or difficulty",
            "categoryScores": [
                {
                "category": "Communication and Clarity",
                "score": number between 0 and 100,
                "justification": "Evidence-based explanation"
                },
                {
                "category": "Domain Knowledge and Skill Depth",
                "score": number between 0 and 100,
                "justification": "Evidence-based explanation"
                },
                {
                "category": "Strategic or Analytical Thinking",
                "score": number between 0 and 100,
                "justification": "Evidence-based explanation"
                },
                {
                "category": "Practical Application and Execution",
                "score": number between 0 and 100,
                "justification": "Evidence-based explanation"
                },
                {
                "category": "Self Awareness and Reflective Growth",
                "score": number between 0 and 100,
                "justification": "Evidence-based explanation"
                },
                {
                "category": "Composure and Professional Presence",
                "score": number between 0 and 100,
                "justification": "Evidence-based explanation"
                }
            ],
            "strengths": ["Specific strength 1", "Specific strength 2"],
            "criticalImprovementAreas": ["Specific gap 1", "Specific gap 2"],
            "roadmapOrGoalAlignment": "Explain how performance aligns or misaligns with roadmap or stated skill objective",
            "actionableNextSteps": ["Clear next step 1", "Clear next step 2"],
            "finalVerdict": "Professional, direct, strict closing evaluation"
            }

            Rules:
            - Do NOT include markdown.
            - Do NOT include commentary outside JSON.
            - Do NOT soften criticism unnecessarily.
            - Base all judgments on transcript evidence only.`;

    try {
        const modelsToTry = [
            "gemini-3-flash-preview",
            "gemini-2.5-flash",
            "gemini-2.5-flash-lite",
        ];

        let res: any = null;
        let lastError: any = null;

        for (const model of modelsToTry) {
            try {
                console.log(`Trying model: ${model}`);

                res = await ai.models.generateContent({
                    model,
                    contents: prompt,
                });

                console.log(`Success with model: ${model}`);
                break;
            } catch (err: any) {
                lastError = err;

                const status = err?.status || err?.error?.code;

                // Retry on rate limit or temporary overload
                if (status === 429 || status === 503) {
                    console.log(
                        `Model ${model} failed with ${status}, trying next...`,
                    );
                    continue;
                }

                // If it's not retryable, throw immediately
                throw err;
            }
        }

        if (!res) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "All AI models are currently unavailable. Please try again later.",
                },
                { status: 503 },
            );
        }

        const text = res?.text?.trim();

        if (!text) {
            return NextResponse.json(
                {
                    success: false,
                    message: "AI returned empty feedback.",
                },
                { status: 500 },
            );
        }

        const feedback = {
            success: true,
            userId,
            interviewId,
            feedback: text,
            generatedAt: new Date().toISOString(),
        };

        const result = await db.collection("feedbacks").insertOne(feedback);

        return NextResponse.json({ feedbackId: result.insertedId, feedback });
    } catch (error: any) {
        console.error("Feedback Generation Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 },
        );
    }
}
