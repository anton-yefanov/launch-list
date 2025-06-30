import LaunchWeek from "@/app/(with-header)/my-startups/launch/[startupId]/_components/launch-week";

export default function StartupLaunchPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-3">Select launch week</h1>
      <div className="flex flex-col gap-2 mb-2">
        <LaunchWeek />
        <LaunchWeek />
        <LaunchWeek />
        <LaunchWeek />
      </div>
      {/*<div className="mb-1 font-medium text-lg">Preview</div>*/}
      {/*<Product />*/}
    </div>
  );
}
