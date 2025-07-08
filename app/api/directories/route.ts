import { NextResponse } from "next/server";
import Directory from "@/models/Directory";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/database/connectToDatabase";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const session = await auth();
    let userLaunchList: string[] = [];

    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email }).select(
        "launchList",
      );

      userLaunchList = user?.launchList || [];
    }

    const directories = await Directory.find({});

    return NextResponse.json({
      directories,
      userLaunchList,
    });
  } catch (error) {
    console.error("Error fetching directories:", error);
    return NextResponse.json(
      { error: "Failed to fetch directories" },
      { status: 500 },
    );
  }
}
