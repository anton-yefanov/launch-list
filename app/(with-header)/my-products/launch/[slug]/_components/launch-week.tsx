"use client";

import { useState, useRef } from "react";
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
import { Check, Loader2, Copy, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LaunchWeekData } from "../page";
import { toast } from "sonner";
import Image from "next/image";
import ConfettiExplosion from "react-confetti-explosion";

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
];

interface BadgeSectionProps {
  slug: string;
}

const BadgeSection = ({ slug }: BadgeSectionProps) => {
  const [copied, setCopied] = useState(false);

  const embedCode = `<a style={{display: "block", width: "fit-content"}}
   href="${process.env.NEXT_PUBLIC_URL}/product/${slug}"
   target="_blank">
  <img style={{height: "50px"}}
       src="${process.env.NEXT_PUBLIC_URL}/badges/svg/launch_list_badge_live.svg"
       alt="Launch List Badge" />
</a>`;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      toast.success("Badge code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy code");
    }
  };

  return (
    <div className="rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-6 justify-between">
        <div>
          <h4 className="flex items-center gap-2 mb-2 font-medium text-2xl">
            <Lock /> Secure <b>dofollow</b> backlink
          </h4>
          <p className="text-muted-foreground text-lg">
            Add our badge to your website. Even if you don&#39;t end up in top
            3, your website will <b>still receive dofollow backlink</b> from
            Launch List
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Image
            src="/badges/svg/launch_list_badge_live.svg"
            alt="Live now badge"
            width={180}
            height={57}
          />
          <Button
            onClick={handleCopy}
            variant="outline"
            className="w-full min-w-[180px]"
            type="button"
          >
            {copied ? (
              <>
                <Check size={14} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy badge code
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface LaunchWeekProps {
  launchWeekData: LaunchWeekData;
  onLaunchSuccess?: () => void;
}

const LaunchWeek = ({ launchWeekData, onLaunchSuccess }: LaunchWeekProps) => {
  const [open, setOpen] = useState(false);
  const [congratsOpen, setCongratsOpen] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const showConfettiRef = useRef(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const isMobile = useMobile();
  const params = useParams();
  const router = useRouter();

  const slug = params.slug as string;

  const handleLaunch = async (launchType: "free" | "premium") => {
    if (launchType === "premium") {
      toast.error("Premium launch is not available yet");
      return;
    }

    setIsLaunching(true);

    // Use ref to control confetti without re-render
    showConfettiRef.current = true;
    setConfettiKey((prev) => prev + 1); // Trigger confetti component re-render

    // Hide confetti after 3 seconds
    setTimeout(() => {
      showConfettiRef.current = false;
    }, 3000);

    try {
      const response = await fetch("/api/launch-weeks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          launchWeekId: launchWeekData.id,
          launchType,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setOpen(false);
        setCongratsOpen(true);
        onLaunchSuccess?.();
      } else {
        toast.error(result.error || "Failed to launch product");
      }
    } catch (error) {
      console.error("Error launching startup:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLaunching(false);
    }
  };

  const handleCongratsClose = () => {
    setCongratsOpen(false);
    showConfettiRef.current = false;
    router.push("/my-products");
  };

  const handleShare = () => {
    const productUrl = `${process.env.NEXT_PUBLIC_URL || "https://launchlist.co"}/product/${slug}`;
    const tweetText = `My product is live on @LaunchList_\n\n${productUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    window.open(twitterUrl, "_blank");
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
      </div>
    </div>
  );

  const CongratsDialog = () => (
    <>
      {showConfettiRef.current && (
        <>
          <div
            key={`center-${confettiKey}`}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-[60]"
          >
            <ConfettiExplosion
              force={0.8}
              duration={3000}
              particleCount={50}
              width={1600}
              height={1200}
            />
          </div>
          <div
            key={`top-left-${confettiKey}`}
            className="fixed top-20 left-20 pointer-events-none z-[60]"
          >
            <ConfettiExplosion
              force={0.6}
              duration={2500}
              particleCount={50}
              width={800}
              height={600}
            />
          </div>
          <div
            key={`top-right-${confettiKey}`}
            className="fixed top-20 right-20 pointer-events-none z-[60]"
          >
            <ConfettiExplosion
              force={0.6}
              duration={2500}
              particleCount={50}
              width={800}
              height={600}
            />
          </div>
          <div
            key={`bottom-left-${confettiKey}`}
            className="fixed bottom-20 left-20 pointer-events-none z-[60]"
          >
            <ConfettiExplosion
              force={0.6}
              duration={2500}
              particleCount={50}
              width={800}
              height={600}
            />
          </div>
          <div
            key={`bottom-right-${confettiKey}`}
            className="fixed bottom-20 right-20 pointer-events-none z-[60]"
          >
            <ConfettiExplosion
              force={0.6}
              duration={2500}
              particleCount={50}
              width={800}
              height={600}
            />
          </div>
        </>
      )}

      <Dialog open={congratsOpen} onOpenChange={handleCongratsClose}>
        <DialogContent>
          <DialogHeader className="text-center">
            <DialogTitle className="text-3xl text-center">
              It&#39;s Launched! 🎉
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <BadgeSection slug={slug} />
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleShare}
                className="flex-1 bg-primary-color hover:bg-primary-color/90"
              >
                Share on 𝕏
              </Button>
              <Button
                onClick={handleCongratsClose}
                variant="outline"
                className="flex-1 "
              >
                Go to My Products
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );

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
        <CongratsDialog />
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
      <CongratsDialog />
    </>
  );
};

export default LaunchWeek;
