import connectDB from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const db = await connectDB();
  const { id } = await params;
  const attemptId = id;

  try {
    const attempt = await db.collection("quizAttempts").findOne({
      _id: new ObjectId(attemptId),
    });

    if (!attempt) {
      return NextResponse.json(
        { success: false, message: "Quiz attempt not found" },
        { status: 404 },
      );
    }

    // Get all attempts for this topic to calculate percentile
    const allAttempts = await db
      .collection("quizAttempts")
      .find({ topic: attempt.topic })
      .toArray();

    const scoresBelow = allAttempts.filter(
      (a: any) => a.score.percentage < attempt.score.percentage,
    ).length;
    const percentile = Math.round((scoresBelow / allAttempts.length) * 100);

    // Get average score for this topic/difficulty combination
    const similarAttempts = allAttempts.filter(
      (a: any) =>
        a.topic === attempt.topic && a.difficulty === attempt.difficulty,
    );
    const averageScore =
      similarAttempts.length > 0
        ? Math.round(
            similarAttempts.reduce(
              (sum: any, a: any) => sum + a.score.percentage,
              0,
            ) / similarAttempts.length,
          )
        : 0;

    return NextResponse.json({
      success: true,
      attempt,
      comparison: {
        userScore: attempt.score.percentage,
        averageScore,
        percentile,
        totalAttempts: allAttempts.length,
      },
    });
  } catch (error: any) {
    console.error("Get results error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch results" },
      { status: 500 },
    );
  }
}
