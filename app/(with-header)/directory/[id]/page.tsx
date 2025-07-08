"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  ExternalLink,
  Plus,
  Users,
  Globe,
  Hexagon,
  Frown,
  Meh,
  Smile,
  Check,
  TrendingUp,
  PawPrint,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DirectoryTag } from "@/types/DirectoryTag";
import { formatNumber } from "@/lib/formatNumber";
import { SubmitDifficulty } from "@/types/SubmitDifficulty";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { IDirectory } from "@/models/Directory";

export default function DirectoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const [directory, setDirectory] = useState<IDirectory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInLaunchList, setIsInLaunchList] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchDirectory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/directories/${params.id}`);
        const data = await response.json();
        setDirectory(data.directory);
        setIsInLaunchList(data.isInLaunchList || false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDirectory();
    }
  }, [params.id]);

  const handleLaunchListToggle = async () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to add directories to your launch list");
      return;
    }

    if (!directory) return;

    setIsUpdating(true);
    try {
      const response = await fetch("/api/user/launch-list", {
        method: isInLaunchList ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ directoryId: directory._id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update launch list");
      }

      setIsInLaunchList(!isInLaunchList);
      toast(
        isInLaunchList
          ? "Directory removed from Launch List"
          : "Directory added to Launch List",
        !isInLaunchList
          ? {
              description: "View now or later",
              action: {
                label: "View",
                onClick: () => router.push("/my-launch-list"),
              },
            }
          : undefined,
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update launch list",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-10 w-32 mb-4" />
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !directory) {
    return (
      <div>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error || "Directory not found"}</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="size-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <Button onClick={() => router.back()} variant="ghost" className="mb-4">
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>
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
            <h1 className="text-2xl font-bold">{directory.name}</h1>
            <p className="text-base text-muted-foreground">
              {directory.description}
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
            {directory.tags.find((tag) => tag === DirectoryTag.FreeLaunch) && (
              <Badge
                variant="secondary"
                className="text-green-500 bg-green-100/70"
              >
                <Check className="size-3 mr-1" />
                Launch for Free
              </Badge>
            )}
            {directory.tags.find(
              (tag) => tag === DirectoryTag.PaidFeatures,
            ) && (
              <Badge
                variant="secondary"
                className="text-yellow-500 bg-yellow-100/70"
              >
                <DollarSign className="size-3 mr-1" />
                Website offers Paid features
              </Badge>
            )}
            {directory.viewsPerMonth >= 10000 && (
              <Badge variant="secondary" className="text-rose-400 bg-rose-100">
                <TrendingUp className="size-3 mr-1" />
                High Traffic
              </Badge>
            )}
            {directory.tags.find(
              (tag) => tag === DirectoryTag.SmallStartups,
            ) && (
              <Badge variant="secondary" className="text-sky-400 bg-sky-100">
                <PawPrint className="size-3 mr-1" />
                Perfect for small startups
              </Badge>
            )}
            {directory.tags.find((tag) => tag === DirectoryTag.AI) && (
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
            {directory.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={handleLaunchListToggle}
            disabled={isUpdating}
            className={cn(
              "flex-1",
              isInLaunchList
                ? "bg-green-600 hover:bg-green-700"
                : "bg-primary-color hover:bg-primary-color/90",
            )}
          >
            {isInLaunchList ? (
              <Check className="size-4 mr-2" />
            ) : (
              <Plus className="size-4 mr-2" />
            )}
            {isUpdating
              ? "Updating..."
              : isInLaunchList
                ? "Added to Launch List"
                : "Add to Launch List"}
          </Button>
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
