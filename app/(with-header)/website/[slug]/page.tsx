import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  DollarSign,
  ExternalLink,
  Frown,
  Globe,
  Hexagon,
  Meh,
  PawPrint,
  Smile,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DirectoryTag } from "@/types/DirectoryTag";
import { formatNumber } from "@/lib/formatNumber";
import { SubmitDifficulty } from "@/types/SubmitDifficulty";
import { auth } from "@/auth";
import { Metadata } from "next";
import { BackButton } from "@/app/(with-header)/website/[slug]/_components/back-button";
import { LaunchListButton } from "@/app/(with-header)/website/[slug]/_components/launch-list-button";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getDirectory(slug: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/directories/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching directory:", error);
    return null;
  }
}

export default async function WebsitePage({ params }: PageProps) {
  const session = await auth();
  const { slug } = await params;
  const isLoggedIn = !!session;

  const data = await getDirectory(slug);

  if (!data || !data.directory) {
    notFound();
  }

  const { directory, isInLaunchList } = data;

  return (
    <div>
      <div>
        <BackButton />
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div
            style={{ backgroundColor: directory.bgColor }}
            className="shrink-0 text-black font-extrabold p-3 size-16 border rounded-lg grid place-items-center select-none"
          >
            <div className="relative">
              <div className="bg-white relative rounded-xs text-lg h-8 w-7.5 p-0 grid place-items-center border border-black -rotate-6 z-10">
                {directory.name[0]}
              </div>
              <div className="absolute size-full bg-black -left-0.5 top-0.5 rounded-xs -rotate-12" />
            </div>
          </div>
          <div className="flex-1">
            {/* Use SEO H1 if available, fallback to name */}
            <h1 className="text-2xl font-bold">
              {directory.h1 || directory.name}
            </h1>
            {/* Use new 'about' field if available, fallback to description */}
            <p className="text-base text-muted-foreground">
              {directory.about || directory.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Users className="size-5 text-blue-600" />
            </div>
            <div className="font-bold text-lg">
              {formatNumber(directory.viewsPerMonth)}
            </div>
            <div className="text-xs text-gray-600">Monthly Views</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Hexagon className="size-5 text-green-600" />
            </div>
            <div className="font-bold text-lg">{directory.domainRating}</div>
            <div className="text-xs text-gray-600">Domain Rating</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Globe className="size-5 text-purple-600" />
            </div>
            <div className="font-bold text-lg">
              {directory.domainRating >= 50 ? "High" : "Normal"}
            </div>
            <div className="text-xs text-gray-600">Authority</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              {getSubmitDifficultyIcon(directory.submitDifficulty)}
            </div>
            <div className="font-bold text-lg">
              {directory.submitDifficulty}
            </div>
            <div className="text-xs text-gray-600">Submit Difficulty</div>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="font-semibold mb-3 text-lg">Features & Pricing</h2>
          <div className="flex flex-wrap gap-2">
            {directory.tags.find(
              (tag: DirectoryTag) => tag === DirectoryTag.FreeLaunch,
            ) && (
              <Badge
                variant="secondary"
                className="text-green-500 bg-green-100/70"
              >
                <Check className="size-3 mr-1" />
                Launch for Free
              </Badge>
            )}
            {directory.tags.find(
              (tag: DirectoryTag) => tag === DirectoryTag.PaidFeatures,
            ) && (
              <Badge
                variant="secondary"
                className="text-yellow-500 bg-yellow-100/70"
              >
                <DollarSign className="size-3 mr-1" />
                Website offers Paid features
              </Badge>
            )}
            {directory.viewsPerMonth >= 50000 && (
              <Badge variant="secondary" className="text-rose-400 bg-rose-100">
                <TrendingUp className="size-3 mr-1" />
                High Traffic
              </Badge>
            )}
            {directory.tags.find(
              (tag: DirectoryTag) => tag === DirectoryTag.SmallStartups,
            ) && (
              <Badge variant="secondary" className="text-sky-400 bg-sky-100">
                <PawPrint className="size-3 mr-1" />
                Perfect for small startups
              </Badge>
            )}
            {directory.tags.find(
              (tag: DirectoryTag) => tag === DirectoryTag.AI,
            ) && (
              <Badge
                variant="secondary"
                className="text-purple-400 bg-purple-100"
              >
                <div className="text-xs font-semibold p-0">AI</div>
                Focus on AI
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="font-semibold mb-3 text-lg">About</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {/* Use the new 'about' field, fallback to description */}
            {directory.about || directory.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <LaunchListButton
            directory={directory}
            isLoggedIn={isLoggedIn}
            initialIsInLaunchList={isInLaunchList}
          />
          <Link
            href={directory.url}
            className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
            target="_blank"
          >
            <ExternalLink className="size-4 mr-2" />
            Visit Website
          </Link>
        </div>
      </div>
    </div>
  );
}

const getSubmitDifficultyIcon = (it: SubmitDifficulty) => {
  switch (it) {
    case SubmitDifficulty.High:
      return <Frown className="size-5 text-red-400" />;
    case SubmitDifficulty.Ok:
      return <Meh className="size-5 text-yellow-500" />;
    case SubmitDifficulty.Low:
      return <Smile className="size-5 text-green-600" />;
  }
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getDirectory(slug);

  if (!data?.directory) {
    return {
      title: "Directory Not Found",
    };
  }

  const directory = data.directory;

  return {
    title: directory.seoTitle || directory.name,
    description: directory.seoDescription || directory.description,
  };
}
