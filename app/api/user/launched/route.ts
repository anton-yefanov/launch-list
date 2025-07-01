import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";
import Directory from "@/models/Directory";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/database/connectToDatabase";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { directoryId, launched } = await request.json();

    if (!directoryId || typeof launched !== "boolean") {
      return NextResponse.json(
        { error: "Directory ID and launched status are required" },
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

    let updateOperation;
    if (launched) {
      // Add to launched directories
      updateOperation = {
        $addToSet: { launchedDirectories: directoryId },
      };
    } else {
      // Remove from launched directories
      updateOperation = {
        $pull: { launchedDirectories: directoryId },
      };
    }

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      updateOperation,
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: launched
        ? "Directory marked as launched"
        : "Directory unmarked as launched",
      directoryId,
      launched,
    });
  } catch (error) {
    console.error("Error updating launched status:", error);
    return NextResponse.json(
      { error: "Failed to update launched status" },
      { status: 500 },
    );
  }
}
