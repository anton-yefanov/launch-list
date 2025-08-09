"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronUp, Dot, Plus, Rocket } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import scss from "./styles.module.scss";
import Link from "next/link";
import { LoginDialog } from "@/components/login-dialog";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";

interface LaunchWeek {
  id: string;
  startDate: string;
  endDate: string;
  maxSlots: number;
}

interface Startup {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logo: string;
  websiteUrl: string;
  submittedBy: string;
  twitterUsername?: string;
  upvoterIds: string[];
  categories: string[];
  submittedAt: string;
}

interface Winner extends Startup {
  place: number;
}

// Helper function to calculate rankings with ties
const calculateRankings = (startups: Startup[]): Winner[] => {
  // Sort by upvoterIds length in descending order
  const sorted = [...startups].sort(
    (a, b) => b.upvoterIds.length - a.upvoterIds.length,
  );

  const winners: Winner[] = [];
  let currentPlace = 1;
  let previousUpvotes: number | null = null;

  for (const startup of sorted) {
    const upvoteCount = startup.upvoterIds.length;
    // If this startup has different upvotes than the previous one, increment place
    if (previousUpvotes !== null && upvoteCount !== previousUpvotes) {
      currentPlace++;
    }

    winners.push({
      ...startup,
      place: currentPlace,
    });

    previousUpvotes = upvoteCount;
  }

  return winners;
};

