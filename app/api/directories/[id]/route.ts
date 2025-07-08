import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import mongoose from "mongoose";
import { User } from "@/models/User";
import Directory from "@/models/Directory"; // Adjust import path as needed

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    // Replace with your actual database query
    // This is a placeholder - you'll need to implement your actual database logic
    const directory = await fetchDirectoryById(params.id);

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
        params.id,
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

async function fetchDirectoryById(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid Directory ID format.");
  }
  try {
    return await Directory.findById(id);
  } catch (error) {
    console.error(`Error fetching directory by ID ${id}:`, error);
    throw new Error("Could not fetch directory due to a database error.");
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
