"use client";

import Image from "next/image";
import { Plus, Rocket, Loader2 } from "lucide-react";
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
      <div className="flex flex-col justify-center">
        <div className="font-semibold text-lg">{startup.name}</div>
        <div className="text-gray-600">{startup.tagline}</div>
        <div className="text-xs text-gray-400 mt-1">
          Status:{" "}
          <span
            className={cn(
              "capitalize",
              startup.status === "approved" && "text-green-600",
              startup.status === "pending" && "text-yellow-600",
              startup.status === "rejected" && "text-red-600",
            )}
          >
            {startup.status}
          </span>
        </div>
      </div>
      <Link
        href={`/my-startups/launch/${startup._id}`}
        className={cn(
          buttonVariants({ variant: "default" }),
          "ml-auto my-auto active:scale-95 transition-all duration-120 bg-primary-color hover:bg-primary-color/80",
        )}
      >
        Launch <Rocket />
      </Link>
    </div>
  );
};
