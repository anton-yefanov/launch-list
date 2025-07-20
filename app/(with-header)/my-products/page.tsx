"use client";

import Image from "next/image";
import {
  Plus,
  Rocket,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowUpRight,
  Award,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { IStartup } from "@/models/Startup";
import { useSession } from "next-auth/react";

export default function MyStartupsPage() {
  const [startups, setStartups] = useState<IStartup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/product`);
      const data = await response.json();

      if (data.success) {
        setStartups(data.startups);
      } else {
        setError(data.error || "Failed to fetch startups");
      }
    } catch (err) {
      setError("Failed to fetch startups");
      console.error("Error fetching startups:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchStartups();
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between px-2.5">
          <h1 className="text-2xl font-semibold mb-4">My products</h1>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading startups...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center justify-between px-2.5">
          <h1 className="text-2xl font-semibold mb-4">My products</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchStartups} variant="outline">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between px-2.5">
        <h1 className="text-2xl font-semibold mb-4">My products</h1>
      </div>

      {startups.length === 0 ? (
        <div className="border border-sky-400 items-center justify-between rounded-xl p-3 flex flex-col sm:flex-row bg-sky-200/30">
          <p className="text-gray-600 mb-4 sm:mb-0 text-center">
            Just submitted your product? It might take a moment to appear.
          </p>
          <div className="space-y-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center gap-2 active:scale-92 transition-all duration-100"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      ) : null}

      {startups.length === 0 ? (
        <div className="text-center select-none flex flex-col items-center py-12">
          <Rocket size={50} strokeWidth={1} className="mb-8" />
          <h2 className="font-semibold text-2xl mb-4">No products yet</h2>

          <>
            <p className="text-gray-600 mb-4">
              Launch your product to get a backlink and live on homepage for a
              week
            </p>
            <Link
              href={`https://tally.so/r/nW6pYJ?email=${user?.email}&redirect=${process.env.NEXT_PUBLIC_URL}/my-products`}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <Plus /> Add your first product
            </Link>
          </>
        </div>
      ) : (
        <div className="space-y-2">
          {startups.map((startup) => (
            <ProductCard key={startup._id} startup={startup} />
          ))}
        </div>
      )}
    </div>
  );
}

interface ProductCardProps {
  startup: IStartup;
}

const ProductCard = ({ startup }: ProductCardProps) => {
  const logoSrc = startup.logo?.url || "/logo.png";

  // const handleShare = () => {
  //   const productUrl = `https://launch-list.org/product/${startup._id}`;
  //   const tweetText = `${startup.name} is live on @LaunchList_\n\n${productUrl}`;
  //   const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  //
  //   window.open(twitterUrl, "_blank");
  // };

  return (
    <div className="rounded-lg p-2.5 flex gap-2 select-none hover:bg-gray-100/50">
      <div className="shrink-0">
        <Image
          src={logoSrc}
          alt={`${startup.name} logo`}
          width={50}
          height={50}
          draggable={false}
          className="rounded"
        />
      </div>
      <div className="flex flex-col justify-center flex-1">
        <div className="font-semibold text-lg">{startup.name}</div>
        <div className="text-gray-600">{startup.tagline}</div>
        <div className="flex items-center gap-1 mt-1">
          {getStatusIcon(startup.status)}
          <span className="text-xs text-gray-500">
            {getStatusMessage(startup)}
          </span>
        </div>
        {startup.status === "rejected" && startup.rejectionReason && (
          <div className="mt-2 p-2 bg-red-50 rounded-md border border-red-200">
            <div className="text-xs text-red-700 font-medium">
              Why was this rejected?
            </div>
            <div className="text-xs text-red-600 mt-1">
              {startup.rejectionReason}
            </div>
            {startup.rejectionCategory && (
              <div className="text-xs text-red-500 mt-1">
                Category: {startup.rejectionCategory}
              </div>
            )}
          </div>
        )}
        {startup.status === "approved" && (
          <div className="mt-2 p-2 bg-green-50 rounded-md border border-green-200">
            <div className="text-xs text-green-700 font-medium">
              🎉 Congratulations! Your startup has been approved for launch
            </div>
            <div className="text-xs text-green-600 mt-1">
              You can now launch your startup
            </div>
          </div>
        )}
      </div>
      {startup.status === "approved" && (
        <Link
          href={`/my-products/launch/${startup._id}`}
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "min-w-30 ml-auto active:scale-95 transition-all duration-100 bg-primary-color hover:bg-primary-color/80",
          )}
        >
          Launch <Rocket />
        </Link>
      )}
      {startup.status === "launched" && (
        <div className="flex flex-col gap-2">
          <Link
            href={`/product/${startup.slug}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "justify-between min-w-26 ml-auto active:scale-95 transition-all duration-100",
            )}
          >
            View
            <ArrowUpRight />
          </Link>
          <Link
            href={`/product/${startup.slug}/badges`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "justify-between min-w-26 ml-auto active:scale-95 transition-all duration-100",
            )}
          >
            Badges
            <Award />
          </Link>
          {/*  size="sm"*/}
          {/*  className="min-w-30 ml-auto active:scale-95 transition-all duration-100"*/}
          {/*  onClick={handleShare}*/}
          {/*>*/}
          {/*  Share*/}
          {/*</Button>*/}
        </div>
      )}
    </div>
  );
};

const getStatusMessage = (startup: IStartup) => {
  switch (startup.status) {
    case "approved":
      return "Ready to launch! 🚀";
    case "rejected":
      return startup.rejectionReason || "Submission not approved";
    case "pending":
      return "Under review...";
    case "launched":
      return "Launched";
    default:
      return "Status unknown";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="size-4 text-green-600" />;
    case "rejected":
      return <XCircle className="size-4 text-red-600" />;
    case "pending":
      return <AlertCircle className="size-4 text-yellow-600" />;
    case "launched":
      return <Rocket className="size-4 text-green-500" />;
    default:
      return <AlertCircle className="size-4 text-gray-400" />;
  }
};
