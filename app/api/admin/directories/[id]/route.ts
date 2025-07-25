import { NextRequest, NextResponse } from "next/server";
import Directory from "@/models/Directory";
import { User } from "@/models/User";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/database/connectToDatabase"; // Adjust path as needed

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check authentication and admin role
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Get user and verify admin role
    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Validate required fields
    const {
      name,
      description,
      url,
      bgColor,
      domainRating,
      viewsPerMonth,
      tags,
      submitDifficulty,
      seoTitle,
      seoDescription,
      h1,
      about,
    } = body;

    if (
      !name ||
      !description ||
      !url ||
      !bgColor ||
      domainRating === undefined ||
      viewsPerMonth === undefined ||
      !tags ||
      !submitDifficulty
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate URL format
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(url)) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    // Validate hex color format
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    if (!hexColorRegex.test(bgColor)) {
      return NextResponse.json(
        { error: "Invalid hex color format" },
        { status: 400 },
      );
    }

    // Validate domain rating range
    if (domainRating < 0 || domainRating > 100) {
      return NextResponse.json(
        { error: "Domain rating must be between 0 and 100" },
        { status: 400 },
      );
    }

    // Validate views per month
    if (viewsPerMonth < 0) {
      return NextResponse.json(
        { error: "Views per month must be non-negative" },
        { status: 400 },
      );
    }

    // Update the directory
    const updatedDirectory = await Directory.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description: description.trim(),
        url: url.trim(),
        bgColor,
        domainRating,
        viewsPerMonth,
        tags,
        submitDifficulty,
        seoTitle: seoTitle?.trim() || "",
        seoDescription: seoDescription?.trim() || "",
        h1: h1?.trim() || "",
        about: about?.trim() || "",
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedDirectory) {
      return NextResponse.json(
        { error: "Directory not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedDirectory);
  } catch (error: any) {
    console.error("Error updating directory:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectToDatabase();

    // Get user and verify admin role
    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    const { id } = await params;

    // Delete the directory
    const deletedDirectory = await Directory.findByIdAndDelete(id);

    if (!deletedDirectory) {
      return NextResponse.json(
        { error: "Directory not found" },
        { status: 404 },
      );
    }

    // Also remove this directory from all users' launch lists and launched directories
    await User.updateMany(
      {},
      {
        $pull: {
          launchList: id,
          launchedDirectories: id,
        },
      },
    );

    return NextResponse.json({
      message: "Directory deleted successfully",
      deletedDirectory,
    });
  } catch (error) {
    console.error("Error deleting directory:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
