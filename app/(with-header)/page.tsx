"use client";

import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronUp, Dot, Plus, Rocket } from "lucide-react";
import { useState, useEffect, Fragment } from "react";
import { cn } from "@/lib/utils";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import scss from "./styles.module.scss";
import Link from "next/link";
import { LoginDialog } from "@/components/login-dialog";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Footer } from "@/components/footer";
import { formatNumber } from "@/lib/formatNumber";

interface LaunchWeek {
  id: string;
  startDate: string;
  endDate: string;
  maxSlots: number;
}

interface Startup {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  websiteUrl: string;
  submittedBy: string;
  twitterUsername?: string;
  upvotes: number;
  categories: string[];
  submittedAt: string;
}

interface Winner extends Startup {
  place: 1 | 2 | 3;
}

export default function LaunchPage() {
  const router = useRouter();

  const [launchData, setLaunchData] = useState<{
    nextLaunchWeek: LaunchWeek | null;
    countdownTarget: number;
  }>({
    nextLaunchWeek: null,
    countdownTarget: 0,
  });

  const [loading, setLoading] = useState(true);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [lastWeekStartups, setLastWeekStartups] = useState<Startup[]>([]);
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAuth = status === "authenticated";

  useEffect(() => {
    const fetchLaunchData = async () => {
      try {
        const response = await fetch("/api/launches");
        const result = await response.json();

        if (result.success && result.data) {
          const {
            nextLaunchWeek,
            startups: currentStartups,
            lastWeekStartups: lastWeekData,
          } = result.data;

          setStartups(currentStartups || []);
          setLastWeekStartups(lastWeekData || []);

          if (nextLaunchWeek) {
            setLaunchData({
              nextLaunchWeek,
              countdownTarget: new Date(nextLaunchWeek.startDate).getTime(),
            });
          } else {
            const fallbackTime = new Date().getTime() + 24 * 3600 * 1000;
            setLaunchData({
              nextLaunchWeek: null,
              countdownTarget: fallbackTime,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching launch data:", error);
        const fallbackTime = new Date().getTime() + 24 * 3600 * 1000;
        setLaunchData({
          nextLaunchWeek: null,
          countdownTarget: fallbackTime,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLaunchData();
  }, []);

  return (
    <div>
      {/*<FeaturedSection />*/}
      <div className="border rounded-lg p-8 grid overflow-hidden grid-cols-1 sm:grid-cols-2 group">
        <div className="flex flex-col items-center sm:items-start ">
          <div className="text-3xl text-center sm:text-left font-medium mb-4">
            Don&#39;t forget
            <br /> to launch,
            <br /> everywhere!
          </div>
          <Link
            href="/websites"
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
              router.push("/websites");
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
              <Directory
                title="Product Hunt"
                viewsPerMonth={500000}
                domainRating={91}
                bgColor="bg-rose-600"
                benefits={["Free", "High authority"]}
              />
              <Directory
                title="Y Combinator"
                viewsPerMonth={1000000}
                domainRating={89}
                bgColor="bg-orange-600"
                benefits={["Free", "Tech audience"]}
              />
              <Directory
                title="DevPost"
                viewsPerMonth={100000}
                domainRating={86}
                bgColor="bg-slate-600"
                benefits={["Free", "Small startups"]}
              />
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
            {launchData.nextLaunchWeek ? "Next launch week in" : "Loading..."}
          </div>
          {!loading && launchData.countdownTarget > 0 && (
            <FlipClockCountdown
              to={launchData.countdownTarget}
              renderOnServer
              className={scss.flipclock}
            />
          )}
          {loading && (
            <div className="text-sm text-gray-500">Loading countdown...</div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-lg p-2.5 flex gap-2 animate-pulse">
              <div className="shrink-0 pt-1">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
              </div>
              <div className="flex flex-col space-y-1 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : startups.length > 0 ? (
        startups.map((startup) => (
          <Product key={startup.id} startup={startup} />
        ))
      ) : (
        <div className="flex flex-col justify-center items-center text-center py-10 text-gray-500">
          <Rocket size={60} className="mb-4" />
          <p className="mb-4">No startups launching this week, yet</p>
          <Link
            href={
              isAuth
                ? `https://tally.so/r/nW6pYJ?email=${user?.email}&redirect=${process.env.NEXT_PUBLIC_URL}/my-products`
                : "/login"
            }
            target={isAuth ? "_blank" : "_self"}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "text-black active:scale-97 transition-all duration-100",
            )}
          >
            <Plus />
            Be the first to launch!
          </Link>
        </div>
      )}

      {!loading && lastWeekStartups.length > 0 && (
        <>
          <h2 className="text-3xl font-semibold my-4 px-2.5">
            Last week winners
          </h2>
          {lastWeekStartups.map((startup, index) => (
            <WinnerProduct
              key={startup.id}
              winner={{ ...startup, place: (index + 1) as 1 | 2 | 3 }}
              showCup={index < 3}
            />
          ))}
        </>
      )}
      <Footer />
    </div>
  );
}

const Directory = ({
  title,
  viewsPerMonth,
  domainRating,
  bgColor = "bg-primary-color",
  benefits,
}: {
  title: string;
  viewsPerMonth: number;
  domainRating: number;
  bgColor?: string;
  benefits: string[];
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
          <div className="flex items-center">
            {benefits.map((b, i) => (
              <Fragment key={i}>
                <div className="text-xs">{b}</div>
                {i !== benefits.length - 1 && <Dot size={12} />}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="grid place-items-center">
          <span className="font-bold h-[10px]">
            {formatNumber(viewsPerMonth)}
          </span>
          <span className="text-[8px]">Views</span>
        </div>
        <div className="grid place-items-center">
          <span className="font-bold h-[10px]">{domainRating}</span>
          <span className="text-[8px]">DR</span>
        </div>
      </div>
    </div>
  );
};

const WinnerProduct = ({
  winner,
  showCup,
}: {
  winner: Winner;
  showCup: boolean;
}) => {
  return (
    <Link
      href={`/product/${winner.id}`}
      className="hover:bg-sidebar relative rounded-lg p-2.5 flex gap-2 select-none"
    >
      <div className="shrink-0">
        <Image
          src={winner.logo}
          alt={`${winner.name} logo`}
          width={50}
          height={50}
          draggable={false}
          className="rounded"
        />
      </div>
      <div className="flex flex-col space-y-1">
        <div className="font-semibold">{winner.name}</div>
        <div>{winner.tagline}</div>
        <div className="flex text-xs items-center">
          <div>by {winner.submittedBy}</div>
          {winner.categories.map((category, index) => (
            <span key={index} className="flex">
              <Dot size={16} className="text-gray-300" />
              <span>{category}</span>
            </span>
          ))}
        </div>
      </div>
      {showCup && (
        <Image
          src={getCupByPlace(winner.place)}
          alt={`${winner.place} place cup`}
          width={50}
          height={50}
          draggable={false}
          className="rounded absolute -left-5 top-2 -rotate-10"
        />
      )}
      <Button
        variant="outline"
        className="size-12.5 ml-auto flex flex-col gap-0 cursor-default hover:bg-background bg-transparent"
      >
        {winner.upvotes}
      </Button>
    </Link>
  );
};

const Product = ({ startup }: { startup: Startup }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [upvoted, setUpvoted] = useState<boolean>(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);
  const [currentUpvotes, setCurrentUpvotes] = useState(startup.upvotes);
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = status === "authenticated";

  // Check if user has upvoted this startup when component mounts
  useEffect(() => {
    const checkUpvoteStatus = async () => {
      if (!isAuthenticated || !session?.user?.id) return;

      try {
        const response = await fetch(`/api/product/${startup.id}/upvote`);
        const result = await response.json();

        if (result.success) {
          setUpvoted(result.data.hasUpvoted);
          setCurrentUpvotes(result.data.upvoteCount);
        }
      } catch (error) {
        console.error("Error checking upvote status:", error);
      }
    };

    checkUpvoteStatus();
  }, [startup.id, isAuthenticated, session?.user?.id]);

  const handleUpvoteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the row click

    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    if (isLoading) return; // Prevent multiple clicks

    setIsLoading(true);

    // Optimistic update
    const newUpvoted = !upvoted;
    const newCount = newUpvoted ? currentUpvotes + 1 : currentUpvotes - 1;

    setUpvoted(newUpvoted);
    setCurrentUpvotes(newCount);

    try {
      const response = await fetch(`/api/product/${startup.id}/upvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        // Update with actual values from server
        setUpvoted(result.data.hasUpvoted);
        setCurrentUpvotes(result.data.upvoteCount);
      } else {
        // Revert optimistic update on error
        setUpvoted(!newUpvoted);
        setCurrentUpvotes(currentUpvotes);
        console.error("Error upvoting:", result.error);
      }
    } catch (error) {
      // Revert optimistic update on error
      setUpvoted(!newUpvoted);
      setCurrentUpvotes(currentUpvotes);
      console.error("Error upvoting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = () => {
    router.push(`/product/${startup.id}`);
  };

  return (
    <>
      <div
        className="rounded-lg p-2.5 flex gap-2 select-none hover:bg-gray-100/50 cursor-pointer transition-colors"
        onClick={handleRowClick}
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
        <div className="flex flex-col space-y-1">
          <div className="font-semibold">{startup.name}</div>
          <div>{startup.tagline}</div>
          <div className="flex text-xs items-center">
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
