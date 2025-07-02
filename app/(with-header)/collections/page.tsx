"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  FilterIcon as Funnel,
  ListFilter,
  FileInput,
  FilePlus,
  Check,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Directory } from "@/components/directory";
import { LoginDialog } from "@/components/login-dialog";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface DirectoryType {
  _id: string;
  name: string;
  description: string;
  url: string;
  bgColor: string;
  domainRating: number;
  viewsPerMonth: number;
  tags: string[];
  submitDifficulty: string;
}

interface DirectoriesResponse {
  directories: DirectoryType[];
  userLaunchList: string[]; // Array of directory IDs in user's launch list
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

type SortOption = "none" | "a-z" | "z-a" | "dr-high" | "views-high";

const sortOptions = [
  { value: "none" as const, label: "No Sort" },
  { value: "a-z" as const, label: "A - Z" },
  { value: "z-a" as const, label: "Z - A" },
  { value: "dr-high" as const, label: "DR (High to Low)" },
  { value: "views-high" as const, label: "Views (High to Low)" },
];

export default function CollectionPage() {
  const router = useRouter();
  const [directories, setDirectories] = useState<DirectoryType[]>([]);
  const [userLaunchList, setUserLaunchList] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("none");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = checking, true = logged in, false = not logged in
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Replace this with your actual auth check endpoint
        const response = await fetch("/api/auth/me");
        setIsLoggedIn(response.ok);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    const fetchDirectories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/directories");

        if (!response.ok) {
          throw new Error("Failed to fetch directories");
        }

        const data: DirectoriesResponse = await response.json();
        setDirectories(data.directories);

        // Only set user launch list if user is logged in
        if (isLoggedIn) {
          setUserLaunchList(new Set(data.userLaunchList || []));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to load directories");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch directories after we know the auth status
    if (isLoggedIn !== null) {
      fetchDirectories();
    }
  }, [isLoggedIn]);

  const handleAuthRequired = (action: () => void) => {
    if (isLoggedIn === false) {
      setShowLoginDialog(true);
      return;
    }
    action();
  };

  const sortedDirectories = useMemo(() => {
    if (sortBy === "none") return directories;

    const sorted = [...directories].sort((a, b) => {
      switch (sortBy) {
        case "a-z":
          return a.name.localeCompare(b.name);
        case "z-a":
          return b.name.localeCompare(a.name);
        case "dr-high":
          return b.domainRating - a.domainRating;
        case "views-high":
          return b.viewsPerMonth - a.viewsPerMonth;
        default:
          return 0;
      }
    });

    return sorted;
  }, [directories, sortBy]);

  const addToLaunchList = async (directoryId: string) => {
    try {
      const response = await fetch("/api/user/launch-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ directoryId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add to launch list");
      }

      // Update local state
      setUserLaunchList((prev) => new Set([...prev, directoryId]));

      toast("Directory Added to Launch List", {
        description: "View now or later",
        action: {
          label: "View",
          onClick: () => router.push("/my-launch-list"),
        },
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add to launch list",
      );
    }
  };

  const removeFromLaunchList = async (directoryId: string) => {
    try {
      const response = await fetch("/api/user/launch-list", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ directoryId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove from launch list");
      }

      // Update local state
      setUserLaunchList((prev) => {
        const newSet = new Set(prev);
        newSet.delete(directoryId);
        return newSet;
      });

      toast("Directory removed from Launch List");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to remove from launch list",
      );
    }
  };

  const addAllToLaunchList = async () => {
    const directoriesToAdd = directories.filter(
      (dir) => !userLaunchList.has(dir._id),
    );

    if (directoriesToAdd.length === 0) {
      toast("All directories are already in your Launch List");
      return;
    }

    try {
      const promises = directoriesToAdd.map((directory) =>
        fetch("/api/user/launch-list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ directoryId: directory._id }),
        }),
      );

      await Promise.all(promises);

      // Update local state
      setUserLaunchList(
        (prev) => new Set([...prev, ...directoriesToAdd.map((d) => d._id)]),
      );

      toast(`${directoriesToAdd.length} directories added to Launch List`, {
        description: "View now or later",
        action: {
          label: "View",
          onClick: () => router.push("/my-launch-list"),
        },
      });
    } catch {
      toast.error("Failed to add all directories to launch list");
    }
  };

  const AddButton = useMemo(() => {
    return (directoryId: string) => {
      const isAdded = userLaunchList.has(directoryId);

      return (
        <Tooltip>
          <TooltipTrigger
            onClick={() =>
              handleAuthRequired(() =>
                isAdded
                  ? removeFromLaunchList(directoryId)
                  : addToLaunchList(directoryId),
              )
            }
            className={cn(
              buttonVariants({
                variant: isAdded ? "default" : "outline",
                size: "sm",
              }),
              "active:scale-92 transition-all duration-100",
              isAdded && "bg-green-600 hover:bg-green-700",
            )}
          >
            {isAdded ? <Check /> : <FilePlus />}
            {isAdded ? "Added" : "Add"}
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{isAdded ? "Remove from Launch List" : "Add to Launch List"}</p>
          </TooltipContent>
        </Tooltip>
      );
    };
  }, [userLaunchList, isLoggedIn]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: {error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Card title="I launched on 100+ websites" category="Article" />
          <Card
            title="Best directories for Small Startups (75+)"
            category="Collection"
          />
          <Card
            title="Best directories for Small Startups (75+)"
            category="Collection"
          />
        </div>
        <div className="flex items-center justify-between my-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            {loading ? (
              <Skeleton className="h-[28px] w-[126px] my-auto" />
            ) : (
              <div className="text-xl font-semibold">
                {directories.length} Websites
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAuthRequired(addAllToLaunchList)}
              disabled={directories.length === 0}
            >
              <FileInput />
              Add all to Launch List
            </Button>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={loading}
                  className="size-8 bg-transparent"
                >
                  <ListFilter />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className="flex items-center justify-between"
                  >
                    <span>{option.label}</span>
                    {sortBy === option.value && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger
                disabled={loading}
                className={cn(buttonVariants({ variant: "outline" }), "size-8")}
              >
                <Funnel />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Filter</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {loading ? (
            <>
              {new Array(20).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-[66px] w-full border" />
              ))}
            </>
          ) : (
            <>
              {sortedDirectories.map((directory) => (
                <Directory
                  key={directory._id}
                  directory={directory}
                  buttonComponent={AddButton(directory._id)}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Login Dialog */}
      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        title={
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Sign in to continue</h2>
            <p className="text-muted-foreground">
              Please sign in to add directories to your launch list and access
              all features.
            </p>
          </div>
        }
      />
    </TooltipProvider>
  );
}

const Card = ({ title, category }: { title: string; category: string }) => {
  return (
    <div className="relative bg-gradient-to-br from-white to-purple-50/70 rounded-lg border overflow-hidden select-none">
      <Image
        src="/me.png"
        alt="star"
        width={100}
        height={30}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover select-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
      <div className="relative z-10 p-4 pt-14 pb-2 h-full flex flex-col justify-end">
        <div className="font-semibold text-white">{title}</div>
        <div className="text-xs mt-1 text-white/90">{category}</div>
      </div>
    </div>
  );
};
