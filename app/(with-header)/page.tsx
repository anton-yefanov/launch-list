import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import scss from "./styles.module.scss";
import { Footer } from "@/components/footer";
import { HeroBanner } from "@/app/(with-header)/_components/hero-banner";
import { EmptyState } from "@/app/(with-header)/_components/empty-state";
import { Product } from "@/app/(with-header)/_components/product";
import { WinnerProduct } from "@/app/(with-header)/_components/winner-product";
import { CountdownTimer } from "@/app/(with-header)/_components/countdown-timer";

export interface Startup {
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

export interface Winner extends Startup {
  place: number;
}

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

async function fetchLaunchData() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/launches`,
      { cache: "no-store" },
    );

    const result = await response.json();

    if (result.success && result.data) {
      const {
        nextLaunchWeek,
        startups: currentStartups,
        lastWeekStartups: lastWeekData,
      } = result.data;

      // Calculate rankings for last week's startups
      const rankedLastWeek = lastWeekData
        ? calculateRankings(lastWeekData)
        : [];

      const countdownTarget = nextLaunchWeek
        ? new Date(nextLaunchWeek.startDate).getTime()
        : new Date().getTime() + 24 * 3600 * 1000;

      return {
        nextLaunchWeek,
        startups: currentStartups || [],
        lastWeekStartups: rankedLastWeek,
        countdownTarget,
      };
    }

    throw new Error("Invalid response data");
  } catch (error) {
    console.error("Error fetching launch data:", error);

    // Return fallback data
    return {
      nextLaunchWeek: null,
      startups: [],
      lastWeekStartups: [],
      countdownTarget: new Date().getTime() + 24 * 3600 * 1000,
    };
  }
}

export default async function LaunchPage() {
  const { startups, lastWeekStartups, countdownTarget } =
    await fetchLaunchData();

  return (
    <div>
      <HeroBanner />
      <div className="flex justify-between items-center px-2.5 my-4 flex-col-reverse gap-2 sm:flex-row">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold">Launching now</h1>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <div className="text-xs">Next launch week in</div>
          <CountdownTimer
            targetTime={countdownTarget}
            className={scss.flipclock}
          />
        </div>
      </div>
      {startups.length > 0 ? (
        <div className="flex flex-col gap-2">
          {startups.map((startup: Startup) => (
            <Product key={startup.id} startup={startup} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
      {lastWeekStartups.length > 0 && (
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
