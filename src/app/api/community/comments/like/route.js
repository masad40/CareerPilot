import { NextResponse } from "next/server"
import connectDB from "@/utils/mongodb"
import { ObjectId } from "mongodb"

export async function POST(req) {
  try {
    const db = await connectDB()
    const { commentId, userId } = await req.json()
    const comment = await db.collection("comments").findOne({ _id: new ObjectId(commentId) })
    
    const likes = comment.likes || []
    const isLiked = likes.includes(userId)

    if (isLiked) {
      await db.collection("comments").updateOne(
        { _id: new ObjectId(commentId) },
        { $pull: { likes: userId } }
      )
    } else {
      await db.collection("comments").updateOne(
        { _id: new ObjectId(commentId) },
        { $addToSet: { likes: userId } }
      )
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}