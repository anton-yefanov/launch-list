"use client";

import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ChevronUp,
  ExternalLink,
  User,
  Tag,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { useState, useEffect, use } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LoginDialog } from "@/components/login-dialog";
import { IStartup } from "@/models/Startup";

interface StartupPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductPage({ params }: StartupPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [startup, setStartup] = useState<IStartup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upvoted, setUpvoted] = useState<boolean>(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);
  const [currentUpvotes, setCurrentUpvotes] = useState(0);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(
    null,
  );
  const [isInLaunchWeek, setIsInLaunchWeek] = useState<boolean>(false);

  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        // Use slug-based API endpoint
        const response = await fetch(`/api/product/${slug}`);
        const result = await response.json();

        if (result.success && result.data) {
          setStartup(result.data);
          setCurrentUpvotes(result.data.upvotes || 0);
          setSelectedScreenshot(result.data.screenshots?.[0]?.url || null);

          await checkLaunchWeekStatus(result.data.slug);
        } else {
          setError(result.message || "Startup not found");
        }
      } catch (err) {
        console.error("Error fetching startup:", err);
        setError("Failed to load startup details");
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
  }, [slug]);

  const checkLaunchWeekStatus = async (slug: string) => {
    try {
      const response = await fetch(`/api/product/${slug}/launch-week-status`);

      if (!response.ok) {
        console.error(
          "API response not ok:",
          response.status,
          response.statusText,
        );
        setIsInLaunchWeek(true);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("API did not return JSON, got:", contentType);
        setIsInLaunchWeek(true);
        return;
      }

      const result = await response.json();

      if (result.success) {
        setIsInLaunchWeek(result.data.isInLaunchWeek);
      } else {
        console.error("API returned error:", result.message);
        setIsInLaunchWeek(true);
      }
    } catch (error) {
      console.error("Error checking launch week status:", error);
      setIsInLaunchWeek(true);
    }
  };

  useEffect(() => {
    const checkUpvoteStatus = async () => {
      if (!isAuthenticated || !session?.user?.id || !startup) return;

      try {
        // Use ID for upvote status check since that's what the API expects
        const response = await fetch(`/api/product/${startup.slug}/upvote`);
        const result = await response.json();

        if (result.success) {
          setUpvoted(result.data.hasUpvoted);
          setCurrentUpvotes(result.data.upvoteCount);
        }
      } catch (error) {
        console.error("Error checking upvote status:", error);
      }
    };

    checkUpvoteStatus();
  }, [slug, isAuthenticated, session?.user?.id, startup]); // Changed dependency from id to slug

  const handleUpvoteClick = async () => {
    if (!isInLaunchWeek || !startup) {
      return;
    }

    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    if (isUpvoting) return;

    setIsUpvoting(true);

    // Optimistic update
    const newUpvoted = !upvoted;
    const newCount = newUpvoted ? currentUpvotes + 1 : currentUpvotes - 1;

    setUpvoted(newUpvoted);
    setCurrentUpvotes(newCount);

    try {
      // Use ID for upvote API call
      const response = await fetch(`/api/product/${startup.slug}/upvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        setUpvoted(result.data.hasUpvoted);
        setCurrentUpvotes(result.data.upvoteCount);
      } else {
        setUpvoted(!newUpvoted);
        setCurrentUpvotes(currentUpvotes);
        console.error("Error upvoting:", result.error);
      }
    } catch (error) {
      setUpvoted(!newUpvoted);
      setCurrentUpvotes(currentUpvotes);
      console.error("Error upvoting:", error);
    } finally {
      setIsUpvoting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="bg-gray-200 rounded-lg p-8">
            <div className="flex gap-6 mb-6">
              <div className="w-20 h-20 bg-gray-300 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
            <div className="h-64 bg-gray-300 rounded-lg mb-4"></div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Startup not found"}
          </h1>
          <p className="text-gray-600 mb-6">
            The startup you&#39;re looking for doesn&#39;t exist or has been
            removed.
          </p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Launch Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </div>

      <div className="bg-white rounded-lg pb-4">
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <div className="shrink-0">
            <Image
              src={startup.logo.url}
              alt={`${startup.name} logo`}
              width={80}
              height={80}
              className="rounded-lg border"
              draggable={false}
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {startup.name}
                </h1>
                <p className="text-lg text-gray-600 mb-3">{startup.tagline}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {startup.twitterUsername ? (
                      <Link
                        href={`https://x.com/${startup.twitterUsername}`}
                        target="_blank"
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
                {isInLaunchWeek ? (
                  <Button
                    variant="outline"
                    onClick={handleUpvoteClick}
                    disabled={isUpvoting}
                    className={cn(
                      "cursor-pointer flex sm:justify-between gap-2 px-4 py-2 active:scale-95 transition-all duration-120",
                      upvoted
                        ? "border-primary-color text-primary-color hover:text-primary-color"
                        : "",
                      isUpvoting && "opacity-70 cursor-not-allowed",
                    )}
                  >
                    Upvote
                    <div className="flex items-center gap-1">
                      <ChevronUp strokeWidth={2} />
                      <span className="text-sm">{currentUpvotes}</span>
                    </div>
                  </Button>
                ) : (
                  <Button
                    disabled
                    variant="outline"
                    className="flex justify-center sm:justify-between items-center gap-2 px-4 py-2 border border-gray-200 rounded-md bg-gray-50"
                  >
                    <span className="text-gray-600">Upvotes</span>
                    <div className="flex items-center gap-1 text-gray-600">
                      <ChevronUp strokeWidth={2} className="size-4" />
                      <span className="text-sm">{currentUpvotes}</span>
                    </div>
                  </Button>
                )}

                <Link
                  href={startup.websiteUrl}
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
              <strong>Launch week has ended.</strong> This startup is no longer
              accepting upvotes. The final upvote count is displayed above.
            </p>
          </div>
        )}

        {startup.screenshots && startup.screenshots.length > 0 && (
          <div className="mb-8">
            <div className="mb-4">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={
                    selectedScreenshot || (startup.screenshots[0].url as string)
                  }
                  alt={`${startup.name} screenshot`}
                  fill
                  className="object-cover"
                  draggable={false}
                />
              </div>
            </div>
            {startup.screenshots.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {startup.screenshots.map((screenshot, index) => (
                  <div
                    key={screenshot.id}
                    className={cn(
                      "relative aspect-video bg-gray-100 rounded cursor-pointer overflow-hidden border-2 transition-all",
                      selectedScreenshot === screenshot.url
                        ? "border-primary-color"
                        : "border-transparent hover:border-gray-300",
                    )}
                    onClick={() =>
                      setSelectedScreenshot(screenshot.url as string)
                    }
                  >
                    <Image
                      src={screenshot.url as string}
                      alt={`${startup.name} screenshot ${index + 1}`}
                      fill
                      className="object-cover"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
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
      <LoginDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
        title={
          <h1 className="text-2xl font-semibold">
            Login to upvote this startup
          </h1>
        }
      />
    </div>
  );
}
