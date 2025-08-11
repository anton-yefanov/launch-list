"use client";

import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronUp, Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoginDialog } from "@/components/login-dialog";
import { Startup } from "@/app/(with-header)/page";
import Link from "next/link";

export const Product = ({ startup }: { startup: Startup }) => {
  const { data: session, status } = useSession();
  const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);
  const [currentUpvoterIds, setCurrentUpvoterIds] = useState<string[]>(
    startup.upvoterIds || [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = status === "authenticated";

  // Derive upvote count from upvoterIds
  const currentUpvotes = currentUpvoterIds.length;

  // Check if current user has upvoted using useMemo for performance
  const upvoted = useMemo(() => {
    if (!isAuthenticated || !session?.user?.id) return false;
    return currentUpvoterIds.includes(session.user.id);
  }, [currentUpvoterIds, isAuthenticated, session?.user?.id]);

  const handleUpvoteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the row click

    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    if (isLoading || !session?.user?.id) return; // Prevent multiple clicks

    setIsLoading(true);

    // Optimistic update
    const userId = session.user.id;
    const newUpvoted = !upvoted;
    const newUpvoterIds = newUpvoted
      ? [...currentUpvoterIds, userId]
      : currentUpvoterIds.filter((id) => id !== userId);

    setCurrentUpvoterIds(newUpvoterIds);

    try {
      const response = await fetch(`/api/product/${startup.slug}/upvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        // If your upvote API returns the updated upvoter IDs, use them
        // Otherwise, keep the optimistic update
        if (result.data.upvoterIds) {
          setCurrentUpvoterIds(result.data.upvoterIds);
        }
      } else {
        // Revert optimistic update on error
        setCurrentUpvoterIds(startup.upvoterIds || []);
        console.error("Error upvoting:", result.error);
      }
    } catch (error) {
      // Revert optimistic update on error
      setCurrentUpvoterIds(startup.upvoterIds || []);
      console.error("Error upvoting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Link
        href={`/product/${startup.slug}`}
        target="_blank"
        className="rounded-lg p-2.5 flex gap-4 select-none hover:bg-gray-100/50 cursor-pointer transition-colors"
      >
        <div className="shrink-0">
          <Image
            src={startup.logo}
            alt={`${startup.name} logo`}
            width={50}
            height={50}
            draggable={false}
            className="rounded"
          />
        </div>
        <div className="flex flex-col">
          <div className="font-semibold">{startup.name}</div>
          <div>{startup.tagline}</div>
          <div className="flex text-xs items-center flex-wrap mt-1">
            <div>by {startup.submittedBy}</div>
            {startup.categories.map((category, index) => (
              <span key={index} className="flex">
                <Dot size={16} className="text-gray-300" />
                <span>{category}</span>
              </span>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleUpvoteClick}
          disabled={isLoading}
          className={cn(
            "cursor-pointer size-12.5 ml-auto active:scale-90 flex flex-col gap-0 transition-all duration-120",
            upvoted
              ? "border-primary-color text-primary-color hover:text-primary-color"
              : "",
            isLoading && "opacity-70 cursor-not-allowed",
          )}
        >
          <ChevronUp strokeWidth={2} />
          {currentUpvotes}
        </Button>
      </Link>
      <LoginDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
        title={
          <h1 className="text-2xl font-semibold">Login to upvote a product</h1>
        }
      />
    </>
  );
};
