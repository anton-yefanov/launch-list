import { NextRequest, NextResponse } from "next/server";
import { Comment } from "@/models/Comment";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/database/connectToDatabase";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const startupId = searchParams.get("startupId");

    if (!startupId) {
      return NextResponse.json(
        { error: "Startup ID is required" },
        { status: 400 },
      );
    }

    const comments = await Comment.find({ startup: startupId })
      .populate("author", "name image")
      .populate("parentComment")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const { content, startupId, parentCommentId } = await request.json();

    if (!content || !startupId) {
      return NextResponse.json(
        { error: "Content and startup ID are required" },
        { status: 400 },
      );
    }

    if (content.length > 10000) {
      return NextResponse.json(
        { error: "Comment is too long" },
        { status: 400 },
      );
    }

    const comment = new Comment({
      content,
      startup: startupId,
      author: session.user.id,
      parentComment: parentCommentId || null,
    });

    await comment.save();
    await comment.populate("author", "name image");

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
