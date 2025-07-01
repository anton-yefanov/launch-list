import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { Startup } from "@/models/Startup";
import { connectToDatabase } from "@/lib/database/connectToDatabase";

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

    // Extract startup data from the form
    const startupData = {
      name: processedData["Startup name"],
      websiteUrl: processedData["Website URL"],
      tagline: processedData["Tagline"],
      submittedBy: processedData["Submitted by"],
      submitterEmail: processedData["Email"],
      twitterUsername: processedData["𝕏 username (optional)"],
      submissionRating:
        processedData["How would you rate submission experience?"],

      // Handle logo (single file)
      logo: processedData["Website logo"]?.[0]
        ? {
            id: processedData["Website logo"][0].id,
            name: processedData["Website logo"][0].name,
            url: processedData["Website logo"][0].url,
            mimeType: processedData["Website logo"][0].mimeType,
            size: processedData["Website logo"][0].size,
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

      // Tally metadata
      tallyEventId: eventId,
      tallyResponseId: formData.responseId,
      tallySubmissionId: formData.submissionId,
      tallyRespondentId: formData.respondentId,

      submittedAt: new Date(createdAt),
    };

    // Validate required fields
    if (
      !startupData.name ||
      !startupData.websiteUrl ||
      !startupData.tagline ||
      !startupData.submittedBy ||
      !startupData.submitterEmail
    ) {
      throw new Error("Missing required startup fields");
    }

    let user = await User.findOne({ email: startupData.submitterEmail });

    if (!user) {
      // Create new user
      user = new User({
        name: startupData.submittedBy,
        email: startupData.submitterEmail,
        twitterUsername: startupData.twitterUsername,
        startups: [],
      });
    } else {
      // Update user's twitter username if provided and not already set
      if (startupData.twitterUsername && !user.twitterUsername) {
        user.twitterUsername = startupData.twitterUsername;
      }
    }

    // Add user ID to startup data
    startupData.userId = user._id;

    // Create startup
    const startup = new Startup(startupData);
    await startup.save();

    // Add startup to user's startups array
    user.startups.push(startup._id);
    await user.save();

    console.log("Successfully created startup:", startup._id);
    console.log("Updated user:", user._id);

    // Optional: Send notification email here
    // await sendNotificationEmail(startupData);

    return NextResponse.json(
      {
        success: true,
        message: "Startup submission processed successfully",
        eventId,
        startupId: startup._id,
        userId: user._id,
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
