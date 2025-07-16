"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Check,
  FileInput,
  FilePlus,
  FilterIcon as Funnel,
  ListFilter,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Directory } from "@/components/directory";
import { LoginDialog } from "@/components/login-dialog";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { DirectoryTag } from "@/types/DirectoryTag";
import { SubmitDifficulty } from "@/types/SubmitDifficulty";
import { useSession } from "next-auth/react";
import { CheckedState } from "@radix-ui/react-checkbox";

interface DirectoryType {
  _id: string;
  name: string;
  description: string;
  url: string;
  bgColor: string;
  domainRating: number;
  viewsPerMonth: number;
  tags: DirectoryTag[];
  submitDifficulty: SubmitDifficulty;
}

interface DirectoriesResponse {
  directories: DirectoryType[];
  userLaunchList: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

type SortOption = "none" | "a-z" | "z-a" | "dr-high" | "views-high";

interface FilterState {
  highTraffic: boolean;
  easySubmission: boolean;
  domainRating: [number, number];
  freeLaunch: boolean;
  paidLaunch: boolean;
  focusOnAI: boolean;
}

const sortOptions = [
  { value: "none" as const, label: "No Sort" },
  { value: "a-z" as const, label: "A - Z" },
  { value: "z-a" as const, label: "Z - A" },
  { value: "dr-high" as const, label: "DR (High to Low)" },
  { value: "views-high" as const, label: "Views (High to Low)" },
];

const initialFilterState: FilterState = {
  highTraffic: false,
  easySubmission: false,
  domainRating: [0, 100],
  freeLaunch: false,
  paidLaunch: false,
  focusOnAI: false,
};

export default function CollectionPage() {
  const router = useRouter();
  const [directories, setDirectories] = useState<DirectoryType[]>([]);
  const [userLaunchList, setUserLaunchList] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("none");
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { status } = useSession();
  const isAuth = status === "authenticated";
  const hasSortActive = sortBy !== "none";

  useEffect(() => {
    const fetchDirectories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/directories");
        const data: DirectoriesResponse = await response.json();
        setDirectories(data.directories);

        if (isAuth) {
          setUserLaunchList(new Set(data.userLaunchList || []));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to load directories");
      } finally {
        setLoading(false);
      }
    };

    if (isAuth !== null) {
      fetchDirectories();
    }
  }, [isAuth]);

  const handleAuthRequired = useCallback(
    (action: () => void) => {
      if (!isAuth) {
        setShowLoginDialog(true);
        return;
      }
      action();
    },
    [isAuth],
  );

