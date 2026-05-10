// app/api/roadmaps/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // 1. Get the URL from the request
    const { searchParams } = new URL(request.url);

    // 2. Extract the 'userId' you sent from useQuery
    const userId = searchParams.get("userId");

    console.log("Filtering for User ID:", userId);

    if (!userId) {
        return NextResponse.json(
            { message: "User ID is required" },
            { status: 400 },
        );
    }

    // 3. Perform your database logic here
    // const roadmaps = await db.roadmap.findMany({ where: { userId } });

    return NextResponse.json([{ id: 1, title: "My First Roadmap" }]);
}
