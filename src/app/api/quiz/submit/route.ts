import connectDB from "@/utils/mongodb";
import { verifyToken } from "@/config/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split("Bearer ")[1];

    const db = await connectDB();
    const body = await req.json();

    // Get user identity from token if available, fallback to body fields
    let userEmail = body.userEmail ?? null;
    let userId = body.userId ?? null;

    if (token) {
      try {
        const verification = await verifyToken(token);
        if (verification.isValid) {
          userEmail = verification.user?.email ?? userEmail;
          userId = verification.user?.uid ?? userId;
        }
      } catch {}
    }

    const attempt = {
      ...body,
      userEmail,
      userId,
      createdAt: new Date(),
    };

    const result = await db.collection("quizAttempts").insertOne(attempt);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (err: any) {
    console.error("[quiz/submit POST]", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split("Bearer ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const verification = await verifyToken(token);
    if (!verification.isValid) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const userEmail = verification.user?.email;
    const uid = verification.user?.uid;
    const db = await connectDB();

    // Fetch single attempt by _id
    const attemptId = req.nextUrl.searchParams.get("id");
    if (attemptId) {
      const { ObjectId } = await import("mongodb");
      const attempt = await db.collection("quizAttempts").findOne({ _id: new ObjectId(attemptId) });
      if (!attempt) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ success: true, attempt });
    }

    // Fetch all attempts for this user
    const attempts = await db
      .collection("quizAttempts")
      .find({
        $or: [
          { userEmail },
          { userId: userEmail },
          { userId: uid },
          { email: userEmail },
        ],
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ success: true, attempts });
  } catch (err: any) {
    console.error("[quiz/submit GET]", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
