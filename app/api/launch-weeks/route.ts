import { NextResponse } from "next/server";
import LaunchWeek from "@/models/LaunchWeek";
import { connectToDatabase } from "@/lib/database/connectToDatabase";

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
