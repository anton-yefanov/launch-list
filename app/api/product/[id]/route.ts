import { NextRequest, NextResponse } from "next/server";
import { Startup } from "@/models/Startup";
import { connectToDatabase } from "@/lib/database/connectToDatabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const startup = await Startup.findById(id).populate("upvotes", "_id");

    if (!startup) {
      return NextResponse.json(
        { success: false, message: "Startup not found" },
        { status: 404 },
      );
    }

    // Only return launched startups to public (unless you want to show all)
    if (startup.status !== "launched") {
      return NextResponse.json(
        { success: false, message: "Startup not found" },
        { status: 404 },
      );
    }

    // Convert to object and get upvotes count and categories
    const startupObject = startup.toObject();

    const startupData = {
      ...startupObject,
      upvotes: startup.upvoteCount || startup.upvotes?.length || 0, // Use virtual or fallback to array length
      categories: startup.categories || [], // Categories are already in the schema
    };

    return NextResponse.json({
      success: true,
      data: startupData,
    });
  } catch (error) {
    console.error("Error fetching startup:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
