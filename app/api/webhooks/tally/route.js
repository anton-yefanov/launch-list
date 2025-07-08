import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { Startup } from "@/models/Startup";
import { connectToDatabase } from "@/lib/database/connectToDatabase";
import { reviewStartup } from "../../../../lib/ai/startupApproval";

export async function POST(request) {
  try {
    await connectToDatabase();

    const data = await request.json();
    console.log("Received Tally webhook data:", JSON.stringify(data, null, 2));

    const { eventId, eventType, createdAt, data: formData } = data;

    // Only process form responses
    if (eventType !== "FORM_RESPONSE") {
      return NextResponse.json(
        { success: true, message: "Event type not processed" },
        { status: 200 },
      );
    }

    // Check if we've already processed this submission
    const existingStartup = await Startup.findOne({ tallyEventId: eventId });
    if (existingStartup) {
      console.log("Submission already processed:", eventId);
      return NextResponse.json(
        { success: true, message: "Submission already processed" },
        { status: 200 },
      );
    }

    // Process the form fields
    const processedData = {};
    if (formData && formData.fields) {
      formData.fields.forEach((field) => {
        processedData[field.label] = field.value;
      });
    }

    console.log("Processed form data:", processedData);

    // Helper function to map category IDs to category names
    const getCategoryNames = (categoryIds, options) => {
      if (!categoryIds || !Array.isArray(categoryIds)) return [];

      return categoryIds
        .map((id) => {
          const option = options.find((opt) => opt.id === id);
          return option ? option.text : null;
        })
        .filter(Boolean);
    };

    // Find the categories field to get the options mapping
    const categoriesField = formData.fields.find(
      (field) => field.label === "Select categories that best fit your product",
    );
    const categoryNames = getCategoryNames(
      processedData["Select categories that best fit your product"],
      categoriesField?.options || [],
    );

    // Extract startup data from the form
    const startupData = {
      name: processedData["Name"],
      websiteUrl: processedData["Website URL"],
      tagline: processedData["Tagline"],
      description: processedData["Description"],
      categories: categoryNames,
      submittedBy: processedData["Submitted by"],
      submitterEmail: processedData["email"],
      twitterUsername: processedData["𝕏 username (optional)"],
      submissionRating:
        processedData["How would you rate submission experience?"],

      // Handle logo (single file)
      logo: processedData["Logo"]?.[0]
        ? {
            id: processedData["Logo"][0].id,
            name: processedData["Logo"][0].name,
            url: processedData["Logo"][0].url,
            mimeType: processedData["Logo"][0].mimeType,
            size: processedData["Logo"][0].size,
          }
        : null,

      // Handle screenshots (multiple files)
      screenshots:
        processedData["Screenshots"]?.map((screenshot) => ({
          id: screenshot.id,
          name: screenshot.name,
          url: screenshot.url,
          mimeType: screenshot.mimeType,
          size: screenshot.size,
        })) || [],

      tallyEventId: eventId,
      submittedAt: new Date(createdAt),
    };

    // Validate required fields
    if (
      !startupData.name ||
      !startupData.websiteUrl ||
      !startupData.tagline ||
      !startupData.description ||
      !startupData.submittedBy ||
      !startupData.submitterEmail
    ) {
      throw new Error("Missing required startup fields");
    }

    let user = await User.findOne({ email: startupData.submitterEmail });

    if (!user) {
      throw new Error(
        "User not found. User must be registered before submitting a startup.",
      );
    }

    if (startupData.twitterUsername && !user.twitterUsername) {
      user.twitterUsername = startupData.twitterUsername;
    }

    // Add user ID to startup data
    startupData.userId = user._id;

    // AI REVIEW: Automatically review the startup
    console.log("Starting AI review for startup:", startupData.name);
    const aiReview = await reviewStartup(startupData);
    console.log("AI review result:", aiReview);

    // Update startup data based on AI review
    if (aiReview.approved) {
      startupData.status = "approved";
      startupData.approvedAt = new Date();
    } else {
      startupData.status = "rejected";
      startupData.rejectedAt = new Date();
      startupData.rejectionReason = aiReview.reason;
      startupData.rejectionCategory = aiReview.category;
    }

    startupData.reviewedAt = new Date(); // Set review timestamp

    // Create startup
    const startup = new Startup(startupData);
    await startup.save();

    // Add startup to user's startups array
    user.startups.push(startup._id);
    await user.save();

    console.log("Successfully created startup:", startup._id);
    console.log("Updated user:", user._id);
    console.log(
      "AI Review - Approved:",
      aiReview.approved,
      "Reason:",
      aiReview.reason,
    );

    // Optional: Send notification email based on approval status
    // if (aiReview.approved) {
    //   await sendApprovalEmail(startupData);
    // } else {
    //   await sendRejectionEmail(startupData, aiReview.reason);
    // }

    return NextResponse.json(
      {
        success: true,
        message: "Startup submission processed successfully",
        eventId,
        startupId: startup._id,
        userId: user._id,
        aiReview: {
          approved: aiReview.approved,
          reason: aiReview.reason,
          category: aiReview.category,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing Tally webhook:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process webhook",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
