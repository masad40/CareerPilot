import { NextResponse } from "next/server"
import connectDB from "@/utils/mongodb"
import { ObjectId } from "mongodb"

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get("postId")
    const db = await connectDB()
    const comments = await db.collection("comments").find({ postId }).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(comments)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const db = await connectDB()
    const { postId, userId, text } = await req.json()
    const result = await db.collection("comments").insertOne({
      postId, userId, text, likes: [], createdAt: new Date()
    })
    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const db = await connectDB()
    const { commentId, text } = await req.json()
    await db.collection("comments").updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { text, updatedAt: new Date() } }
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const commentId = searchParams.get("commentId")
    const db = await connectDB()
    await db.collection("comments").deleteOne({ _id: new ObjectId(commentId) })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}