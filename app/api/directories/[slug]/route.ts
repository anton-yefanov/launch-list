import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";
import { User } from "@/models/User";
import Directory from "@/models/Directory";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const session = await auth();

    const directory = await Directory.findOne({ slug });

    if (!directory) {
      return NextResponse.json(
        { error: "Directory not found" },
        { status: 404 },
      );
    }

    let isInLaunchList = false;

    // Check if user is logged in and if directory is in their launch list
    if (session?.user) {
      isInLaunchList = await checkIfDirectoryInUserLaunchList(
        session.user.id as string,
        directory._id.toString(),
      );
    }

    return NextResponse.json({
      directory,
      isInLaunchList,
    });
  } catch (error) {
    console.error("Error fetching directory:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function checkIfDirectoryInUserLaunchList(
  userId: string,
  directoryId: string,
) {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(directoryId)
  ) {
    throw new Error("Invalid User ID or Directory ID format.");
  }
  try {
    const user = await User.findById(userId);

    if (!user) {
      // If the user doesn't exist, the directory cannot be in their launch list
      return false;
    }

    // Check if the directoryId exists in the user's launchList array
    // Convert directoryId to ObjectId for proper comparison if launchList stores ObjectIds
    return user.launchList.some((itemObjectId: mongoose.Types.ObjectId) =>
      itemObjectId.equals(new mongoose.Types.ObjectId(directoryId)),
    );
  } catch (error) {
    console.error(
      `Error checking launch list for user ${userId} and directory ${directoryId}:`,
      error,
    );
    throw new Error("Could not check launch list due to a database error.");
  }
}
