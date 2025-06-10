"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, Rocket, List, Grid } from "lucide-react";
import { DIRECTORIES } from "@/constants/directories";
import { cn } from "@/lib/utils";
import Head from "next/head";

export default function StartupDirectories() {
  const [isListView, setIsListView] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedCheckedItems = localStorage.getItem("startupDirectoriesChecked");
    if (savedCheckedItems) {
      setCheckedItems(JSON.parse(savedCheckedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "startupDirectoriesChecked",
      JSON.stringify(checkedItems),
    );
  }, [checkedItems]);

  const handleDirectoryClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Best Startup Launch Directories 2025 - Where to Launch Your Startup",
    description:
      "Complete list of the best platforms and directories to launch your startup, reach early adopters, find investors, and grow your customer base.",
    url: typeof window !== "undefined" ? window.location.href : "",
    mainEntity: {
      "@type": "ItemList",
      name: "Startup Launch Directories",
      numberOfItems: DIRECTORIES?.length || 0,
      itemListElement:
        DIRECTORIES?.map((directory, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "WebSite",
            name: directory.name,
            description: directory.description,
            url: directory.url,
            category: directory.category,
          },
        })) || [],
    },
    author: {
      "@type": "Person",
      name: "Anton Yefanov",
      url: "https://x.com/anton_yefanov",
    },
    dateModified: new Date().toISOString(),
    inLanguage: "en-US",
  };

  return (
    <>
      <Head>
        <title>
          Best Startup Launch Directories 2025 - Where to Launch Your Startup
        </title>
        <meta
          name="description"
          content="Discover the best platforms and directories to launch your startup in 2025. Find early adopters, investors, and customers with our curated list of launch platforms including Product Hunt, Hacker News, and more."
        />
        <meta
          name="keywords"
          content="startup launch directories, where to launch startup, startup launch platforms, product hunt alternatives, startup marketing, launch checklist, startup submission sites, entrepreneur resources, startup promotion"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Anton Yefanov" />
        <link
          rel="canonical"
          href={typeof window !== "undefined" ? window.location.href : ""}
        />

        {/* Open Graph tags */}
        <meta
          property="og:title"
          content="Best Startup Launch Directories 2025 - Where to Launch Your Startup"
        />
        <meta
          property="og:description"
          content="Complete curated list of the best platforms to launch your startup and reach your target audience."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={typeof window !== "undefined" ? window.location.href : ""}
        />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Best Startup Launch Directories 2025"
        />
        <meta
          name="twitter:description"
          content="Discover the best platforms to launch your startup and reach early adopters."
        />
        <meta name="twitter:creator" content="@anton_yefanov" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* SEO-optimized header section */}
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
              Discover the best platforms and directories to launch your
              startup, reach early adopters, find investors, and grow your
              customer base. Our curated list includes Product Hunt, Hacker
              News, and dozens of other proven launch platforms.
            </p>

            {/* Additional SEO content */}
            <div className="max-w-4xl mx-auto text-left mt-8 p-6 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">
                Why Use Startup Launch Directories?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Launching your startup on the right platforms can make the
                difference between success and obscurity. These directories help
                you reach your target audience, gain early traction, and build
                credibility in the startup ecosystem.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">
                    For Early-Stage Startups:
                  </h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Gain initial user feedback</li>
                    <li>• Build brand awareness</li>
                    <li>• Attract early adopters</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    For Growth-Stage Startups:
                  </h4>
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

          {/* Main content with semantic HTML */}
          <main>
            {isListView ? (
              <section
                className="space-y-3 max-w-4xl mx-auto"
                aria-label="Startup launch directories checklist"
              >
                <h3 className="sr-only">Startup Launch Checklist</h3>
                {DIRECTORIES?.map((directory, index) => {
                  const IconComponent = directory.icon;
                  const directoryId = `directory-${index}`;

                  return (
                    <article
                      key={index}
                      className="flex items-center gap-4 p-4 bg-card border border-border/50 rounded-lg hover:border-primary/20 transition-all"
                    >
                      <Checkbox
                        id={directoryId}
                        checked={checkedItems[directoryId]}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(directoryId, checked === true)
                        }
                        className="h-5 w-5"
                        aria-label={`Mark ${directory.name} as completed`}
                      />
                      <div
                        style={{ backgroundColor: directory.bgColor }}
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      >
                        <IconComponent
                          style={{ color: directory.iconColor }}
                          className="size-5"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-base">
                            {directory.name}
                          </h4>
                          <Badge
                            variant="outline"
                            className="text-xs hidden md:flex"
                          >
                            {directory.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {directory.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDirectoryClick(directory.url)}
                        className="ml-2 p-2 rounded-full hover:bg-muted hidden md:flex transition-colors"
                        aria-label={`Visit ${directory.name} website`}
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </article>
                  );
                }) || []}
              </section>
            ) : (
              <section
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                aria-label="Startup launch directories grid"
              >
                <h3 className="sr-only">Browse Startup Launch Platforms</h3>
                {DIRECTORIES?.map((directory, index) => {
                  const IconComponent = directory.icon;

                  return (
                    <Card
                      key={index}
                      onClick={() => handleDirectoryClick(directory.url)}
                      className="group cursor-pointer transition-all duration-150 hover:shadow-lg hover:scale-[1.02] border-border/50 hover:border-primary/20 p-0"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleDirectoryClick(directory.url);
                        }
                      }}
                      aria-label={`Visit ${directory.name} - ${directory.description}`}
                    >
                      <CardContent className="p-6">
                        <article className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                style={{ backgroundColor: directory.bgColor }}
                                className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors"
                              >
                                <IconComponent
                                  style={{ color: directory.iconColor }}
                                  className="size-6"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                                  {directory.name}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className="text-xs mt-1"
                                >
                                  {directory.category}
                                </Badge>
                              </div>
                            </div>
                            <ExternalLink
                              className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0"
                              aria-hidden="true"
                            />
                          </div>

                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {directory.description}
                          </p>
                        </article>
                      </CardContent>
                    </Card>
                  );
                }) || []}
              </section>
            )}
          </main>

          {/* Enhanced footer with SEO content */}
          <footer className="text-center mt-16 space-y-6">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Rocket className="size-4" />
              <p className="text-sm">
                {isListView
                  ? "Use this startup launch checklist to track your submissions across all platforms"
                  : "Click on any startup directory to visit their website and begin your launch journey"}
              </p>
            </div>

            {/* FAQ Section for SEO */}
            <div className="max-w-4xl mx-auto text-left mt-8 p-6 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-1">
                    When should I launch my startup on these directories?
                  </h4>
                  <p className="text-muted-foreground">
                    Launch when you have a working product or MVP, clear value
                    proposition, and can handle increased traffic and user
                    feedback.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">
                    How many directories should I submit to?
                  </h4>
                  <p className="text-muted-foreground">
                    Start with 5-10 most relevant platforms, then gradually
                    expand. Quality and relevance matter more than quantity.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">
                    What&#39;s the best startup launch strategy?
                  </h4>
                  <p className="text-muted-foreground">
                    Prepare compelling copy, visuals, and have a plan for
                    engaging with users who discover your startup through these
                    platforms.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground/70">
              Last updated: {new Date().toLocaleDateString()} | Free startup
              launch directory list
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
