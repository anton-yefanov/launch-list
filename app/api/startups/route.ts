import { NextResponse } from "next/server";
import { Startup } from "@/models/Startup"; // Adjust path as needed
import { connectToDatabase } from "@/lib/database/connectToDatabase";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const startups = await Startup.find({ userId })
      .sort({ createdAt: -1 }) // Most recent first
      .lean(); // Convert to plain objects for better performance

    return NextResponse.json({
      success: true,
      startups,
    });
  } catch (error) {
    console.error("Error fetching startups:", error);
    return NextResponse.json(
      { error: "Failed to fetch startups" },
      { status: 500 },
    );
  }
}
