import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/connectToDatabase";
import { auth } from "@/auth";
import SubmittedDirectory, {
  SubmissionStatus,
} from "@/models/SubmittedDirectory";
import { User } from "@/models/User";

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
    // Find the submitted directory
    const submittedDirectory = await SubmittedDirectory.findById(id);
    if (!submittedDirectory) {
      return NextResponse.json(
        { success: false, error: "Submitted directory not found" },
        { status: 404 },
      );
    }

    // Update the submitted directory status
    submittedDirectory.status = SubmissionStatus.Rejected;

    await submittedDirectory.save();

    return NextResponse.json(
      {
        success: true,
        message: "Submission rejected successfully",
        submittedDirectory,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error rejecting submission:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to reject submission",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
