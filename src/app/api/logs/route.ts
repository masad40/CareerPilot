import connectDB from "@/utils/mongodb";
import { verifyToken } from "@/config/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split("Bearer ")[1];
    const verification = await verifyToken(token!);

    if (!verification.isValid)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = await connectDB();

    // latest 100 logs sorted by timestamp desc for admin dashboard
    const logs = await db
      .collection("logs")
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 },
    );
  }
}
