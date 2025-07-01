import LaunchWeek from "@/app/(with-header)/my-startups/launch/[startupId]/_components/launch-week";

export type LaunchWeekData = {
  id: string;
  startDate: string;
  endDate: string;
  currentStartups: number;
  maxSlots: number;
  availableSlots: number;
  freeAvailable: boolean;
  premiumAvailable: boolean;
};

async function getLaunchWeeks(): Promise<LaunchWeekData[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/launch-weeks`,
      {
        cache: "no-store", // Always fetch fresh data
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch launch weeks");
    }

    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error("Error fetching launch weeks:", error);
    return [];
  }
}

export default async function StartupLaunchPage() {
  const launchWeeks = await getLaunchWeeks();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-3">Select launch week</h1>
      <div className="flex flex-col gap-2 mb-2">
        {launchWeeks.length > 0 ? (
          launchWeeks
            .slice(0, 6)
            .map((week) => <LaunchWeek key={week.id} launchWeekData={week} />)
        ) : (
          <div className="text-center py-8 text-gray-500">
            No launch weeks available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
