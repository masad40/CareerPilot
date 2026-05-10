import connectDB from "@/utils/mongodb";
import { verifyToken } from "@/config/verifyToken";
import { NextRequest, NextResponse } from "next/server";

// --- Helper Function: Create System Log ---
async function createLog(
  db: any,
  action: string,
  performedBy: string,
  details: string,
) {
  try {
    await db.collection("logs").insertOne({
      action,
      performedBy,
      details,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Logging Error:", err);
  }
}

// --- GET Method: Fetch specific user, all users, and dynamic stats ---
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const verification = await verifyToken(token);
    if (!verification.isValid) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    const db = await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const all = searchParams.get("all");

    if (email && !all) {
      const user = await db.collection("users").findOne({ email });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // --- dynamic stats calculation (User) ---
      const roadmapsCount = await db
        .collection("roadmaps")
        .countDocuments({ userEmail: email });
      const interviewsCount = await db
        .collection("interviews")
        .countDocuments({ userEmail: email });

      const focusSessions = await db
        .collection("focus_sessions")
        .aggregate([
          { $match: { userEmail: email } },
          { $group: { _id: null, totalMinutes: { $sum: "$duration" } } },
        ])
        .toArray();

      const totalFocusTime =
        focusSessions.length > 0
          ? Math.round(focusSessions[0].totalMinutes / 60)
          : 0;

      let responseData: any = {
        ...user,
        stats: {
          roadmapsCount: roadmapsCount || 0,
          interviewsCount: interviewsCount || 0,
          focusTime: totalFocusTime || 0,
          skillsMastered: user.skills?.length || 0,
        },
      };

      // --- dynamic stats calculation (Admin) ---
      if (user.role === "admin") {
        // total users count
        const totalUsers = await db.collection("users").countDocuments();

        // growth calculation (based on new active users in the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const totalActiveUsers = await db
          .collection("users")
          .countDocuments({ isSuspended: false }); // active users count
        const newActiveUsersLastMonth = await db
          .collection("users")
          .countDocuments({
            createdAt: { $gte: thirtyDaysAgo },
            isSuspended: false, // new active users in the last 30 days
          });

        let growthPercentage =
          totalActiveUsers > 0
            ? ((newActiveUsersLastMonth / totalActiveUsers) * 100).toFixed(1)
            : 0;

        // system load (Database Latency)
        const start = Date.now();
        await db.command({ ping: 1 });
        const latency = Date.now() - start;

        // security status (suspended users )
        const suspendedCount = await db
          .collection("users")
          .countDocuments({ isSuspended: true });

        responseData.totalUsers = totalUsers;
        responseData.adminStats = {
          growth: `+${growthPercentage}%`,
          systemLoad: `${latency}ms`,
          security: suspendedCount > 10 ? "At Risk" : "Secure",
        };
      }

      return NextResponse.json(responseData);
    }

    const users = await db.collection("users").find({}).toArray();
    return NextResponse.json(users);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
// --- POST Method: New user registration ---
export async function POST(req: NextRequest) {
  try {
    const db = await connectDB();
    const body = await req.json();

    if (!body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existingUser = await db
      .collection("users")
      .findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 200 },
      );
    }

    const newUser = {
      name: body.name,
      userId: body.userId || body.uid,
      username: body.username || body.email.split("@")[0],
      email: body.email,
      photo: body.photo || "",
      role: "user",
      isSuspended: false,
      createdAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    // Log registration
    await createLog(
      db,
      "USER_REGISTERED",
      body.email,
      "New account created via registration.",
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}

// --- PUT Method: Sync/Update User (Google Login & Profile Update) ---
export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const verification = await verifyToken(token);
    if (!verification.isValid) {
      return NextResponse.json({ error: "Auth failed" }, { status: 401 });
    }

    const db = await connectDB();
    const body = await req.json();

    //suspension logic (only for admins)
    if (body.targetEmail && typeof body.isSuspended === "boolean") {
      //admin verification
      const requester = await db
        .collection("users")
        .findOne({ email: verification.user?.email });

      if (requester?.role !== "admin") {
        return NextResponse.json(
          { error: "Forbidden: Admins only" },
          { status: 403 },
        );
      }

      const result = await db
        .collection("users")
        .updateOne(
          { email: body.targetEmail },
          { $set: { isSuspended: body.isSuspended } },
        );

      // --- GENERATE LOG FOR SUSPENSION ---
      const logAction = body.isSuspended ? "USER_SUSPENDED" : "USER_ACTIVATED";
      const logDetails = `${body.isSuspended ? "Suspended" : "Re-activated"} user: ${body.targetEmail}`;
      await createLog(
        db,
        logAction,
        verification.user?.email || "Admin",
        logDetails,
      );

      return NextResponse.json({
        success: true,
        message: body.isSuspended ? "User suspended" : "User activated",
        result,
      });
    }

    // user profile update (name, photo, cover, username)
    const userEmail = verification.user?.email || body.email;
    if (!userEmail) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    const filter = { email: userEmail };
    const updateDoc: any = {
      $set: {
        ...(body.name && { name: body.name }),
        ...(body.photo && { photo: body.photo }),
        ...(body.cover && { cover: body.cover }),
        ...(body.username && { username: body.username }),
      },
    };

    const options = { upsert: true };
    const finalUpdate = {
      ...updateDoc,
      $setOnInsert: {
        email: userEmail,
        role: "user",
        isSuspended: false,
        createdAt: new Date(),
      },
    };

    const result = await db
      .collection("users")
      .updateOne(filter, finalUpdate, options);

    return NextResponse.json({
      success: true,
      message: "User profile synced",
      result,
    });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
