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

    const startup = await Startup.findById(id);

    if (!startup) {
      return NextResponse.json(
        { success: false, message: "Startup not found" },
        { status: 404 },
      );
    }

    // Only return approved startups to public (unless you want to show all)
    if (startup.status !== "approved") {
      return NextResponse.json(
        { success: false, message: "Startup not found" },
        { status: 404 },
      );
    }

    // You might want to add upvotes count here from a separate collection
    // For now, we'll just return the startup data
    const startupData = {
      ...startup.toObject(),
      upvotes: 0, // TODO: Implement upvotes count from separate collection
      categories: [], // TODO: Implement categories from separate collection or startup schema
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
