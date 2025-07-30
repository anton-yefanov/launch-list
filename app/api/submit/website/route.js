import { NextResponse } from "next/server";
import { User } from "@/models/User";
import SubmittedDirectory from "@/models/SubmittedDirectory";
import { DirectoryTag } from "@/models/Directory";
import { connectToDatabase } from "@/lib/database/connectToDatabase";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    await connectToDatabase();

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const data = await request.json();
    const { id: eventId, createdAt, fields } = data;

    // Check if submission already exists
    const existingSubmission = await SubmittedDirectory.findOne({
      tallyEventId: eventId,
    });
    if (existingSubmission) {
      console.log("Website submission already processed:", eventId);
      return NextResponse.json(
        { success: true, message: "Submission already processed" },
        { status: 200 },
      );
    }

    // Process form fields
    const processedData = {};
    if (fields) {
      fields.forEach((field) => {
        processedData[field.title] = field.answer.value;
      });
    }

    console.log("Processed website form data:", processedData);

    const checkboxField = fields.find((field) => field.type === "CHECKBOXES");

    const tags = [];
    if (checkboxField?.answer?.value) {
      const selectedOptions = checkboxField.answer.value;

      if (selectedOptions.includes("Free launch")) {
        tags.push(DirectoryTag.FreeLaunch);
      }
      if (selectedOptions.includes("Paid features")) {
        tags.push(DirectoryTag.PaidFeatures);
      }
    }

    // Prepare submission data
    const submissionData = {
      name: processedData["Name"],
      description: processedData["Name"] + " directory listing",
      url: processedData["URL"],
      viewsPerMonth: processedData["Monthly views (Check)"],
      domainRating: processedData["Domain Authority Rating (Check)"],
      tags: tags.length > 0 ? tags : undefined,
      submitterEmail: session.user.email,
      tallyEventId: eventId,
      submittedAt: new Date(createdAt),
    };

    // Validate required fields
    if (!submissionData.name || !submissionData.url) {
      throw new Error("Missing required fields: name and URL are required");
    }

    // Find or validate user
    let user = await User.findOne({ email: submissionData.submitterEmail });
    if (!user) {
      throw new Error(
        "User not found. User must be registered before submitting a website.",
      );
    }

    submissionData.submittedBy = user._id;

    // Create submitted directory
    const submittedDirectory = new SubmittedDirectory(submissionData);
    await submittedDirectory.save();

    // Add to user's submittedDirectories array
    if (!user.submittedDirectories) {
      user.submittedDirectories = [];
    }
    user.submittedDirectories.push(submittedDirectory._id);
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Website submission processed successfully",
        eventId,
        submittedDirectoryId: submittedDirectory._id,
        userId: user._id,
        status: submittedDirectory.status,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing website submission:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process website submission",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
