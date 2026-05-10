import connectDB from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const db = await connectDB();
  const userId = req.nextUrl.searchParams.get("userId");
  const query = userId ? { userId } : {};
  const activities = await db.collection("activities").find(query).toArray();
  return NextResponse.json(activities);
}

export async function POST(req: NextRequest) {
  const db = await connectDB();
  const { title, description, status, start, end, timezone, userId } = await req.json();
  const result = await db.collection("activities").insertOne({
    title, description, status, start, end, timezone, userId,
  });
  return NextResponse.json({ message: "Activity created", id: result.insertedId });
}

export async function PATCH(req: NextRequest) {
  const db = await connectDB();
  const { _id, ...fields } = await req.json();
  await db.collection("activities").updateOne(
    { _id: new ObjectId(_id) },
    { $set: fields }
  );
  return NextResponse.json({ message: "Activity updated" });
}
