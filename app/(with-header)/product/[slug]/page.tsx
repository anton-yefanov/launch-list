import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { ExternalLink, User, Tag, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IStartup } from "@/models/Startup";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BackButton from "@/app/(with-header)/product/[slug]/_components/back-button";
import UpvoteButton from "@/app/(with-header)/product/[slug]/_components/upvote-button";
import ScreenshotGallery, {
  Screenshot,
} from "@/app/(with-header)/product/[slug]/_components/screenshot-gallery";
import { ScrollToTop } from "@/components/scroll-to-top";
import CommentsSection from "@/app/(with-header)/product/[slug]/_components/comments-section";

interface StartupPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface StartupWithUpvoterIds extends IStartup {
  upvoterIds: string[];
  isInLaunchWeek: boolean;
  launchWeekInfo?: {
    startDate: string;
    endDate: string;
    _id: string;
  } | null;
}

async function getStartup(slug: string): Promise<StartupWithUpvoterIds | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/product/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    return null;
  } catch (error) {
    console.error("Error fetching startup:", error);
    return null;
  }
}

export default async function ProductPage({ params }: StartupPageProps) {
  const { slug } = await params;
  const startup = await getStartup(slug);

  if (!startup) {
    notFound();
  }

  const currentUpvotes = startup.upvoterIds?.length || 0;
  const isInLaunchWeek = startup.isInLaunchWeek ?? false;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: startup.name,
            description: startup.description || startup.tagline,
            url: startup.websiteUrl,
            image: startup.logo?.url,
            applicationCategory: startup.categories?.join(", "),
            operatingSystem: "Web",
            author: {
              "@type": "Person",
              name: startup.submittedBy,
              url: startup.twitterUsername
                ? `https://x.com/${startup.twitterUsername}`
                : undefined,
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "5",
              ratingCount: currentUpvotes,
              bestRating: "5",
              worstRating: "1",
            },
          }),
        }}
      />

      <div>
        <ScrollToTop />
        <div className="mb-4">
          <BackButton />
        </div>

        <div className="bg-white rounded-lg pb-4">
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            <div className="shrink-0">
              <Image
                src={startup.logo.url}
                alt={`${startup.name} logo`}
                width={80}
                height={80}
                className="rounded-lg"
                draggable={false}
                priority
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {startup.name}
                    </h1>
                  </div>

                  <div className="mb-3">
                    <p className="text-lg text-gray-600">{startup.tagline}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {startup.twitterUsername ? (
                        <Link
                          href={`https://x.com/${startup.twitterUsername}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          by {startup.submittedBy}
                        </Link>
                      ) : (
                        <span>by {startup.submittedBy}</span>
                      )}
                    </div>
                    {startup.categories && startup.categories.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        <span>{startup.categories.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <UpvoteButton
                    startup={startup}
                    isInLaunchWeek={isInLaunchWeek}
                  />

                  <Link
                    href={startup.websiteUrl as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    Visit Website
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {!isInLaunchWeek && (
            <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm">
                <strong>Launch week has ended.</strong> This startup is no
                longer accepting upvotes. The final upvote count is displayed
                above.
              </p>
            </div>
          )}

          {startup.screenshots && startup.screenshots.length > 0 && (
            <ScreenshotGallery
              screenshots={startup.screenshots as Screenshot[]}
              startupName={startup.name}
            />
          )}

          {startup.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Description
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {startup.description}
                </p>
              </div>
            </div>
          )}
        </div>
        <CommentsSection startupId={startup._id} />
      </div>
    </>
  );
}

export async function generateMetadata({
  params,
}: StartupPageProps): Promise<Metadata> {
  const { slug } = await params;
  const startup = await getStartup(slug);

  if (!startup) {
    return {
      title: "Startup Not Found ‒ Launch List",
      description: "The startup you are looking for could not be found.",
    };
  }

  const title = `${startup.name} ‒ Launch List`;
  const description = startup.description;
  const imageUrl = startup.logo?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_URL}/product/${slug}`,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: `${startup.name} logo`,
            },
          ]
        : [],
      siteName: "Launch List",
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_URL}/product/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
