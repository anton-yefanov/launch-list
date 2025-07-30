import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/connectToDatabase";
import { auth } from "@/auth";
import SubmittedDirectory, {
  SubmissionStatus,
} from "@/models/SubmittedDirectory";
import Directory from "@/models/Directory";
import { User } from "@/models/User";
import { generateSlug } from "@/utils/generateSlug";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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
    const admin = await User.findOne({ email: session.user.email });
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const submissionId = id;
    const reviewData = await request.json();

    const submittedDirectory = await SubmittedDirectory.findById(submissionId);
    if (!submittedDirectory) {
      return NextResponse.json(
        { success: false, error: "Submitted directory not found" },
        { status: 404 },
      );
    }

    if (submittedDirectory.status !== SubmissionStatus.Pending) {
      return NextResponse.json(
        { success: false, error: "Submission has already been reviewed" },
        { status: 400 },
      );
    }

    // Validate required fields for the new directory
    if (!reviewData.name || !reviewData.description || !reviewData.url) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: name, description, url",
        },
        { status: 400 },
      );
    }

    const baseSlug = generateSlug(reviewData.name);
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug uniqueness
    while (true) {
      const existingDirectory = await Directory.findOne({ slug });
      if (!existingDirectory) {
        break;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create the new directory in the main directories collection
    const newDirectory = new Directory({
      name: reviewData.name,
      description: reviewData.description,
      url: reviewData.url,
      bgColor: reviewData.bgColor || "#000000",
      slug: slug,
      domainRating: reviewData.domainRating || 0,
      viewsPerMonth: reviewData.viewsPerMonth || 0,
      tags: reviewData.tags || [],
      submitDifficulty: reviewData.submitDifficulty,
      seoTitle: reviewData.seoTitle || reviewData.name,
      seoDescription: reviewData.seoDescription || reviewData.description,
      h1: reviewData.h1 || reviewData.name,
      about: reviewData.about || reviewData.description,
    });

    await newDirectory.save();

    // Update the submitted directory status
    submittedDirectory.status = SubmissionStatus.Approved;

    // Update any fields that were modified during review
    submittedDirectory.name = reviewData.name;
    submittedDirectory.description = reviewData.description;
    submittedDirectory.url = reviewData.url;
    submittedDirectory.bgColor = reviewData.bgColor;
    submittedDirectory.domainRating = reviewData.domainRating;
    submittedDirectory.viewsPerMonth = reviewData.viewsPerMonth;
    submittedDirectory.tags = reviewData.tags;
    submittedDirectory.submitDifficulty = reviewData.submitDifficulty;
    submittedDirectory.seoTitle = reviewData.seoTitle;
    submittedDirectory.seoDescription = reviewData.seoDescription;
    submittedDirectory.h1 = reviewData.h1;
    submittedDirectory.about = reviewData.about;

    await submittedDirectory.save();

    return NextResponse.json(
      {
        success: true,
        message: "Submission approved and directory created successfully",
        submittedDirectory,
        directory: newDirectory,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error approving submission:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to approve submission",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
