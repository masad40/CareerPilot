import { NextResponse } from "next/server";
import connectDB from "@/utils/mongodb";

export async function GET() {
  try {
    const db = await connectDB();

    const users = await db.collection("users").find({}).toArray();
    console.log("Total Users in DB:", users.length);

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Fetch Users Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", details: error.message },
      { status: 500 },
    );
  }
}
