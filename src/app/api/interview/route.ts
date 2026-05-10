import connectDB from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const db = await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json(
            { error: "User ID is required" },
            { status: 400 },
        );
    }

    const interviews = await db
        .collection("interviews")
        .find({ userId })
        .toArray();
    const interviewIds = interviews.map((i) => i._id.toString());

    const roadmapIds = interviews
        .map((i) => i.roadmapId)
        .filter(Boolean)
        .map((id) => new ObjectId(id));

    const roadmaps = await db
        .collection("roadmaps")
        .find(
            { _id: { $in: roadmapIds } },
            { projection: { "roadmap.skill": 1 } },
        )
        .toArray();

    const feedbacks = await db
        .collection("feedbacks")
        .find(
            { interviewId: { $in: interviewIds } },
            { projection: { interviewId: 1 } },
        )
        .toArray();

    const feedbackSet = new Set(feedbacks.map((f) => f.interviewId));

    const fullInterviews = interviews.map((interview) => {
        const matchingRoadmap = roadmaps.find(
            (r) => r._id.toString() === interview.roadmapId?.toString(),
        );

        return {
            ...interview,
            roadmapSkill: matchingRoadmap?.roadmap?.skill,
            hasFeedback: feedbackSet.has(interview._id.toString()),
        };
    });

    return NextResponse.json(fullInterviews);
}
