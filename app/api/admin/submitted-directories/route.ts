import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/connectToDatabase";
import { auth } from "@/auth";
import SubmittedDirectory from "@/models/SubmittedDirectory";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Check if user is admin
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status");

    // Build query
    const query: any = {};
    if (status && status !== "all") {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch submitted directories with pagination
    const [submittedDirectories, total] = await Promise.all([
      SubmittedDirectory.find(query)
        .populate("submittedBy", "name email")
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SubmittedDirectory.countDocuments(query),
    ]);

    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };

    return NextResponse.json(
      {
        success: true,
        submittedDirectories,
        pagination,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching submitted directories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch submitted directories",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
