// app/api/product/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Startup } from "@/models/Startup";
import { connectToDatabase } from "@/lib/database/connectToDatabase";

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
      upvotes: startup.upvoteCount || startup.upvotes?.length || 0,
      categories: startup.categories || [],
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
