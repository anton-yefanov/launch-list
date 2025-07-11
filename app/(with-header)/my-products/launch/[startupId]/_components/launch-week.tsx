"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMobile } from "@/hooks/use-mobile";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LaunchWeekData } from "../page";
import { toast } from "sonner";

type LaunchOption = { id: string; title: string; benefits: string[] };

const LAUNCH_OPTIONS: LaunchOption[] = [
  {
    id: "free",
    title: "Free Launch",
    benefits: [
      "Your website on homepage for a week",
      "A backlink for your website",
      "Free traffic on your project",
    ],
  },
  // {
  //   id: "premium",
  //   title: "Premium Launch",
  //   benefits: [
  //     "Skip queue",
  //     "Your website on homepage for a week",
  //     "Badge for your website",
  //     "High authority backlink, guaranteed",
  //   ],
  // },
];

interface LaunchWeekProps {
  launchWeekData: LaunchWeekData;
  onLaunchSuccess?: () => void;
}

const LaunchWeek = ({ launchWeekData, onLaunchSuccess }: LaunchWeekProps) => {
  const [open, setOpen] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const isMobile = useMobile();
  const params = useParams();
  const router = useRouter();

  const startupId = params.startupId as string;

  const handleLaunch = async (launchType: "free" | "premium") => {
    if (launchType === "premium") {
      toast.error("Premium launch is not available yet");
      return;
    }

    setIsLaunching(true);

    try {
      const response = await fetch("/api/launch-weeks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startupId,
          launchWeekId: launchWeekData.id,
          launchType,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Successfully launched your startup!");
        setOpen(false);
        onLaunchSuccess?.();
        // Redirect to home page instead of launch-success
        router.push("/");
      } else {
        toast.error(result.error || "Failed to launch startup");
      }
    } catch (error) {
      console.error("Error launching startup:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLaunching(false);
    }
  };

  // Handle immediate free launch on click
  const handleTriggerClick = () => {
    if (!launchWeekData.freeAvailable) {
      toast.error("Free launch is not available for this week");
      return;
    }

    handleLaunch("free");
  };

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const dateRange = `${formatDate(launchWeekData.startDate)} - ${formatDate(launchWeekData.endDate)}`;

  const LaunchCard = ({
    option,
    className = "",
  }: {
    option: LaunchOption;
    className?: string;
  }) => {
    const isAvailable =
      option.id === "free"
        ? launchWeekData.freeAvailable
        : launchWeekData.premiumAvailable;

    const isFreeLaunch = option.id === "free";

    return (
      <div
        className={`flex flex-col justify-between border rounded-lg p-4 ${
          !isAvailable ? "opacity-50" : ""
        } ${className}`}
      >
        <div>
          <div className="font-medium text-xl mb-2">{option.title}</div>
          <div className="text-sm mb-2">What you get:</div>
          <ul className={isMobile ? "mb-4" : ""}>
            {option.benefits.map((benefit, index) => (
              <li
                key={index}
                className="flex items-center gap-1.5 text-sm justify-start mb-1"
              >
                <Check size={16} className="shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <Button
          className="mt-auto w-full hover:scale-101 transition-all duration-100 active:scale-99"
          disabled={!isAvailable || isLaunching}
          onClick={() => handleLaunch(option.id as "free" | "premium")}
        >
          {isLaunching && isFreeLaunch ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Launching...
            </>
          ) : isAvailable ? (
            "Select"
          ) : (
            "Not Available"
          )}
        </Button>
      </div>
    );
  };

  const LaunchOptions = () => {
    if (isMobile) {
      return (
        <div className="space-y-4">
          {LAUNCH_OPTIONS.map((option) => (
            <LaunchCard key={option.id} option={option} />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {LAUNCH_OPTIONS.map((option) => (
          <LaunchCard key={option.id} option={option} className="h-80" />
        ))}
      </div>
    );
  };

  const LaunchTrigger = () => (
    <div
      className={`flex justify-between p-4 border hover:border-gray-300 rounded-md select-none cursor-pointer hover:scale-101 transition-all duration-100 active:scale-99 ${
        isLaunching ? "opacity-50 pointer-events-none" : ""
      }`}
      onClick={handleTriggerClick}
    >
      <div>{dateRange}</div>
      <div className="flex items-center gap-3">
        {isLaunching ? (
          <div className="text-sm font-medium text-blue-400 bg-blue-100 px-2 rounded flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Launching...
          </div>
        ) : launchWeekData.freeAvailable ? (
          <div className="text-sm font-medium text-green-400 bg-green-100 px-2 rounded">
            Free slots available
          </div>
        ) : (
          <div className="text-sm font-medium text-red-400 bg-red-100 px-2 rounded">
            Free full
          </div>
        )}
        {/*<Separator orientation="vertical" />*/}
        {/*<div className="text-sm font-medium text-amber-400 bg-amber-100/60 px-2 rounded">*/}
        {/*  Premium available*/}
        {/*</div>*/}
      </div>
    </div>
  );

  // Since we're handling launch immediately, we don't need the dialog/drawer anymore
  // But keeping the components in case you want to revert or use them elsewhere
  if (isMobile) {
    return (
      <>
        <LaunchTrigger />
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="max-h-[90vh] overflow-hidden">
            <DrawerHeader className="flex-shrink-0">
              <DrawerTitle>Choose Your Launch Option - {dateRange}</DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <LaunchOptions />
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      <LaunchTrigger />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Your Launch Option - {dateRange}</DialogTitle>
          </DialogHeader>
          <LaunchOptions />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LaunchWeek;
