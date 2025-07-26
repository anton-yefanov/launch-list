import { NextResponse } from "next/server";
import { Startup } from "@/models/Startup";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/database/connectToDatabase";

// todo - remove this endpoint, get upvotes in /api/launches
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 },
      );
    }

    const { slug } = await params;
    const userId = new ObjectId(session.user.id);

    await connectToDatabase();

    const startup = await Startup.findOne({ slug });
    if (!startup) {
      return NextResponse.json(
        {
          success: false,
          error: "Startup not found",
        },
        { status: 404 },
      );
    }

    const hasUpvoted = startup.upvotes.some(
      (upvoteUserId: string) => upvoteUserId.toString() === userId.toString(),
    );

    return NextResponse.json({
      success: true,
      data: {
        hasUpvoted,
        upvoteCount: startup.upvotes.length,
      },
    });
  } catch (error) {
    console.error("Error checking upvote status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check upvote status",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 },
      );
    }

    const { slug } = await params;
    const userId = new ObjectId(session.user.id);

    await connectToDatabase();

    // Find the startup
    const startup = await Startup.findOne({ slug });
    if (!startup) {
      return NextResponse.json(
        {
          success: false,
          error: "Startup not found",
        },
        { status: 404 },
      );
    }

    // Check if startup is launched (only approved startups can receive upvotes)
    if (startup.status !== "launched") {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot upvote non-approved startup",
        },
        { status: 400 },
      );
    }

    // Check if user has already upvoted this startup
    const hasUpvoted = startup.upvotes.some(
      (upvoteUserId: string) => upvoteUserId.toString() === userId.toString(),
    );

    let updatedStartup;
    let action;

    if (hasUpvoted) {
      // Remove upvote (toggle off)
      updatedStartup = await Startup.findByIdAndUpdate(
        startup.id,
        { $pull: { upvotes: userId } },
        { new: true },
      );
      action = "removed";
    } else {
      // Add upvote (toggle on)
      updatedStartup = await Startup.findByIdAndUpdate(
        startup.id,
        { $addToSet: { upvotes: userId } },
        { new: true },
      );
      action = "added";
    }

    return NextResponse.json({
      success: true,
      data: {
        action,
        upvoteCount: updatedStartup.upvotes.length,
        hasUpvoted: !hasUpvoted,
      },
    });
  } catch (error) {
    console.error("Error handling upvote:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process upvote",
      },
      { status: 500 },
    );
  }
}
