import { NextRequest, NextResponse } from "next/server";
import { Comment } from "@/models/Comment";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/database/connectToDatabase";
import { Types } from "mongoose";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const { id } = await params;
    const userId = session.user.id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const hasUpvoted = comment.upvoters.includes(userId);

    if (hasUpvoted) {
      // Remove upvote
      comment.upvoters = comment.upvoters.filter(
        (upvoterId: Types.ObjectId) => upvoterId.toString() !== userId,
      );
    } else {
      // Add upvote
      comment.upvoters.push(userId);
    }

    await comment.save();

    return NextResponse.json({
      success: true,
      upvoted: !hasUpvoted,
      upvotes: comment.upvoters.length,
    });
  } catch (error) {
    console.error("Error toggling comment upvote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
