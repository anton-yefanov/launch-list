"use client";

import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { LoginDialog } from "@/components/login-dialog";

interface UpvoteButtonProps {
  startup: {
    slug: string;
    name: string;
    upvoterIds: string[];
  };
  isInLaunchWeek: boolean;
}

export default function UpvoteButton({
  startup,
  isInLaunchWeek,
}: UpvoteButtonProps) {
  const { data: session, status } = useSession();
  const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);
  const [currentUpvoterIds, setCurrentUpvoterIds] = useState<string[]>(
    startup.upvoterIds || [],
  );
  const [isUpvoting, setIsUpvoting] = useState(false);

  const isAuthenticated = status === "authenticated";

  // Derive upvote count from upvoterIds array
  const currentUpvotes = useMemo(() => {
    return currentUpvoterIds.length;
  }, [currentUpvoterIds]);

  // Check if current user has upvoted using useMemo for performance
  const upvoted = useMemo(() => {
    if (!isAuthenticated || !session?.user?.id) return false;
    return currentUpvoterIds.includes(session.user.id);
  }, [currentUpvoterIds, isAuthenticated, session?.user?.id]);

  const handleUpvoteClick = async () => {
    if (!isInLaunchWeek) {
      return;
    }

    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    if (isUpvoting || !session?.user?.id) return;

    setIsUpvoting(true);

    // Optimistic update
    const userId = session.user.id;
    const newUpvoted = !upvoted;
    const newUpvoterIds = newUpvoted
      ? [...currentUpvoterIds, userId]
      : currentUpvoterIds.filter((id) => id !== userId);

    setCurrentUpvoterIds(newUpvoterIds);

    try {
      // Use slug for upvote API call
      const response = await fetch(`/api/product/${startup.slug}/upvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        if (result.data.upvoterIds) {
          setCurrentUpvoterIds(result.data.upvoterIds);
        }
      } else {
        setCurrentUpvoterIds(startup.upvoterIds || []);
        console.error("Error upvoting:", result.error);
      }
    } catch (error) {
      setCurrentUpvoterIds(startup.upvoterIds || []);
      console.error("Error upvoting:", error);
    } finally {
      setIsUpvoting(false);
    }
  };

  return (
    <>
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

      <LoginDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
        title={
          <h1 className="text-2xl font-semibold">
            Login to upvote {startup.name}
          </h1>
        }
      />
    </>
  );
}