export default function LaunchPage() {
  const [launchData, setLaunchData] = useState<{
    nextLaunchWeek: LaunchWeek | null;
    countdownTarget: number;
  }>({
    nextLaunchWeek: null,
    countdownTarget: 0,
  });

  const [loading, setLoading] = useState(true);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [lastWeekStartups, setLastWeekStartups] = useState<Winner[]>([]);

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

          // Calculate rankings for last week's startups
          const rankedLastWeek = lastWeekData
            ? calculateRankings(lastWeekData)
            : [];
          setLastWeekStartups(rankedLastWeek);

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
      {/*<div className="border bg-sky-50/10 rounded-lg p-8 grid overflow-hidden grid-cols-1 sm:grid-cols-2 group relative">*/}
      {/*  <div*/}
      {/*    className="absolute inset-0 opacity-30"*/}
      {/*    style={{*/}
      {/*      backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)`,*/}
      {/*      backgroundSize: "20px 20px",*/}
      {/*    }}*/}
      {/*  />*/}
      {/*  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-white/40" />*/}

      {/*  <div className="flex flex-col items-center sm:items-start relative z-10">*/}
      {/*    <div className="text-3xl text-center sm:text-left font-medium mb-4">*/}
      {/*      Don&#39;t forget*/}
      {/*      <br /> to launch*/}
      {/*      <br /> <b>everywhere!</b>*/}
      {/*    </div>*/}
      {/*    <Link*/}
      {/*      href="/websites"*/}
      {/*      className={cn(*/}
      {/*        buttonVariants({ variant: "default" }),*/}
      {/*        "px-16 bg-primary-color hover:bg-primary-color/90 hover:scale-102 active:scale-95 transition-all duration-120",*/}
      {/*      )}*/}
      {/*    >*/}
      {/*      Browse all*/}
      {/*    </Link>*/}
      {/*  </div>*/}
      {/*  <div className="h-40 w-full relative z-10">*/}
      {/*    <div*/}
      {/*      onClick={() => {*/}
      {/*        router.push("/websites");*/}
      {/*      }}*/}
      {/*      className="h-50 bg-gradient-to-br from-white to-sky-100/80 border p-4 shadow-lg sm:-bottom-2 -bottom-6 group-hover:-bottom-0 group-hover:shadow-xl rounded-t-lg -right-0 relative transition-all duration-100"*/}
      {/*    >*/}
      {/*      <div className="flex gap-1.5 mb-2">*/}
      {/*        <div className="shrink-0">*/}
      {/*          <Image*/}
      {/*            src="/star_icon.png"*/}
      {/*            alt="star"*/}
      {/*            width={20}*/}
      {/*            height={20}*/}
      {/*            draggable={false}*/}
      {/*            className="select-none"*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*        <span className="text-sm select-none font-semibold">*/}
      {/*          Best websites to launch in 2025*/}
      {/*        </span>*/}
      {/*      </div>*/}
      {/*      <div className="flex flex-col gap-1">*/}
      {/*        <Directory*/}
      {/*          title="Product Hunt"*/}
      {/*          viewsPerMonth={500000}*/}
      {/*          domainRating={91}*/}
      {/*          bgColor="bg-rose-600"*/}
      {/*          benefits={["Free", "High authority"]}*/}
      {/*        />*/}
      {/*        <Directory*/}
      {/*          title="Y Combinator"*/}
      {/*          viewsPerMonth={1000000}*/}
      {/*          domainRating={89}*/}
      {/*          bgColor="bg-orange-600"*/}
      {/*          benefits={["Free", "Tech audience"]}*/}
      {/*        />*/}
      {/*        <Directory*/}
      {/*          title="DevPost"*/}
      {/*          viewsPerMonth={100000}*/}
      {/*          domainRating={86}*/}
      {/*          bgColor="bg-slate-600"*/}
      {/*          benefits={["Free", "Small startups"]}*/}
      {/*        />*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <HeroBanner />
      <div className="flex justify-between items-center px-2.5 my-4 flex-col-reverse gap-2 sm:flex-row">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold">Launching now</h1>
        </div>
        <div className="flex flex-col gap-2 items-center">
          {loading ? (
            <Skeleton className="w-[108px] h-[16px]" />
          ) : (
            <div className="text-xs">Next launch week in</div>
          )}

          {loading ? (
            <Skeleton className="w-[245px] h-[54px]" />
          ) : (
            <FlipClockCountdown
              to={launchData.countdownTarget}
              renderOnServer
              className={scss.flipclock}
            />
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
        <div className="flex flex-col gap-2">
          {startups.map((startup) => (
            <Product key={startup.id} startup={startup} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
      {!loading && lastWeekStartups.length > 0 && (
        <>
          <h2 className="text-3xl font-semibold my-8 px-2.5">
            Last week winners
          </h2>
          <div className="flex flex-col gap-2">
            {lastWeekStartups.map((winner) => (
              <WinnerProduct
                key={winner.id}
                winner={winner}
                showCup={winner.place <= 3}
              />
            ))}
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}

const WinnerProduct = ({
  winner,
  showCup,
}: {
  winner: Winner;
  showCup: boolean;
}) => {
  return (
    <Link
      href={`/product/${winner.slug}`}
      className="hover:bg-sidebar relative rounded-lg p-2.5 flex gap-4 select-none"
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
      <div className="flex flex-col">
        <div className="font-semibold">{winner.name}</div>
        <div>{winner.tagline}</div>
        <div className="flex text-xs items-center flex-wrap mt-1">
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
          src={
            winner.place === 1
              ? "/golden_cup.png"
              : winner.place === 2
                ? "/silver_cup.png"
                : "/bronze_cup.png"
          }
          alt={`${winner.place} place cup`}
          width={30}
          height={30}
          draggable={false}
          className="rounded absolute -left-1 top-6 -rotate-10"
        />
      )}
      <Button
        variant="outline"
        className="size-12.5 ml-auto flex flex-col gap-0 hover:bg-background"
      >
        {winner.upvoterIds.length}
      </Button>
    </Link>
  );
};

const Product = ({ startup }: { startup: Startup }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);
  const [currentUpvoterIds, setCurrentUpvoterIds] = useState<string[]>(
    startup.upvoterIds || [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = status === "authenticated";

  // Derive upvote count from upvoterIds
  const currentUpvotes = currentUpvoterIds.length;

  // Check if current user has upvoted using useMemo for performance
  const upvoted = useMemo(() => {
    if (!isAuthenticated || !session?.user?.id) return false;
    return currentUpvoterIds.includes(session.user.id);
  }, [currentUpvoterIds, isAuthenticated, session?.user?.id]);

  const handleUpvoteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the row click

    if (!isAuthenticated) {
      setLoginDialogOpen(true);
      return;
    }

    if (isLoading || !session?.user?.id) return; // Prevent multiple clicks

    setIsLoading(true);

    // Optimistic update
    const userId = session.user.id;
    const newUpvoted = !upvoted;
    const newUpvoterIds = newUpvoted
      ? [...currentUpvoterIds, userId]
      : currentUpvoterIds.filter((id) => id !== userId);

    setCurrentUpvoterIds(newUpvoterIds);

    try {
      const response = await fetch(`/api/product/${startup.slug}/upvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        // If your upvote API returns the updated upvoter IDs, use them
        // Otherwise, keep the optimistic update
        if (result.data.upvoterIds) {
          setCurrentUpvoterIds(result.data.upvoterIds);
        }
      } else {
        // Revert optimistic update on error
        setCurrentUpvoterIds(startup.upvoterIds || []);
        console.error("Error upvoting:", result.error);
      }
    } catch (error) {
      // Revert optimistic update on error
      setCurrentUpvoterIds(startup.upvoterIds || []);
      console.error("Error upvoting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = () => {
    router.push(`/product/${startup.slug}`);
  };

  return (
    <>
      <div
        className="rounded-lg p-2.5 flex gap-4 select-none hover:bg-gray-100/50 cursor-pointer transition-colors"
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
        <div className="flex flex-col">
          <div className="font-semibold">{startup.name}</div>
          <div>{startup.tagline}</div>
          <div className="flex text-xs items-center flex-wrap mt-1">
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

const EmptyState = () => {
  const { status } = useSession();
  const isAuth = status === "authenticated";

  return (
    <div className="flex flex-col justify-center items-center text-center py-10">
      <Rocket size={60} className="mb-4 text-gray-500" />
      <p className="mb-4 text-gray-500">No startups launching this week, yet</p>
      <Button
        variant="outline"
        onClick={() =>
          (window.location.href = isAuth ? "/submit/product" : "/login")
        }
        className={cn("active:scale-95 transition-all duration-100")}
      >
        <Plus />
        Be the first to launch!
      </Button>
    </div>
  );
};

const HeroBanner = () => {
  const { status } = useSession();
  const isAuth = status === "authenticated";

  // Typewriter animation state
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const words = ["traffic", "backlink", "feedback"];

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    const animate = () => {
      const currentWord = words[currentWordIndex];

      if (isDeleting) {
        // Deleting phase
        if (displayText.length > 0) {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
          timeout = setTimeout(animate, 50); // Faster deletion
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setIsTyping(true);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        // Typing phase
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
          timeout = setTimeout(animate, 100); // Normal typing speed
        } else {
          // Finished typing, wait then start deleting
          setIsTyping(false);
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, 2000); // Pause before deleting
        }
      }
    };

    timeout = setTimeout(animate, isDeleting ? 50 : 100);

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      if (timeout) clearTimeout(timeout);
      if (cursorInterval) clearInterval(cursorInterval);
    };
  }, [currentWordIndex, displayText, isDeleting, isTyping, words]);

  return (
    <div className="select-none rounded-2xl shadow-none text-center py-10 px-10 bg-gradient-to-b from-[#00449D] to-[#2FB2FF] relative overflow-hidden">
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Content with relative positioning to appear above dots */}
      <div className="relative z-10">
        <Image
          src="/logo_clear.svg"
          alt="logo"
          width={50}
          height={50}
          draggable={false}
          className="rounded mx-auto mb-6"
        />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Launch your Product Today
        </h1>
        <h2 className="text-lg sm:text-2xl font-bold text-white">
          Get free{" "}
          <span className="inline-block min-w-[85px] sm:min-w-[110px]">
            <span className="text-white">{displayText}</span>
            <span
              className={`inline-block w-0.5 h-4 bg-white ml-1 ${
                showCursor ? "opacity-100" : "opacity-0"
              } transition-opacity duration-200`}
            />
          </span>{" "}
          for Your Website
        </h2>
        <div className="w-full flex flex-col gap-3 mt-10 px-2 sm:px-34">
          <Button
            variant="outline"
            onClick={() => {
              window.location.href = isAuth ? "/submit/product" : "/login";
            }}
            className="cursor-pointer flex-1 hover:scale-102 transition-all duration-100 active:scale-98"
          >
            Submit to Launch List
            <Image
              src="/logo_clear.svg"
              alt="logo"
              width={20}
              height={20}
              draggable={false}
              className="rounded"
            />
          </Button>
          <Link
            href="/websites"
            className="text-sm hover:underline w-fit text-white mx-auto"
          >
            Explore launch websites
          </Link>
        </div>
      </div>
    </div>
  );
};
