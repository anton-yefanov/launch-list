import { NextRequest, NextResponse } from "next/server";
import BlogPost from "@/models/BlogPost";
import { fetchTelegraphPost, createSlug } from "@/lib/telegraph";
import { connectToDatabase } from "@/lib/database/connectToDatabase";

export async function GET() {
  try {
    await connectToDatabase();
    const posts = await BlogPost.find()
      .sort({ createdAt: -1 })
      .select("_id title slug createdAt telegraphUrl");

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { telegraphUrl } = await request.json();

    if (!telegraphUrl) {
      return NextResponse.json(
        { error: "Telegraph URL is required" },
        { status: 400 },
      );
    }

    // Fetch content from Telegraph
    const telegraphPost = await fetchTelegraphPost(telegraphUrl);

    // Create slug from title
    const slug = createSlug(telegraphPost.title);

    // Connect to database
    await connectToDatabase();

    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this title already exists" },
        { status: 409 },
      );
    }

    // Create new blog post
    const newPost = new BlogPost({
      title: telegraphPost.title,
      slug,
      content: telegraphPost.content,
      telegraphUrl,
    });

    await newPost.save();

    return NextResponse.json({
      success: true,
      post: {
        id: newPost._id,
        title: newPost.title,
        slug: newPost.slug,
        createdAt: newPost.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 },
    );
  }
}
