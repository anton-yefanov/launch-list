import { NextRequest, NextResponse } from "next/server";
import Directory from "@/models/Directory";
import { connectToDatabase } from "@/lib/database/connectToDatabase";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const skip = (page - 1) * limit;

    const [directories, total] = await Promise.all([
      Directory.find({}).skip(skip).limit(limit).lean(),
      Directory.countDocuments({}),
    ]);

    return NextResponse.json({
      directories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching directories:", error);
    return NextResponse.json(
      { error: "Failed to fetch directories" },
      { status: 500 },
    );
  }
}
