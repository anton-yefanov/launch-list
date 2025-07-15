import Link from "next/link";
import { connectToDatabase } from "@/lib/database/connectToDatabase";
import BlogPost from "@/models/BlogPost";

export default async function BlogListPage() {
  await connectToDatabase();

  const posts = await BlogPost.find()
    .sort({ createdAt: -1 })
    .select("title slug createdAt");

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 mt-2">Launch List Blog</h1>

      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post._id as string} className="border-b pb-6">
            <h2 className="text-2xl font-semibold mb-2">
              <Link
                href={`/blog/${post.slug}`}
                className="text-sky-600 hover:text-sky-800"
              >
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-600">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
