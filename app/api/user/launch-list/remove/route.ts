import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { directoryId } = await request.json();

    if (!directoryId) {
      return NextResponse.json(
        { error: "Directory ID is required" },
        { status: 400 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(directoryId)) {
      return NextResponse.json(
        { error: "Invalid directory ID format" },
        { status: 400 },
      );
    }

    const userId = session.user.id as string;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 },
      );
    }

    // Remove directory from user's launch list
    const result = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          launchList: new mongoose.Types.ObjectId(directoryId),
          launchedDirectories: new mongoose.Types.ObjectId(directoryId), // Also remove from launched if it was there
        },
      },
      { new: true },
    );

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Directory removed from launch list successfully",
      launchList: result.launchList,
      launchedDirectories: result.launchedDirectories,
    });
  } catch (error) {
    console.error("Error removing directory from launch list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
