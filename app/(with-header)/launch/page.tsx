"use client";

import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronUp, Dot } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import scss from "./styles.module.scss";
import Link from "next/link";
import { LoginDialog } from "@/components/login-dialog";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface LaunchWeek {
  id: string;
  startDate: string;
  endDate: string;
  currentStartups: number;
  maxSlots: number;
  availableSlots: number;
  freeAvailable: boolean;
  premiumAvailable: boolean;
}

export default function LaunchPage() {
  const router = useRouter();
  const [nextLaunchWeek, setNextLaunchWeek] = useState<LaunchWeek | null>(null);
  const [countdownTarget, setCountdownTarget] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaunchWeeks = async () => {
      try {
        const response = await fetch("/api/launch-weeks");
        const result = await response.json();

        if (result.success && result.data) {
          const now = new Date();

          // Find the next launch week (startDate is in the future)
          const upcomingWeeks = result.data
            .filter((week: LaunchWeek) => new Date(week.startDate) > now)
            .sort(
              (a: LaunchWeek, b: LaunchWeek) =>
                new Date(a.startDate).getTime() -
                new Date(b.startDate).getTime(),
            );

          if (upcomingWeeks.length > 0) {
            const nextWeek = upcomingWeeks[0];
            setNextLaunchWeek(nextWeek);
            setCountdownTarget(new Date(nextWeek.startDate).getTime());
          } else {
            // If no upcoming weeks, set a fallback (24 hours from now)
            setCountdownTarget(now.getTime() + 24 * 3600 * 1000);
          }
        }
      } catch (error) {
        console.error("Error fetching launch weeks:", error);
        // Fallback to 24 hours from now
        setCountdownTarget(new Date().getTime() + 24 * 3600 * 1000);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunchWeeks();
  }, []);

  return (
    <div>
      <div className="border rounded-lg p-8 grid overflow-hidden grid-cols-1 sm:grid-cols-2 group">
        <div className="flex flex-col items-center sm:items-start ">
          <div className="text-3xl text-center sm:text-left font-medium mb-4">
            Don&#39;t forget
            <br /> to launch,
            <br /> everywhere!
          </div>
          <Link
            href="/collections"
            className={cn(
              buttonVariants({ variant: "default" }),
              "px-16 bg-primary-color hover:bg-primary-color/90 hover:scale-102 active:scale-95 transition-all duration-120",
            )}
          >
            Browse all
          </Link>
        </div>
        <div className="h-40 w-full relative">
          <div
            onClick={() => {
              router.push("/collections");
            }}
            className="h-50 bg-gradient-to-br from-white to-sky-50 border p-4 shadow-lg sm:-bottom-2 -bottom-6 group-hover:-bottom-0 group-hover:shadow-xl rounded-t-lg -right-0 relative transition-all duration-100"
          >
            <div className="flex gap-1.5 mb-2">
              <Image
                src="/star_icon.png"
                alt="star"
                width={20}
                height={20}
                draggable={false}
                className="select-none"
              />
              <span className="text-sm select-none font-semibold">
                Best directories 2025
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <Directory title="Product Hunt" bgColor="bg-orange-600" />
              <Directory title="Tiny Launch" bgColor="bg-rose-600" />
              <Directory title="Launch List" bgColor="bg-slate-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-2.5 my-4 flex-col-reverse gap-2 sm:flex-row">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold">Launching now</h1>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <div className="text-xs">
            {nextLaunchWeek ? "Next launch week in" : "Loading..."}
          </div>
          {!loading && countdownTarget > 0 && (
            <FlipClockCountdown
              to={countdownTarget}
              renderOnServer
              className={scss.flipclock}
            />
          )}
          {loading && (
            <div className="text-sm text-gray-500">Loading countdown...</div>
          )}
        </div>
      </div>

      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
      <Product />
      <h2 className="text-3xl font-semibold my-4 px-2.5">Last week winners</h2>
      <WinnerProduct place={1} />
      <WinnerProduct place={2} />
      <WinnerProduct place={3} />
    </div>
  );
}

