import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { Startup } from "@/models/Startup";
import { connectToDatabase } from "@/lib/database/connectToDatabase";
import { auth } from "@/auth";
import { generateSlug } from "@/utils/generateSlug";
import { reviewStartup } from "@/lib/ai/startupApproval";

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    // Remove www prefix and trailing slash, lowercase the hostname
    let hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
    let pathname = parsed.pathname.replace(/\/+$/, "") || "";
    return `${hostname}${pathname}`;
  } catch {
    // If URL parsing fails, just lowercase and trim
    return url.toLowerCase().trim();
  }
}

async function ensureUniqueSlug(baseSlug, excludeId) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingStartup = await Startup.findOne({
      slug,
      ...(excludeId && { _id: { $ne: excludeId } }),
    });

    if (!existingStartup) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

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

    const existingStartup = await Startup.findOne({ tallyEventId: eventId });
    if (existingStartup) {
      console.log("Submission already processed:", eventId);
      return NextResponse.json(
        { success: true, message: "Submission already processed" },
        { status: 200 },
      );
    }

    const processedData = {};
    if (fields) {
      fields.forEach((field) => {
        processedData[field.title] = field.answer.value;
      });
    }

    console.log("Processed form data:", processedData);

    const categoriesField = fields.find(
      (field) => field.title === "Select categories that best fit your product",
    );

    const categoryNames = categoriesField?.answer?.value.split(", ");

    const startupData = {
      name: processedData["Name"],
      websiteUrl: processedData["Website URL"],
      tagline: processedData["Tagline"],
      description: processedData["Description"],
      categories: categoryNames,
      submittedBy: processedData["Submitted by"],
      submitterEmail: session.user.email,
      twitterUsername: processedData["𝕏 username (optional)"],
      submissionRating:
        processedData["How would you rate submission experience?"],

      logo: processedData["Logo"]?.[0],

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

    // Check for duplicate URL
    const normalizedUrl = normalizeUrl(startupData.websiteUrl);
    const allStartups = await Startup.find({}, { websiteUrl: 1 });
    const duplicateStartup = allStartups.find(
      (s) => normalizeUrl(s.websiteUrl) === normalizedUrl,
    );

    if (duplicateStartup) {
      return NextResponse.json(
        {
          success: false,
          error: "A product with this URL already exists",
          code: "DUPLICATE_URL",
        },
        { status: 400 },
      );
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

    startupData.userId = user._id;

    const baseSlug = generateSlug(startupData.name);
    const uniqueSlug = await ensureUniqueSlug(baseSlug);
    startupData.slug = uniqueSlug;

    console.log(`Generated slug for "${startupData.name}": ${uniqueSlug}`);

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

    return NextResponse.json(
      {
        success: true,
        message: "Startup submission processed successfully",
        eventId,
        startupId: startup._id,
        userId: user._id,
        slug: uniqueSlug,
        aiReview: {
          approved: aiReview.approved,
          reason: aiReview.reason,
          category: aiReview.category,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing form submission:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process submission",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
