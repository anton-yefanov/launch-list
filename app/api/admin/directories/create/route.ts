import { NextRequest, NextResponse } from "next/server";
import Directory, { DirectoryTag, SubmitDifficulty } from "@/models/Directory";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/database/connectToDatabase";

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

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

    // Basic validation
    if (!name || !description || !url) {
      return NextResponse.json(
        { message: "Name, description, and URL are required" },
        { status: 400 },
      );
    }

    // Validate URL format
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(url)) {
      return NextResponse.json(
        {
          message: "Please enter a valid URL starting with http:// or https://",
        },
        { status: 400 },
      );
    }

    // Validate hex color
    const colorRegex = /^#[0-9A-F]{6}$/i;
    if (bgColor && !colorRegex.test(bgColor)) {
      return NextResponse.json(
        { message: "Please enter a valid hex color code" },
        { status: 400 },
      );
    }

    // Validate domain rating
    if (domainRating < 0 || domainRating > 100) {
      return NextResponse.json(
        { message: "Domain rating must be between 0 and 100" },
        { status: 400 },
      );
    }

    // Validate views per month
    if (viewsPerMonth < 0) {
      return NextResponse.json(
        { message: "Views per month must be a positive number" },
        { status: 400 },
      );
    }

    // Validate tags
    if (tags && Array.isArray(tags)) {
      const validTags = Object.values(DirectoryTag);
      const invalidTags = tags.filter(
        (tag: string) => !validTags.includes(tag as DirectoryTag),
      );
      if (invalidTags.length > 0) {
        return NextResponse.json(
          { message: `Invalid tags: ${invalidTags.join(", ")}` },
          { status: 400 },
        );
      }
    }

    // Validate submit difficulty
    if (
      submitDifficulty &&
      !Object.values(SubmitDifficulty).includes(submitDifficulty)
    ) {
      return NextResponse.json(
        { message: "Invalid submit difficulty value" },
        { status: 400 },
      );
    }

    // Validate string lengths
    if (name.length > 100) {
      return NextResponse.json(
        { message: "Name cannot exceed 100 characters" },
        { status: 400 },
      );
    }

    if (description.length > 500) {
      return NextResponse.json(
        { message: "Description cannot exceed 500 characters" },
        { status: 400 },
      );
    }

    if (seoTitle && seoTitle.length > 60) {
      return NextResponse.json(
        { message: "SEO title cannot exceed 60 characters" },
        { status: 400 },
      );
    }

    if (seoDescription && seoDescription.length > 160) {
      return NextResponse.json(
        { message: "SEO description cannot exceed 160 characters" },
        { status: 400 },
      );
    }

    if (h1 && h1.length > 100) {
      return NextResponse.json(
        { message: "H1 cannot exceed 100 characters" },
        { status: 400 },
      );
    }

    if (about && about.length > 1000) {
      return NextResponse.json(
        { message: "About cannot exceed 1000 characters" },
        { status: 400 },
      );
    }

    // Check if URL already exists
    const existingDirectory = await Directory.findOne({ url });
    if (existingDirectory) {
      return NextResponse.json(
        { message: "A directory with this URL already exists" },
        { status: 409 },
      );
    }

    // Create the directory
    const directoryData = {
      slug: "",
      name: name.trim(),
      description: description.trim(),
      url: url.trim(),
      bgColor: bgColor || "#000000",
      domainRating: Number(domainRating) || 0,
      viewsPerMonth: Number(viewsPerMonth) || 0,
      tags: tags || [],
      submitDifficulty: submitDifficulty || SubmitDifficulty.Ok,
      seoTitle: seoTitle?.trim() || "",
      seoDescription: seoDescription?.trim() || "",
      h1: h1?.trim() || "",
      about: about?.trim() || "",
    };

    const newDirectory = new Directory(directoryData);
    await newDirectory.save();

    return NextResponse.json(newDirectory, { status: 201 });
  } catch (error: any) {
    console.error("Error creating directory:", error);

    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { message: "Validation error", errors },
        { status: 400 },
      );
    }

    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { message: `A directory with this ${field} already exists` },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
