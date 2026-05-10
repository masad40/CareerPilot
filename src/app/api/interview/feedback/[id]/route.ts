import connectDB from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: { id: string } | Promise<{ id: string }> },
) {
    try {
        const { params } = context;
        const { id } = (await params) as { id: string };
        console.log(id);
        if (!id) {
            return NextResponse.json(
                { error: "ID is required" },
                { status: 400 },
            );
        }

        const db = await connectDB();
        const collection = db.collection("feedbacks");

        // Fetch the document by _id
        const feedbackDoc = await collection.findOne({ _id: new ObjectId(id) });

        if (!feedbackDoc) {
            return NextResponse.json(
                { error: "Feedback not found" },
                { status: 404 },
            );
        }

        // Optionally remove MongoDB-specific _id before returning
        const { _id, ...feedback } = feedbackDoc;

        return NextResponse.json(feedback);
    } catch (err: any) {
        console.error("Error fetching feedback:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