// Rest of your components remain the same...
const Directory = ({
  title,
  bgColor = "bg-primary-color",
}: {
  title: string;
  bgColor?: string;
}) => {
  return (
    <div className="flex select-none justify-between gap-1.5 bg-white border p-1 pr-3 rounded-md">
      <div className="flex gap-1.5">
        <div
          className={`${bgColor} text-black font-extrabold p-2 size-10 border rounded-md grid place-items-center`}
        >
          <div className="relative">
            <div className="bg-white relative rounded-xs text-sm px-1 border border-black -rotate-6 z-10">
              {title[0]}
            </div>
            <div className="absolute size-full bg-black -left-0.5 top-0.5 rounded-xs -rotate-12" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs">Free</div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="grid place-items-center">
          <span className="font-bold h-[10px]">200k</span>
          <span className="text-[8px]">Views</span>
        </div>
        <div className="grid place-items-center">
          <span className="font-bold h-[10px]">96</span>
          <span className="text-[8px]">DR</span>
        </div>
      </div>
    </div>
  );
};

const WinnerProduct = ({ place }: { place: 1 | 2 | 3 }) => {
  return (
    <div className="relative rounded-lg p-2.5 flex gap-2 select-none">
      <div className="shrink-0 pt-1">
        <Image
          src="/logo.png"
          alt="logo"
          width={50}
          height={50}
          draggable={false}
          className="rounded"
        />
      </div>
      <div className="flex flex-col space-y-1">
        <div className="font-semibold">Flex</div>
        <div>The ultimate AI social media scheduling tool</div>
        <div className="flex text-xs items-center">
          <div>by Anton</div>
          <Dot size={16} className="text-gray-300" />
          <div>AI</div>
          <Dot size={16} className="text-gray-300" />
          <div>Directory</div>
        </div>
      </div>
      <Image
        src={getCupByPlace(place) || "/placeholder.svg"}
        alt="logo"
        width={50}
        height={50}
        draggable={false}
        className="rounded absolute -left-5 top-2 -rotate-10"
      />
      <Button
        variant="outline"
        className="size-12.5 ml-auto flex flex-col gap-0 hover:bg-background bg-transparent"
      >
        12
      </Button>
    </div>
  );
};

const FeaturedProduct = () => {
  return (
    <div className="border rounded-lg p-2.5 flex gap-2 select-none hover:bg-gray-100/50 cursor-pointer">
      <div className="shrink-0">
        <Image
          src="/logo.png"
          alt="logo"
          width={75}
          height={75}
          draggable={false}
          className="rounded"
        />
      </div>
      <div className="flex flex-col space-y-1 w-full">
        <div className="flex justify-between">
          <div className="font-semibold text-lg">Flex</div>
          <span className="text-xs py-1 px-2 rounded bg-primary-color/10 h-fit">
            Featured
          </span>
        </div>
        <div className="text-sm">
          The ultimate AI social media scheduling tool
        </div>
      </div>
    </div>
  );
};

const Product = () => {
  const { status } = useSession();
  const [upvoted, setUpvoted] = useState<boolean>(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);

  const isAuthenticated = status === "authenticated";

  const handleUpvoteClick = () => {
    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    setUpvoted(!upvoted);

    console.log("User is authenticated - add your upvote logic here");
  };

  return (
    <>
      <div className="rounded-lg p-2.5 flex gap-2 select-none hover:bg-gray-100/50">
        <div className="shrink-0 pt-1">
          <Image
            src="/logo.png"
            alt="logo"
            width={50}
            height={50}
            draggable={false}
            className="rounded"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <div className="font-semibold">Flex</div>
          <div>The ultimate AI social media scheduling tool</div>
          <div className="flex text-xs items-center">
            <div>by Anton</div>
            <Dot size={16} className="text-gray-300" />
            <div>AI</div>
            <Dot size={16} className="text-gray-300" />
            <div>Directory</div>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleUpvoteClick}
          className={cn(
            "cursor-pointer size-12.5 ml-auto active:scale-90 flex flex-col gap-0 transition-all duration-120",
            upvoted
              ? "border-primary-color text-primary-color hover:text-primary-color"
              : "",
          )}
        >
          <ChevronUp strokeWidth={2} />
          12
        </Button>
      </div>
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

const getCupByPlace = (place: 1 | 2 | 3): string => {
  switch (place) {
    case 1:
      return "/golden_cup.png";
    case 2:
      return "/silver_cup.png";
    case 3:
      return "/bronze_cup.png";
  }
};
