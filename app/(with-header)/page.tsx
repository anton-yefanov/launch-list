import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import scss from "./styles.module.scss";
import { Footer } from "@/components/footer";
import { HeroBanner } from "@/app/(with-header)/_components/hero-banner";
import { EmptyState } from "@/app/(with-header)/_components/empty-state";
import { Product } from "@/app/(with-header)/_components/product";
import { WinnerProduct } from "@/app/(with-header)/_components/winner-product";
import { CountdownTimer } from "@/app/(with-header)/_components/countdown-timer";
import { Metadata } from "next";

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

async function fetchLaunchData() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/launches`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch launch data");
    }

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

export async function generateMetadata(): Promise<Metadata> {
  const title =
    "Launch List - Launch Your Product on Product Hunt and 100+ websites";

  const description =
    "A launch platform for your startup. Discover and vote for innovative startups launching weekly.";

  const keywords = [
    "startup launch",
    "new startups",
    "startup voting",
    "product launch",
    "entrepreneur",
    "innovation",
    "startup community",
    "product hunt",
  ].join(", ");

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Startup Launch Platform" }],
    creator: "Startup Launch Platform",
    publisher: "Startup Launch Platform",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: process.env.NEXT_PUBLIC_URL,
    },
    other: {
      "application-name": "Launch List - Startup Launch Platform",
    },
  };
}

export const dynamic = "force-dynamic";

export default async function LaunchPage() {
  const { startups, lastWeekStartups, countdownTarget } =
    await fetchLaunchData();

  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Startup Launch Platform - Launch List",
    description: "Discover and vote for innovative startups launching weekly",
    url: process.env.NEXT_PUBLIC_URL,
    mainEntity: {
      "@type": "ItemList",
      name: "Current Startup Launches",
      numberOfItems: startups.length,
      itemListElement: startups.map((startup: Startup, index: number) => ({
        "@type": "Organization",
        position: index + 1,
        name: startup.name,
        description: startup.tagline,
        url: startup.websiteUrl,
        logo: startup.logo,
        foundingDate: startup.submittedAt,
        category: startup.categories.join(", "),
        aggregateRating:
          startup.upvoterIds.length > 0
            ? {
                "@type": "AggregateRating",
                ratingValue: Math.min(
                  5,
                  Math.max(1, startup.upvoterIds.length / 10),
                ),
                reviewCount: startup.upvoterIds.length,
                bestRating: 5,
                worstRating: 1,
              }
            : undefined,
      })),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: process.env.NEXT_PUBLIC_URL,
        },
      ],
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        {/*<ServiceBanner />*/}
        <HeroBanner />

        {/* Main content with semantic HTML */}
        <main>
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

          {/* Current launches section */}
          <section aria-labelledby="current-launches">
            {startups.length > 0 ? (
              <div className="flex flex-col gap-2" role="list">
                {startups.map((startup: Startup) => (
                  <div key={startup.id} role="listitem">
                    <Product startup={startup} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </section>

          {/* Winners section */}
          {lastWeekStartups.length > 0 && (
            <section aria-labelledby="winners-section" className="mt-12">
              <h2
                id="winners-section"
                className="text-3xl font-semibold my-8 px-2.5"
              >
                Last week winners
              </h2>
              <div className="flex flex-col gap-2" role="list">
                {lastWeekStartups.map((winner) => (
                  <div key={winner.id} role="listitem">
                    <WinnerProduct
                      winner={winner}
                      showCup={winner.place <= 3}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