  const handleFilterChange = (
    key: keyof FilterState,
    value: CheckedState | [number, number],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters(initialFilterState);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.highTraffic ||
      filters.easySubmission ||
      filters.domainRating[0] > 0 ||
      filters.domainRating[1] < 100 ||
      filters.freeLaunch ||
      filters.paidLaunch ||
      filters.focusOnAI
    );
  }, [filters]);

  const filteredAndSortedDirectories = useMemo(() => {
    let filtered = directories;

    // Apply filters
    if (hasActiveFilters) {
      filtered = directories.filter((directory) => {
        // High traffic filter
        if (
          filters.highTraffic &&
          !directory.tags.includes(DirectoryTag.HighTraffic)
        ) {
          return false;
        }

        // Easy submission filter (Low or Ok difficulty)
        if (
          filters.easySubmission &&
          directory.submitDifficulty === SubmitDifficulty.High
        ) {
          return false;
        }

        // Domain rating filter
        if (
          directory.domainRating < filters.domainRating[0] ||
          directory.domainRating > filters.domainRating[1]
        ) {
          return false;
        }

        // Free launch filter
        if (
          filters.freeLaunch &&
          !directory.tags.includes(DirectoryTag.FreeLaunch)
        ) {
          return false;
        }

        // Paid launch filter
        if (
          filters.paidLaunch &&
          !directory.tags.includes(DirectoryTag.PaidFeatures)
        ) {
          return false;
        }

        // Focus on AI filter
        if (filters.focusOnAI && !directory.tags.includes(DirectoryTag.AI)) {
          return false;
        }

        return true;
      });
    }

    if (sortBy === "none") return filtered;

    return [...filtered].sort((a, b) => {
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
  }, [directories, sortBy, filters, hasActiveFilters]);

  const addAllToLaunchList = async () => {
    const directoriesToAdd = filteredAndSortedDirectories.filter(
      (dir) => !userLaunchList.has(dir._id),
    );

    if (directoriesToAdd.length === 0) {
      toast("All directories are already in your Launch List");
      return;
    }

    try {
      // Single API call with all directory IDs
      const response = await fetch("/api/user/launch-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          directoryIds: directoriesToAdd.map((d) => d._id),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add directories");
      }

      const result = await response.json();

      // Update local state
      setUserLaunchList(
        (prev) => new Set([...prev, ...directoriesToAdd.map((d) => d._id)]),
      );

      toast(`${result.addedCount} websites added to Launch List`, {
        description:
          result.skippedCount > 0
            ? `${result.skippedCount} were already in your list`
            : "View now or later",
        action: {
          label: "View",
          onClick: () => router.push("/my-launch-list"),
        },
      });
    } catch (error) {
      console.error("Bulk add error:", error);
      toast.error("Failed to add directories to launch list");
    }
  };

  const AddButton = useMemo(() => {
    const addToLaunchList = async (directoryId: string) => {
      try {
        // Optimistically update the state first
        setUserLaunchList((prev) => new Set([...prev, directoryId]));

        const response = await fetch("/api/user/launch-list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ directoryIds: [directoryId] }),
        });

        if (!response.ok) {
          setUserLaunchList((prev) => {
            const newSet = new Set(prev);
            newSet.delete(directoryId);
            return newSet;
          });
        }

        toast("Website Added to Launch List", {
          action: {
            label: "View",
            onClick: () => router.push("/my-launch-list"),
          },
        });
      } catch (error) {
        console.error("Error adding to launch list:", error);
        toast.error("Failed to add directory to launch list");
      }
    };

    const removeFromLaunchList = async (directoryId: string) => {
      try {
        // Optimistically update the state first
        setUserLaunchList((prev) => {
          const newSet = new Set(prev);
          newSet.delete(directoryId);
          return newSet;
        });

        const response = await fetch("/api/user/launch-list", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ directoryIds: [directoryId] }),
        });

        if (!response.ok) {
          setUserLaunchList((prev) => new Set([...prev, directoryId]));
        }

        toast("Website removed from Launch List");
      } catch (error) {
        console.error("Error removing from launch list:", error);
        toast.error("Failed to remove directory from launch list");
      }
    };

    const ButtonComponent = (directoryId: string) => {
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
              "min-w-[85px] active:scale-92 transition-all duration-100",
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

    ButtonComponent.displayName = "AddButton";
    return ButtonComponent;
  }, [router, userLaunchList, handleAuthRequired]);

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
        {/*<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">*/}
        {/*  <Card title="I launched on 100+ websites" category="Article" />*/}
        {/*  <Card*/}
        {/*    title="Best directories for Small Startups (75+)"*/}
        {/*    category="Collection"*/}
        {/*  />*/}
        {/*  <Card*/}
        {/*    title="Best directories for Small Startups (75+)"*/}
        {/*    category="Collection"*/}
        {/*  />*/}
        {/*</div>*/}
        {/*<FeaturedSection />*/}
        <div className="flex items-center justify-between pb-2 sticky top-17 bg-background z-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            {loading ? (
              <Skeleton className="h-[28px] w-[126px] my-auto" />
            ) : (
              <div className="text-xl font-semibold">
                {filteredAndSortedDirectories.length} Websites
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAuthRequired(addAllToLaunchList)}
              disabled={filteredAndSortedDirectories.length === 0}
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
                  className={cn(
                    "size-8 bg-transparent",
                    hasSortActive &&
                      "border-sky-300 bg-sky-200/30 hover:bg-sky-300/20",
                  )}
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

            <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DropdownMenuTrigger autoFocus={false} asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={loading}
                  className={cn(
                    "size-8 active:scale-95 transition-all duration-100",
                    hasActiveFilters &&
                      "border-sky-300 bg-sky-200/30 hover:bg-sky-300/20",
                  )}
                >
                  <Funnel />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filters</h4>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="h-auto p-1 text-xs"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>

                  <Separator />

                  {/* Boolean filters */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="highTraffic"
                        checked={filters.highTraffic}
                        onCheckedChange={(checked) =>
                          handleFilterChange("highTraffic", checked)
                        }
                      />
                      <Label
                        htmlFor="highTraffic"
                        className="text-sm font-normal"
                      >
                        High traffic
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="easySubmission"
                        checked={filters.easySubmission}
                        onCheckedChange={(checked) =>
                          handleFilterChange("easySubmission", checked)
                        }
                      />
                      <Label
                        htmlFor="easySubmission"
                        className="text-sm font-normal"
                      >
                        Easy submission
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="freeLaunch"
                        checked={filters.freeLaunch}
                        onCheckedChange={(checked) =>
                          handleFilterChange("freeLaunch", checked)
                        }
                      />
                      <Label
                        htmlFor="freeLaunch"
                        className="text-sm font-normal"
                      >
                        Free launch
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="paidLaunch"
                        checked={filters.paidLaunch}
                        onCheckedChange={(checked) =>
                          handleFilterChange("paidLaunch", checked)
                        }
                      />
                      <Label
                        htmlFor="paidLaunch"
                        className="text-sm font-normal"
                      >
                        Paid launch
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="focusOnAI"
                        checked={filters.focusOnAI}
                        onCheckedChange={(checked) =>
                          handleFilterChange("focusOnAI", checked)
                        }
                      />
                      <Label
                        htmlFor="focusOnAI"
                        className="text-sm font-normal"
                      >
                        Focus on AI
                      </Label>
                    </div>
                  </div>

                  <Separator />

                  {/* Domain Rating Slider */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Domain Rating: {filters.domainRating[0]} -{" "}
                      {filters.domainRating[1]}
                    </Label>
                    <Slider
                      value={filters.domainRating}
                      onValueChange={(value) =>
                        handleFilterChange(
                          "domainRating",
                          value as [number, number],
                        )
                      }
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0</span>
                      <span>100</span>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-1">
          {loading ? (
            <>
              {new Array(20).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-[66px] w-full border" />
              ))}
            </>
          ) : (
            <>
              {filteredAndSortedDirectories.map((directory) => (
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

// const Card = ({ title, category }: { title: string; category: string }) => {
//   return (
//     <div className="relative bg-gradient-to-br from-white to-purple-50/70 rounded-lg border overflow-hidden select-none">
//       <Image
//         src="/me.png"
//         alt="star"
//         width={100}
//         height={30}
//         draggable={false}
//         className="absolute inset-0 w-full h-full object-cover select-none"
//       />
//       <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
//       <div className="relative z-10 p-4 pt-14 pb-2 h-full flex flex-col justify-end">
//         <div className="font-semibold text-white">{title}</div>
//         <div className="text-xs mt-1 text-white/90">{category}</div>
//       </div>
//     </div>
//   );
// };
