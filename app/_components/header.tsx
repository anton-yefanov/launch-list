import { Badge } from "@/components/ui/badge";
import { DIRECTORIES } from "@/constants/directories";
import { cn } from "@/lib/utils";
import { Grid, List } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Header({
  isListView,
  setIsListView,
}: {
  isListView: boolean;
  setIsListView: (value: boolean) => void;
}) {
  return (
    <header className="text-center mb-12 space-y-6">
      <a
        href="https://x.com/anton_yefanov"
        target="_blank"
        className="block mb-4 w-fit mx-auto text-gray-500 hover:text-foreground transition hover:underline"
      >
        by Anton
      </a>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
        Best Startup Launch Directories 2025
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground">
        Where to Launch Your Startup
      </h2>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        Discover the best platforms and directories to launch your startup,
        reach early adopters, find investors, and grow your customer base. Our
        curated list includes Product Hunt, Hacker News, and dozens of other
        proven launch platforms.
      </p>
      <div className="max-w-4xl mx-auto text-left mt-8 p-6 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">
          Why Use Startup Launch Directories?
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Launching your startup on the right platforms can make the difference
          between success and obscurity. These directories help you reach your
          target audience, gain early traction, and build credibility in the
          startup ecosystem.
        </p>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">For Early-Stage Startups:</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Gain initial user feedback</li>
              <li>• Build brand awareness</li>
              <li>• Attract early adopters</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">For Growth-Stage Startups:</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Scale customer acquisition</li>
              <li>• Find potential investors</li>
              <li>• Establish market presence</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 md:gap-2 mt-6 flex-col md:flex-row">
        <Badge variant="secondary" className="text-sm gap-2">
          <div className="flex items-center gap-2 pl-1">
            <div className="relative size-2">
              <div className="absolute size-2 bg-green-500 rounded-full" />
              <div className="absolute size-2 bg-green-500 rounded-full animate-ping opacity-75" />
            </div>
          </div>
          {DIRECTORIES?.length || 0} Launch Platforms Available
        </Badge>
        <div className="flex items-center space-x-2 ml-4">
          <span
            className={cn(
              "text-sm",
              isListView ? "text-muted-foreground" : "text-foreground",
            )}
          >
            Grid
          </span>
          <Grid
            className={`size-4 ${!isListView ? "text-primary" : "text-muted-foreground"}`}
          />
          <Switch
            checked={isListView}
            onCheckedChange={setIsListView}
            id="view-mode"
            aria-label="Toggle between grid and checklist view"
          />
          <List
            className={`size-4 ${isListView ? "text-primary" : "text-muted-foreground"}`}
          />
          <span
            className={cn(
              "text-sm",
              isListView ? "text-foreground" : "text-muted-foreground",
            )}
          >
            Launch Checklist
          </span>
        </div>
      </div>
    </header>
  );
}
