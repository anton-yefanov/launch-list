import { NextRequest, NextResponse } from "next/server";
import BlogPost from "@/models/BlogPost";
import { fetchTelegraphPost, createSlug } from "@/lib/telegraph";
import { connectToDatabase } from "@/lib/database/connectToDatabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDatabase();

    const post = await BlogPost.findById(params.id).lean();

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { telegraphUrl } = await request.json();

    if (!telegraphUrl) {
      return NextResponse.json(
        { error: "Telegraph URL is required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Check if post exists
    const existingPost = await BlogPost.findById(params.id);
    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 },
      );
    }

    // Fetch new content from Telegraph
    const telegraphPost = await fetchTelegraphPost(telegraphUrl);

    // Create new slug from title
    const newSlug = createSlug(telegraphPost.title);

    // Check if the new slug conflicts with another post (excluding current post)
    const slugConflict = await BlogPost.findOne({
      slug: newSlug,
      _id: { $ne: params.id },
    });

    if (slugConflict) {
      return NextResponse.json(
        { error: "A post with this title already exists" },
        { status: 409 },
      );
    }

    // Update the post
    const updatedPost = await BlogPost.findByIdAndUpdate(
      params.id,
      {
        title: telegraphPost.title,
        slug: newSlug,
        content: telegraphPost.content,
        telegraphUrl,
      },
      { new: true },
    );

    return NextResponse.json({
      success: true,
      post: {
        id: updatedPost._id,
        title: updatedPost.title,
        slug: updatedPost.slug,
        updatedAt: updatedPost.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDatabase();

    const deletedPost = await BlogPost.findByIdAndDelete(params.id);

    if (!deletedPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 },
    );
  }
}
