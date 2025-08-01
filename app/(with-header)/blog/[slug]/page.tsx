import { notFound } from "next/navigation";
import { Metadata } from "next";
import BlogPost from "@/models/BlogPost";
import { connectToDatabase } from "@/lib/database/connectToDatabase";
import scss from "./styles.module.scss";
import { Dot } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  await connectToDatabase();
  const post = await BlogPost.findOne({ slug });

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.description || `Read ${post.title} on our blog`,
    openGraph: {
      title: post.title,
      description: post.description || `Read ${post.title} on our blog`,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      url: `/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || `Read ${post.title} on our blog`,
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  await connectToDatabase();

  const post = await BlogPost.findOne({ slug });

  if (!post) {
    notFound();
  }

  // JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Launch List",
      name: "Launch List Blog",
    },
    publisher: {
      "@type": "Author",
      name: "Launch List",
    },
    url: `/blog/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-4xl mx-auto">
        <article className="mt-2">
          <header className="mb-4">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              {post.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div>by Launch List</div>
              <Dot size={12} className="text-gray-400" />
              <time dateTime={post.createdAt.toISOString()}>
                {new Date(post.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              {post.readingTime && <span>{post.readingTime} min read</span>}
            </div>
          </header>
          <div
            className={scss.telegraphContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </>
  );
}
