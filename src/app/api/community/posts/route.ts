import connectDB from "@/utils/mongodb"
import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

// 1. All Posts Fetch kora
export async function GET() {
  try {
    const db = await connectDB()
    const posts = await db
      .collection("posts")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

// 2. Notun Post Create kora
export async function POST(req: NextRequest) {
  try {
    const db = await connectDB()
    const { userId, userEmail, content } = await req.json()

    const result = await db.collection("posts").insertOne({
      userId,
      userEmail,
      content,
      likes: 0,
      likedBy: [], // Unique likes handle korar jonno empty array
      createdAt: new Date()
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return NextResponse.json({ error: "Post creation failed" }, { status: 500 })
  }
}

// 3. Post Edit/Update kora (PATCH)
export async function PATCH(req: NextRequest) {
  try {
    const db = await connectDB()
    const { postId, content } = await req.json()

    if (!postId || !ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Invalid Post ID" }, { status: 400 })
    }

    await db.collection("posts").updateOne(
      { _id: new ObjectId(postId) },
      { $set: { content: content, updatedAt: new Date() } }
    )

    return NextResponse.json({ success: true, message: "Post updated" })
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

// 4. Post Delete kora (DELETE)
export async function DELETE(req: NextRequest) {
  try {
    const db = await connectDB()
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get("postId")

    if (!postId || !ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Invalid Post ID" }, { status: 400 })
    }

    await db.collection("posts").deleteOne({
      _id: new ObjectId(postId)
    })

    return NextResponse.json({ success: true, message: "Post deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}