"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { IDirectory } from "@/models/Directory";

interface LaunchListButtonProps {
  directory: IDirectory;
  isLoggedIn: boolean;
  initialIsInLaunchList: boolean;
}

export function LaunchListButton({
  directory,
  isLoggedIn,
  initialIsInLaunchList,
}: LaunchListButtonProps) {
  const router = useRouter();
  const [isInLaunchList, setIsInLaunchList] = useState(initialIsInLaunchList);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLaunchListToggle = async () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to add directories to your launch list");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch("/api/user/launch-list", {
        method: isInLaunchList ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ directoryIds: [directory._id] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update launch list");
      }

      setIsInLaunchList(!isInLaunchList);
      toast(
        isInLaunchList
          ? "Website removed from Launch List"
          : "Website added to Launch List",
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

  return (
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
  );
}
