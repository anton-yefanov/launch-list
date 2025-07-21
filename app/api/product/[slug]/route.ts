import { NextRequest, NextResponse } from "next/server";
import { Startup } from "@/models/Startup";
import LaunchWeek from "@/models/LaunchWeek"; // Import the LaunchWeek model
import { connectToDatabase } from "@/lib/database/connectToDatabase";
import mongoose from "mongoose";

// Helper function to check if current date is within launch week period
function isCurrentlyInLaunchWeek(startDate: Date, endDate: Date): boolean {
  const now = new Date();
  return now >= startDate && now <= endDate;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    await connectToDatabase();

    const startup = await Startup.findOne({ slug }).populate("upvotes", "_id");

    if (!startup) {
      return NextResponse.json(
        { success: false, message: "Startup not found" },
        { status: 404 },
      );
    }

    if (startup.status !== "launched") {
      return NextResponse.json(
        { success: false, message: "Startup not found" },
        { status: 404 },
      );
    }

    const startupObject = startup.toObject();

    // Find the launch week that contains this startup
    const launchWeek = await LaunchWeek.findOne({
      startupsLaunchIds: { $in: [startup._id] },
    });

    // Determine if startup is in an active launch week
    const isInLaunchWeek = launchWeek
      ? isCurrentlyInLaunchWeek(launchWeek.startDate, launchWeek.endDate)
      : false; // If startup is not in any launch week, it's not accepting upvotes

    const startupData = {
      ...startupObject,
      upvoterIds:
        startup.upvotes?.map((upvote: mongoose.Types.ObjectId) =>
          upvote._id.toString(),
        ) || [],
      categories: startup.categories || [],
      isInLaunchWeek, // Include launch week status in response
      launchWeekInfo: launchWeek
        ? {
            startDate: launchWeek.startDate,
            endDate: launchWeek.endDate,
            _id: launchWeek._id.toString(),
          }
        : null, // Optional: include launch week details for frontend use
    };

    return NextResponse.json({
      success: true,
      data: startupData,
    });
  } catch (error) {
    console.error("Error fetching startup by slug:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
