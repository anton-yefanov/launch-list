import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/connectToDatabase";
import { Startup } from "@/models/Startup";
import LaunchWeek from "@/models/LaunchWeek";
import mongoose from "mongoose";

interface StartupResponse {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logo: string;
  websiteUrl: string;
  submittedBy: string;
  twitterUsername: string;
  upvotes: number;
  upvoterIds: string[]; // Add this field
  categories: string[];
  submittedAt: Date;
}

export async function GET() {
  try {
    await connectToDatabase();

    const now = new Date();

    const currentLaunchWeek = await LaunchWeek.findOne({
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    const nextLaunchWeek = await LaunchWeek.findOne({
      startDate: { $gt: now },
    }).sort({ startDate: 1 });

    // Find last completed launch week (endDate < now)
    const lastLaunchWeek = await LaunchWeek.findOne({
      endDate: { $lt: now },
    }).sort({ endDate: -1 });

    // Explicitly type the arrays
    let currentWeekStartups: StartupResponse[] = [];
    let lastWeekStartups: StartupResponse[] = [];

    // Get current week startups
    if (currentLaunchWeek) {
      const startups = await Startup.find({
        _id: { $in: currentLaunchWeek.startupsLaunchIds || [] },
        status: "launched",
      });

      currentWeekStartups = startups
        .map((startup) => ({
          id: startup._id.toString(),
          slug: startup.slug,
          name: startup.name,
          tagline: startup.tagline,
          logo: startup.logo.url,
          websiteUrl: startup.websiteUrl,
          submittedBy: startup.submittedBy,
          twitterUsername: startup.twitterUsername,
          upvotes: startup.upvotes?.length || 0,
          upvoterIds:
            startup.upvotes?.map((id: mongoose.Types.ObjectId) =>
              id.toString(),
            ) || [],
          categories: startup.categories,
          submittedAt: startup.submittedAt || startup.createdAt,
        }))
        .sort((a, b) => b.upvotes - a.upvotes);
    }

    // Get last week startups
    if (lastLaunchWeek && lastLaunchWeek.startupsLaunchIds?.length) {
      const startups = await Startup.find({
        _id: { $in: lastLaunchWeek.startupsLaunchIds },
        status: "launched",
      });

      lastWeekStartups = startups
        .map((startup) => ({
          id: startup._id.toString(),
          slug: startup.slug,
          name: startup.name,
          tagline: startup.tagline,
          logo: startup.logo.url,
          websiteUrl: startup.websiteUrl,
          submittedBy: startup.submittedBy,
          twitterUsername: startup.twitterUsername,
          upvotes: startup.upvotes?.length || 0,
          upvoterIds:
            startup.upvotes?.map((id: mongoose.Types.ObjectId) =>
              id.toString(),
            ) || [],
          categories: startup.categories,
          submittedAt: startup.submittedAt || startup.createdAt,
        }))
        .sort((a, b) => b.upvotes - a.upvotes);
    }

    return NextResponse.json({
      success: true,
      data: {
        currentLaunchWeek: currentLaunchWeek
          ? {
              id: currentLaunchWeek._id.toString(),
              startDate: currentLaunchWeek.startDate,
              endDate: currentLaunchWeek.endDate,
              maxSlots: currentLaunchWeek.maxSlots || 50,
              currentStartups: currentWeekStartups.length,
              availableSlots:
                (currentLaunchWeek.maxSlots || 50) - currentWeekStartups.length,
            }
          : null,
        nextLaunchWeek: nextLaunchWeek
          ? {
              id: nextLaunchWeek._id.toString(),
              startDate: nextLaunchWeek.startDate,
              endDate: nextLaunchWeek.endDate,
              maxSlots: nextLaunchWeek.maxSlots || 50,
              currentStartups: nextLaunchWeek.startupsLaunchIds?.length || 0,
              availableSlots:
                (nextLaunchWeek.maxSlots || 50) -
                (nextLaunchWeek.startupsLaunchIds?.length || 0),
            }
          : null,
        lastLaunchWeek: lastLaunchWeek
          ? {
              id: lastLaunchWeek._id.toString(),
              startDate: lastLaunchWeek.startDate,
              endDate: lastLaunchWeek.endDate,
              totalStartups: lastWeekStartups.length,
            }
          : null,
        startups: currentWeekStartups,
        lastWeekStartups: lastWeekStartups,
      },
    });
  } catch (error) {
    console.error("Error fetching launches data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch launches data",
      },
      { status: 500 },
    );
  }
}
