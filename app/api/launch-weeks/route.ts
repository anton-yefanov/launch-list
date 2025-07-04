import { NextResponse } from "next/server";
import LaunchWeek from "@/models/LaunchWeek";
import { Startup } from "@/models/Startup";
import { connectToDatabase } from "@/lib/database/connectToDatabase";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const launchWeeks = await LaunchWeek.find({}).sort({ startDate: 1 }).lean();

    const transformedLaunchWeeks = launchWeeks.map((week) => {
      const currentStartups = week.startupsLaunchIds?.length || 0;
      const maxSlots = week.maxSlots || 50;
      const availableSlots = maxSlots - currentStartups;
      const weekId = week._id as string;

      return {
        id: weekId.toString(),
        startDate: week.startDate,
        endDate: week.endDate,
        currentStartups,
        maxSlots,
        availableSlots,
        freeAvailable: availableSlots > 0,
        premiumAvailable: true,
      };
    });

    return NextResponse.json({
      success: true,
      data: transformedLaunchWeeks,
    });
  } catch (error) {
    console.error("Error fetching launch weeks:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch launch weeks",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
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

    const { startupId, launchWeekId, launchType } = await request.json();

    // Validate required fields
    if (!startupId || !launchWeekId || !launchType) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: startupId, launchWeekId, or launchType",
        },
        { status: 400 },
      );
    }

    // Validate launchType
    if (launchType !== "free" && launchType !== "premium") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid launch type. Must be 'free' or 'premium'",
        },
        { status: 400 },
      );
    }

    // For now, only allow free launches
    if (launchType === "premium") {
      return NextResponse.json(
        {
          success: false,
          error: "Premium launches are not available yet",
        },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Validate startup exists and is approved
    const startup = await Startup.findById(startupId);
    if (!startup) {
      return NextResponse.json(
        {
          success: false,
          error: "Startup not found",
        },
        { status: 404 },
      );
    }

    if (startup.status !== "approved") {
      return NextResponse.json(
        {
          success: false,
          error: "Startup must be approved before launching",
        },
        { status: 400 },
      );
    }

    // Check if the authenticated user is the owner of the startup
    const userId = new ObjectId(session.user.id);
    if (startup.userId.toString() !== userId.toString()) {
      return NextResponse.json(
        {
          success: false,
          error: "You can only launch your own startups",
        },
        { status: 403 },
      );
    }

    // Validate launch week exists and has available slots
    const launchWeek = await LaunchWeek.findById(launchWeekId);
    if (!launchWeek) {
      return NextResponse.json(
        {
          success: false,
          error: "Launch week not found",
        },
        { status: 404 },
      );
    }

    const currentStartups = launchWeek.startupsLaunchIds?.length || 0;
    const maxSlots = launchWeek.maxSlots || 50;
    const availableSlots = maxSlots - currentStartups;

    if (availableSlots <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No available slots for this launch week",
        },
        { status: 400 },
      );
    }

    const startupObjectId = new ObjectId(startupId);
    const isAlreadyLaunched = launchWeek.startupsLaunchIds?.some(
      (id: ObjectId) => id.toString() === startupObjectId.toString(),
    );

    if (isAlreadyLaunched) {
      return NextResponse.json(
        {
          success: false,
          error: "Startup is already launched for this week",
        },
        { status: 400 },
      );
    }

    // Check if startup is already launched for any other week
    const existingLaunch = await LaunchWeek.findOne({
      startupsLaunchIds: startupObjectId,
    });

    if (existingLaunch) {
      return NextResponse.json(
        {
          success: false,
          error: "Startup is already launched for another week",
        },
        { status: 400 },
      );
    }

    // Add startup to launch week
    await LaunchWeek.findByIdAndUpdate(
      launchWeekId,
      {
        $push: { startupsLaunchIds: startupObjectId },
      },
      { new: true },
    );

    // Auto-upvote: Ensure the submitter has upvoted their own startup
    const updatedStartup = await Startup.findByIdAndUpdate(
      startupId,
      {
        $addToSet: { upvotes: userId }, // $addToSet prevents duplicates
        launchedWeekId: launchWeekId,
        launchedAt: new Date(),
      },
      { new: true },
    );

    return NextResponse.json({
      success: true,
      message: "Startup successfully launched",
      data: {
        startupId,
        launchWeekId,
        launchType,
        upvoteCount: updatedStartup.upvotes.length,
        autoUpvoted: true,
      },
    });
  } catch (error) {
    console.error("Error launching startup:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to launch startup",
      },
      { status: 500 },
    );
  }
}
