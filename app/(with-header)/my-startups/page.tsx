"use client";

import Image from "next/image";
import {
  Plus,
  Rocket,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Startup {
  _id: string;
  name: string;
  websiteUrl: string;
  tagline: string;
  logo?: {
    id: string;
    name: string;
    url: string;
    mimeType: string;
    size: number;
  };
  screenshots?: Array<{
    id: string;
    name: string;
    url: string;
    mimeType: string;
    size: number;
  }>;
  submittedBy: string;
  submitterEmail: string;
  twitterUsername?: string;
  submissionRating?: number;
  userId: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  rejectionCategory?: string;
  submittedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyStartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/startups`);
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

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between px-2.5">
          <h1 className="text-2xl font-semibold mb-4">My startups</h1>
          <Button variant="outline" disabled>
            <Plus /> Add new
          </Button>
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
          <h1 className="text-2xl font-semibold mb-4">My startups</h1>
          <Button variant="outline">
            <Plus /> Add new
          </Button>
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
        <h1 className="text-2xl font-semibold mb-4">My startups</h1>
        <Button variant="outline">
          <Plus /> Add new
        </Button>
      </div>

      {startups.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No startups yet</p>
          <Button variant="outline">
            <Plus /> Add your first startup
          </Button>
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
  startup: Startup;
}

const ProductCard = ({ startup }: ProductCardProps) => {
  const logoSrc = startup.logo?.url || "/logo.png";

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusMessage = (startup: Startup) => {
    switch (startup.status) {
      case "approved":
        return "Ready to launch! 🚀";
      case "rejected":
        return startup.rejectionReason || "Submission not approved";
      case "pending":
        return "Under review...";
      default:
        return "Status unknown";
    }
  };

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
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.currentTarget.src = "/logo.png";
          }}
        />
      </div>
      <div className="flex flex-col justify-center flex-1">
        <div className="font-semibold text-lg">{startup.name}</div>
        <div className="text-gray-600">{startup.tagline}</div>

        {/* Status with icon */}
        <div className="flex items-center gap-2 mt-1">
          {getStatusIcon(startup.status)}
          <span className="text-xs text-gray-500">
            {getStatusMessage(startup)}
          </span>
        </div>

        {/* Rejection details */}
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

        {/* Approval celebration */}
        {startup.status === "approved" && (
          <div className="mt-2 p-2 bg-green-50 rounded-md border border-green-200">
            <div className="text-xs text-green-700 font-medium">
              🎉 Congratulations! Your startup has been approved for launch.
            </div>
            <div className="text-xs text-green-600 mt-1">
              You can now launch your startup and start getting feedback from
              the community.
            </div>
          </div>
        )}
      </div>

      {/* Launch button - only show for approved startups */}
      {startup.status === "approved" && (
        <Link
          href={`/my-startups/launch/${startup._id}`}
          className={cn(
            buttonVariants({ variant: "default" }),
            "ml-auto my-auto active:scale-95 transition-all duration-120 bg-primary-color hover:bg-primary-color/80",
          )}
        >
          Launch <Rocket />
        </Link>
      )}

      {/* View details button for pending/rejected */}
      {startup.status !== "approved" && (
        <Button
          variant="outline"
          size="sm"
          className="ml-auto my-auto"
          onClick={() => {
            // You can add a modal or navigate to details page
            console.log("View details for:", startup._id);
          }}
        >
          View Details
        </Button>
      )}
    </div>
  );
};
