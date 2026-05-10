import connectDB from "@/utils/mongodb";
import { verifyToken } from "@/config/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const db = await connectDB();
    const settings = await db
      .collection("settings")
      .findOne({ type: "global" });
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split("Bearer ")[1];
    const verification = await verifyToken(token!);

    // update only allowed for admins
    if (!verification.isValid)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = await connectDB();
    const body = await req.json();
    delete body._id; // ID doesn't need to be updated

    const result = await db
      .collection("settings")
      .updateOne(
        { type: "global" },
        { $set: { ...body, updatedAt: new Date() } },
        { upsert: true },
      );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
