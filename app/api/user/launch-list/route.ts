import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";
import Directory from "@/models/Directory";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/database/connectToDatabase";

export async function GET() {
  try {
    const session = await auth();
    console.log("Session:", JSON.stringify(session, null, 2));

    if (!session?.user?.email) {
      console.log("No session or email found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Looking for user with email:", session.user.email);

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email }).populate({
      path: "launchList",
      model: Directory,
    });

    console.log("User found:", user ? "Yes" : "No");
    console.log("User ID:", user?._id);

    if (!user) {
      // Let's also check if any users exist at all
      const userCount = await User.countDocuments();
      console.log("Total users in database:", userCount);

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

    const { directoryIds } = await request.json();

    if (
      !directoryIds ||
      !Array.isArray(directoryIds) ||
      !directoryIds.length ||
      directoryIds.some((id) => !id)
    ) {
      return NextResponse.json(
        { error: "Array of directory IDs is required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Verify all directories exist
    const existingDirectories = await Directory.find({
      _id: { $in: directoryIds },
    }).select("_id");

    const existingIds = existingDirectories.map((d) => d._id.toString());
    const nonExistentIds = directoryIds.filter(
      (id) => !existingIds.includes(id),
    );

    if (nonExistentIds.length > 0) {
      return NextResponse.json(
        {
          error: "Some directories not found",
          nonExistentIds,
        },
        { status: 404 },
      );
    }

    // Get user's current launch list to filter out duplicates
    const currentUser = await User.findOne({
      email: session.user.email,
    }).select("launchList");
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentLaunchList =
      currentUser.launchList?.map((id: string) => id.toString()) || [];
    const newDirectoryIds = directoryIds.filter(
      (id) => !currentLaunchList.includes(id),
    );

    if (newDirectoryIds.length === 0) {
      return NextResponse.json({
        message: "All directories already in launch list",
        addedCount: 0,
        skippedCount: directoryIds.length,
      });
    }

    // Bulk add directories to user's launch list
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $addToSet: {
          launchList: { $each: newDirectoryIds },
        },
      },
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: `${newDirectoryIds.length} directories added to launch list`,
      addedCount: newDirectoryIds.length,
      skippedCount: directoryIds.length - newDirectoryIds.length,
      addedDirectoryIds: newDirectoryIds,
    });
  } catch (error) {
    console.error("Error adding to launch list:", error);
    return NextResponse.json(
      { error: "Failed to add directory(ies) to launch list" },
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

    const { directoryIds } = await request.json();

    if (
      !directoryIds ||
      !Array.isArray(directoryIds) ||
      !directoryIds.length ||
      directoryIds.some((id) => !id)
    ) {
      return NextResponse.json(
        { error: "Array of directory IDs is required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $pull: {
          launchList: { $in: directoryIds },
          launchedDirectories: { $in: directoryIds }, // Also remove from launched if they were there
        },
      },
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: `${directoryIds.length} directories removed from launch list`,
      removedCount: directoryIds.length,
      removedDirectoryIds: directoryIds,
    });
  } catch (error) {
    console.error("Error removing from launch list:", error);
    return NextResponse.json(
      { error: "Failed to remove directory(ies) from launch list" },
      { status: 500 },
    );
  }
}
