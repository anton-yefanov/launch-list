"use client";

import { Directory } from "@/components/directory";
import { useMemo, useState, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { File } from "lucide-react";
import ConfettiExplosion from "react-confetti-explosion";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DirectoryType } from "@/types/DirectoryType";

interface LaunchListData {
  launchList: DirectoryType[];
  launchedDirectories: string[];
}

export default function MyLaunchListPage() {
  const [launchList, setLaunchList] = useState<DirectoryType[]>([]);
  const [launchedDirectories, setLaunchedDirectories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLaunchList = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user/launch-list");

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Please sign in to view your launch list");
          }
          throw new Error("Failed to fetch launch list");
        }

        const data: LaunchListData = await response.json();
        setLaunchList(data.launchList);
        setLaunchedDirectories(data.launchedDirectories);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error(
          err instanceof Error ? err.message : "Failed to load launch list",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLaunchList();
  }, []);

  // Toggle launched status
  const toggleLaunched = async (
    directoryId: string,
    currentStatus: boolean,
  ) => {
    try {
      const response = await fetch("/api/user/launched", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          directoryId,
          launched: !currentStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update launched status");
      }

      if (!currentStatus) {
        setLaunchedDirectories((prev) => [...prev, directoryId]);
      } else {
        setLaunchedDirectories((prev) =>
          prev.filter((id) => id !== directoryId),
        );
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update status",
      );
    }
  };

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

  if (!loading && launchList.length === 0) {
    return (
      <div className="text-center select-none flex flex-col items-center py-12">
        <File size={50} strokeWidth={1} className="mb-8" />
        <h1 className="font-semibold text-2xl mb-4">
          Your Launch List is Empty
        </h1>
        <p className="text-gray-600 mb-4">
          Add websites from the collection to start building your launch list!
        </p>
        <Link
          href="/websites"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "active:scale-96 transition-all duration-100",
          )}
        >
          Browse websites
        </Link>
      </div>
    );
  }

  return (
    <div>
      {loading ? (
        <Skeleton className="h-[32px] w-[400px] mb-4" />
      ) : (
        <h1 className="font-semibold text-2xl">
          Don&#39;t forget to launch everywhere!
        </h1>
      )}

      <div className="mb-4">
        {loading ? (
          <Skeleton className="h-[20px] w-[300px]" />
        ) : (
          <>
            Check websites you launched on ({launchedDirectories.length}/
            {launchList.length} completed)
          </>
        )}
      </div>
      {/*<FeaturedSection />*/}
      <div className="flex flex-col gap-2">
        {loading ? (
          <>
            {new Array(20).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-[66px] w-full border" />
            ))}
          </>
        ) : (
          <>
            {launchList.map((directory) => (
              <LaunchListItem
                key={directory._id}
                directory={directory}
                isLaunched={launchedDirectories.includes(directory._id)}
                onToggleLaunched={toggleLaunched}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

const LaunchListItem = ({
  directory,
  isLaunched,
  onToggleLaunched,
}: {
  directory: DirectoryType;
  isLaunched: boolean;
  onToggleLaunched: (directoryId: string, currentStatus: boolean) => void;
}) => {
  const [isExploding, setIsExploding] = useState(false);

  const LaunchedButton = useMemo(() => {
    return (
      <div className="relative">
        <Button
          className={`min-w-26 justify-start relative active:scale-95 transition-all duration-100 items-center ${
            isLaunched
              ? "bg-green-600 hover:bg-green-600/80"
              : "bg-primary-color hover:bg-primary-color/90"
          }`}
          variant="outline"
          onClick={() => {
            if (!isLaunched) {
              setIsExploding(true);
              setTimeout(() => setIsExploding(false), 1000);
            }
            onToggleLaunched(directory._id, isLaunched);
          }}
        >
          {isExploding && (
            <ConfettiExplosion
              force={0.4}
              duration={2000}
              particleCount={30}
              width={400}
              className="absolute top-0 left-0"
            />
          )}
          <div
            className={`w-4 h-4 rounded border-2 border-white bg-white flex items-center justify-center ${
              isLaunched ? "bg-white" : "bg-transparent"
            }`}
          >
            {isLaunched && (
              <svg
                className="w-3 h-3 text-primary-color"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="text-white">{isLaunched ? "Done!" : "Launch"}</div>
        </Button>
      </div>
    );
  }, [isLaunched, isExploding, directory._id, onToggleLaunched]);

  return (
    <Directory
      key={directory._id}
      directory={directory}
      buttonComponent={LaunchedButton}
    />
  );
};
