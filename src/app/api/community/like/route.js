import { NextResponse } from "next/server"
import connectDB from "@/utils/mongodb"
import { ObjectId } from "mongodb"

export async function POST(req) {
  try {
    const { postId, userId } = await req.json() // Front-end theke userId-o pathate hobe

    if (!postId || !userId || !ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 })
    }

    const db = await connectDB()
    
    // 1. Check koro user ki agei like diyeche?
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(postId),
      likedBy: userId // 'likedBy' array-te user-er ID ache kina check
    })

    let updateOperation;

    if (post) {
      // 2. User agei like diyeche, tai ekhon click korle 'Unlike' hobe
      updateOperation = {
        $pull: { likedBy: userId }, // Array theke user ID sorao
        $inc: { likes: -1 }         // Count 1 komao
      }
    } else {
      // 3. User age like dey ni, tai ekhon 'Like' hobe
      updateOperation = {
        $addToSet: { likedBy: userId }, // Array-te user ID dukhao (unique thakbe)
        $inc: { likes: 1 }              // Count 1 barao
      }
    }

    await db.collection("posts").updateOne(
      { _id: new ObjectId(postId) },
      updateOperation
    )

    return NextResponse.json({ 
      message: post ? "Unliked" : "Liked",
      isLiked: !post 
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}