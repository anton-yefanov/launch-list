import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";
import Directory from "@/models/Directory";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/database/connectToDatabase";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email }).populate({
      path: "launchList",
      model: Directory,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      launchList: user.launchList || [],
      launchedDirectories: user.launchedDirectories || [],
    });
  } catch (error) {
    console.error("Error fetching launch list:", error);
    return NextResponse.json(
      { error: "Failed to fetch launch list" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { directoryId } = await request.json();

    if (!directoryId) {
      return NextResponse.json(
        { error: "Directory ID is required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Check if directory exists
    const directory = await Directory.findById(directoryId);
    if (!directory) {
      return NextResponse.json(
        { error: "Directory not found" },
        { status: 404 },
      );
    }

    // Add directory to user's launch list (if not already added)
    const user = await User.findOneAndUpdate(
      {
        email: session.user.email,
        launchList: { $ne: directoryId }, // Only add if not already in list
      },
      {
        $addToSet: { launchList: directoryId },
      },
      { new: true },
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found or directory already in launch list" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Directory added to launch list",
      directoryId,
    });
  } catch (error) {
    console.error("Error adding to launch list:", error);
    return NextResponse.json(
      { error: "Failed to add directory to launch list" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { directoryId } = await request.json();

    if (!directoryId) {
      return NextResponse.json(
        { error: "Directory ID is required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $pull: {
          launchList: directoryId,
          launchedDirectories: directoryId, // Also remove from launched if it was there
        },
      },
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Directory removed from launch list",
      directoryId,
    });
  } catch (error) {
    console.error("Error removing from launch list:", error);
    return NextResponse.json(
      { error: "Failed to remove directory from launch list" },
      { status: 500 },
    );
  }
}
