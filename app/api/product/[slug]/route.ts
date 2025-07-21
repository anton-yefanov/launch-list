import { NextRequest, NextResponse } from "next/server";
import { Startup } from "@/models/Startup";
import { connectToDatabase } from "@/lib/database/connectToDatabase";
import mongoose from "mongoose";

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

    const startupData = {
      ...startupObject,
      upvoterIds:
        startup.upvotes?.map((upvote: mongoose.Types.ObjectId) =>
          upvote._id.toString(),
        ) || [],
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
