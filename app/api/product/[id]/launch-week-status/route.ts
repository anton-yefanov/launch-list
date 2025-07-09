import { NextRequest, NextResponse } from "next/server";
import { Startup } from "@/models/Startup";
import LaunchWeek from "@/models/LaunchWeek";
import { connectToDatabase } from "@/lib/database/connectToDatabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    // Find the startup
    const startup = await Startup.findById(id);
    if (!startup) {
      return NextResponse.json(
        { success: false, message: "Startup not found" },
        { status: 404 },
      );
    }

    // Find the launch week that contains this startup
    const launchWeek = await LaunchWeek.findOne({
      startupsLaunchIds: startup._id,
    });

    if (!launchWeek) {
      // If startup is not assigned to any launch week, check if it was recently approved
      // Allow upvotes for 7 days after approval as fallback
      if (startup.approvedAt) {
        const approvedDate = new Date(startup.approvedAt);
        const daysSinceApproval =
          (Date.now() - approvedDate.getTime()) / (1000 * 60 * 60 * 24);
        const isInFallbackPeriod = daysSinceApproval <= 7;

        return NextResponse.json({
          success: true,
          data: {
            isInLaunchWeek: isInFallbackPeriod,
            fallbackMode: true,
            message: isInFallbackPeriod
              ? "Startup is in 7-day approval period"
              : "Startup approval period has ended",
          },
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          isInLaunchWeek: false,
          message: "Startup not assigned to any launch week",
        },
      });
    }

    // Check if current date is within the launch week
    const now = new Date();
    const isInLaunchWeek =
      now >= launchWeek.startDate && now <= launchWeek.endDate;

    // Calculate days remaining or days since ended
    let timeInfo: string;
    if (isInLaunchWeek) {
      const daysRemaining = Math.ceil(
        (launchWeek.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      timeInfo =
        daysRemaining === 1
          ? "Last day of launch week"
          : `${daysRemaining} days remaining in launch week`;
    } else if (now > launchWeek.endDate) {
      const daysSinceEnded = Math.floor(
        (now.getTime() - launchWeek.endDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      timeInfo =
        daysSinceEnded === 0
          ? "Launch week ended today"
          : `Launch week ended ${daysSinceEnded} days ago`;
    } else {
      const daysUntilStart = Math.ceil(
        (launchWeek.startDate.getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      timeInfo =
        daysUntilStart === 1
          ? "Launch week starts tomorrow"
          : `Launch week starts in ${daysUntilStart} days`;
    }

    return NextResponse.json({
      success: true,
      data: {
        isInLaunchWeek,
        launchWeek: {
          startDate: launchWeek.startDate,
          endDate: launchWeek.endDate,
        },
        timeInfo,
        message: isInLaunchWeek
          ? "Startup is in active launch week"
          : "Startup is not in active launch week",
      },
    });
  } catch (error) {
    console.error("Error checking launch week status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 },
    );
  }
}
