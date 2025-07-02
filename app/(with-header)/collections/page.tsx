"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  FilterIcon as Funnel,
  ListFilter,
  FileInput,
  FilePlus,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Directory } from "@/components/directory";
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
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function CollectionPage() {
  const router = useRouter();
  const [directories, setDirectories] = useState<DirectoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to load directories");
      } finally {
        setLoading(false);
      }
    };

    fetchDirectories();
  }, []);

  // Add single directory to launch list
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

  const addAllToLaunchList = async () => {
    try {
      const promises = directories.map((directory) =>
        fetch("/api/user/launch-list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ directoryId: directory._id }),
        }),
      );

      await Promise.all(promises);

      toast(`All ${directories.length} directories added to Launch List`, {
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
    return (directoryId: string) => (
      <Tooltip>
        <TooltipTrigger
          onClick={() => addToLaunchList(directoryId)}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "active:scale-92 transition-all duration-100",
          )}
        >
          <FilePlus />
          Add
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Add to Launch List</p>
        </TooltipContent>
      </Tooltip>
    );
  }, []);

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
          <div className="flex items-center gap-2">
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
              onClick={addAllToLaunchList}
              disabled={directories.length === 0}
            >
              <FileInput />
              Add all to Launch List
            </Button>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger
                disabled={loading}
                className={cn(buttonVariants({ variant: "outline" }), "size-8")}
              >
                <ListFilter />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Sort</p>
              </TooltipContent>
            </Tooltip>
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
              {directories.map((directory) => (
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
