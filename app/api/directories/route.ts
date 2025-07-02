import { NextResponse } from "next/server";
import Directory from "@/models/Directory";
import { connectToDatabase } from "@/lib/database/connectToDatabase";

export async function GET() {
  try {
    await connectToDatabase();

    const directories = await Directory.find({}).lean();

    return NextResponse.json({
      directories,
    });
  } catch (error) {
    console.error("Error fetching directories:", error);
    return NextResponse.json(
      { error: "Failed to fetch directories" },
      { status: 500 },
    );
  }
}
