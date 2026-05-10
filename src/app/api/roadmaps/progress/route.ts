import connectDB from "@/utils/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId, roadmapId, topicId, action } = await req.json();

        const db = await connectDB();

        const query = {
            userId,
            roadmapId,
        };

        const update =
            action === "add"
                ? { $addToSet: { completedTopics: topicId } }
                : { $pull: { completedTopics: topicId } };

        const result = await db
            .collection("progress")
            .updateOne(query, update, { upsert: true });

        return NextResponse.json({
            success: true,
            upserted: result.upsertedCount > 0,
        });
    } catch (error) {
        console.error("Database Update Error:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
